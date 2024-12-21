import { Request, Response, Router } from "express";
import WorkOrder, { IWorkOrder } from "../models/WorkOrder.ts";
import mongoose, { Types } from "mongoose";
import WorkOrderLocation from "../models/WorkOrderLocations.ts";
import {Location} from "../models/Location.ts";

const router = Router();

// Create a new work order
router.post("/", async (req: Request, res: Response) => {
  try {
    const { contractorId, paymentTerms, dueDate } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(contractorId) ||
      !contractorId?.trim()
    ) {
      res.status(400).json({ message: "Invalid contractorId format." });
      return;
    }

    if (isNaN(paymentTerms) || paymentTerms < 1) {
      res.status(400).json({ message: "Invalid paymentTerms format." });
      return;
    }

    if (!dueDate?.trim() || isNaN(Date.parse(dueDate))) {
      res.status(400).json({ message: "Invalid dueDate format." });
      return;
    }

    const newWorkOrder = new WorkOrder({
      contractorId: new Types.ObjectId(contractorId as string),
      paymentTerms: parseFloat(paymentTerms),
      dueDate: new Date(dueDate).setUTCHours(0, 0, 0, 0),
      userId: new Types.ObjectId(req.tokenData.userId),
    });

    await newWorkOrder.save();

    const workOrder: any = await WorkOrder.findOne({ _id: newWorkOrder._id })
      .populate("contractorId")
      .lean();

    workOrder["contractor"] = workOrder["contractorId"].name;

    delete workOrder["contractorId"];

    res
      .status(201)
      .json({ message: "Work order saved successfully.", workOrder });
  } catch (error: any) {
    if (error?.code == 11000 && "contractorId" in error.keyPattern) {
      res
        .status(409)
        .json({ message: "Contractor already has a work order.", code: 1 });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Failed to create work order" });
    return;
  }
});

router.post("/location", async (req: Request, res: Response) => {
  try {
    const { workOrderId, _id: locationId, rate, quantity } = req.body;

    if (!workOrderId || !locationId || !rate || !quantity) {
      res
        .status(400)
        .json({ error: "Invalid input. All fields are required." });
      return;
    }

    if (
      !mongoose.Types.ObjectId.isValid(workOrderId) ||
      !mongoose.Types.ObjectId.isValid(locationId) ||
      isNaN(rate) ||
      isNaN(quantity)
    ) {
      res.status(400).json({
        error:
          "Invalid input types, workOrderId and contractorId should be of type objectId and, rate and quantity should be of type number or float",
      });
      return;
    }

    const location = await Location.findOne({
      _id: new Types.ObjectId(locationId as string),
      state: "Completed",
    });

    if(location){
      res.status(409).json({message:"Location already marked as completed."})
      return
    }

    const workOrder = await WorkOrder.findOne({
      _id: new Types.ObjectId(workOrderId as string),
    }).lean();

    if (!workOrder) {
      throw { message: "Work order with the specified id not found." };
    }

    const newWorkOrderLocation = new WorkOrderLocation({
      workOrderId,
      locationId,
      contractorId: workOrder.contractorId,
      rate,
      quantity,
      userId: new Types.ObjectId(req.tokenData.userId),
    });

    const savedLocation = await newWorkOrderLocation.save();

    res.status(201).json(savedLocation);
    return;
  } catch (error: any) {
    if (
      error.code == 11000 &&
      "contractorId" in error.keyPattern &&
      "locationId" in error.keyPattern
    ) {
      res.status(500).json({
        message: "location already exists in the work order.",
        code: 1,
      });
      return;
    }
    console.error("Error saving work order location:", error);
    res.status(500).json({ error: "Failed to save work order location" });
    return;
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.tokenData.userId;

    const results: any = await WorkOrder.find({
      userId: new Types.ObjectId(userId),
    })
      .populate("contractorId")
      .lean();

    const workOrders = results.map((result: any) => {
      const workOrder = {
        ...result,
        contractor: result.contractorId.name as string,
      };
      delete workOrder["contractorId"];
      return workOrder;
    });

    res.status(200).json(workOrders);
    return;
  } catch (error) {
    console.error("Error saving work order location:", error);
    res.status(500).json({ error: "Failed to save work order location" });
    return;
  }
});

router.get("/locations", async (req: Request, res: Response) => {
  try {
    const userId = req.tokenData.userId;

    const workOrderId: string = req.query.workOrderId as string;

    if (!workOrderId) {
      res.status(500).json({ message: "workOrderId is required" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(workOrderId)) {
      res.status(500).json({ message: "workOrderId is not of valid type" });
      return;
    }

    const results: any = await WorkOrderLocation.aggregate([
      {
        $match: {
          workOrderId: new Types.ObjectId(workOrderId),
          isDeleted: false,
        },
      },
      {
        $limit: 100,
      },
      {
        $lookup: {
          from: "locations",
          let: {
            locationId: "$locationId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$locationId", "$_id"],
                },
              },
            },
            {
              $lookup: {
                from: "entities",
                localField: "entityId",
                foreignField: "_id",
                as: "entity",
              },
            },
          ],
          as: "location",
        },
      },
    ]);

    results.forEach((workOrderLocation: any) => {
      workOrderLocation["entity"] =
        workOrderLocation["location"][0].entity[0].name;
      workOrderLocation["location"] = workOrderLocation["location"][0].name;
      workOrderLocation["saved"] = true;
    });

    const workOrders = results.map((result: any) => {
      const workOrder = {
        ...result,
        contractor: result.contractorId.name as string,
      };
      delete workOrder["contractorId"];
      return workOrder;
    });

    res.status(200).json(workOrders);
    return;
  } catch (error: any) {
    console.error("Error saving work order location:", error);
    res.status(500).json({ error: "Failed to save work order location" });
    return;
  }
});

export default router;
