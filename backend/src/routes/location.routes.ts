import { Router, Request, Response } from "express";
import { Location } from "../models/Location.ts";
import { Entity } from "../models/Entity.ts";
import mongoose, { Types } from "mongoose";
import WorkOrderLocation from "../models/WorkOrderLocations.ts";
import Bills from "../models/Bills.ts";
import BillNo from "../models/BillNo.ts";

const router = Router();

// Add a location
router.post("/", async (req: Request, res: Response) => {
  const { name, entityId } = req.body;
  const userId = req.tokenData.userId;
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(entityId)
  ) {
    res.status(400).json({ message: "Invalid userId or entityId format." });
    return;
  }

  try {
    const entity = await Entity.findOne({
      _id: new Types.ObjectId(entityId as string),
      userId: new Types.ObjectId(userId as string),
    });
    if (!entity) {
      res.status(404).json({ message: "Entity not found for this user." });
      return;
    }

    const newLocation = new Location({
      name,
      entityId: new Types.ObjectId(entityId as string),
      userId: new Types.ObjectId(userId as string),
      state: "Ready",
    });

    await Entity.findOneAndUpdate(
      { _id: new Types.ObjectId(entityId as string) },
      { $inc: { locationCount: 1 } }
    );

    await newLocation.save();

    const location: any = await Location.findOne({ _id: newLocation._id })
      .populate("entityId")
      .lean();

    location["entity"] = location["entityId"].name;
    delete location["entityId"];

    res.status(201).json({ message: "Location added successfully.", location });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
});

router.get("/", async (req: Request, res: Response) => {
  const userId = req.tokenData.userId;

  if (!mongoose.Types.ObjectId.isValid(userId as string)) {
    res.status(400).json({ message: "Invalid userId format." });
    return;
  }

  try {
    const locations = await Location.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId as string),
        },
      },
      {
        $skip: 0,
      },
      {
        $limit: 100,
      },
      {
        $lookup: {
          from: "entities",
          localField: "entityId",
          foreignField: "_id",
          as: "entity",
        },
      },
      {
        $unwind: {
          path: "$entity",
        },
      },
      {
        $lookup: {
          from: "workorderlocations",
          let: {
            id: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$id", "$locationId"],
                },
              },
            },
            {
              $limit: 1,
            },
          ],
          as: "inWorkOrder",
        },
      },
      {
        $addFields: {
          entity: "$entity.name",
          inWorkOrder: { $size: "$inWorkOrder" },
        },
      },
    ]);

    res.status(200).json(locations);
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
      return;
    }
  }
});

router.get("/search", async (req: Request, res: Response) => {
  const userId = req.tokenData.userId;
  const searchTerm: string = req.query.searchTerm as string;

  if (!searchTerm?.trim()) {
    res.status(200).send([]);
    return;
  }
  try {
    const locations: any = await Location.find({
      userId: new Types.ObjectId(userId as string),
      name: new RegExp(`${searchTerm}`, "gi"),
      state: { $ne: "Completed" },
    })
      .limit(7)
      .populate("entityId")
      .lean();

    locations.forEach((location: any) => {
      location["entity"] = location["entityId"].name;
      delete location["entityId"];
    });

    res.status(200).json(locations);
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
});

router.put("/markAsCompleted", async (req: Request, res: Response) => {
  const { locationId, contractorId } = req.body;

  const userId = new Types.ObjectId(req.tokenData.userId);

  if (!locationId?.trim() || !mongoose.isValidObjectId(locationId)) {
    res.status(400).json({ error: "Invalid locationId" });
    return;
  }

  if (!contractorId?.trim() || !mongoose.isValidObjectId(contractorId)) {
    res.status(400).json({ error: "Invalid contractorId" });
    return;
  }

  try {
    //UPDATE STATUS IN MAIN LOCATION CONNECTION
    const updated = await Location.updateOne(
      { _id: new Types.ObjectId(locationId as string) },
      { $set: { state: "Completed" } },
      { timestamps: false }
    );

    if (!updated.modifiedCount) {
      res.status(409).json({
        code: 1,
        error: "Location not found/Document status is already completed.",
      });
      return;
    } else {
      await Location.updateOne(
        { _id: new Types.ObjectId(locationId as string) },
        { $set: { state: "Completed" } }
      );
    }
    const updatedWorkOrderLocations = await WorkOrderLocation.findOneAndUpdate(
      {
        locationId: new Types.ObjectId(locationId as string),
        contractorId: new Types.ObjectId(contractorId as string),
      },
      { $set: { state: "Completed" } },
      { new: true }
    );

    if (!updatedWorkOrderLocations) {
      const updatedLocation = await Location.findOneAndUpdate(
        { _id: new Types.ObjectId(locationId as string) },
        { $set: { state: "Ready" } },
        { new: true }
      );
      res.status(404).json({ error: "No matching work order locations found" });

      return;
    }

    const bill = await Bills.findOneAndUpdate(
      {
        userId,
        contractorId: new Types.ObjectId(contractorId as string),
        billingProcessId: { $exists: false },
      },
      {
        $inc: {
          totalAmount:
            updatedWorkOrderLocations.rate * updatedWorkOrderLocations.quantity,
        },
      },
      {
        upsert: true,
        new: true,
        includeResultMetadata: true,
      }
    );

    //DOCUMENT IS INSERTED GENERATE BILL NUMBER

    if (bill.lastErrorObject?.upserted) {
      const billNo = await getBillNo(userId);
      await Bills.findOneAndUpdate(
        { _id: bill.lastErrorObject?.upserted },
        { $set: { billNo } }
      );
    }
   
    res.status(200).json({
      message: "Status updated successfully",
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

const getBillNo = async (userId: Types.ObjectId) => {
  const billDocument = await BillNo.findOneAndUpdate(
    { userId },
    {
      $inc: { sequence: 1 },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true, // Ensures that default values are set if the document is created
    }
  );

  return billDocument.sequence;
};
export default router;
