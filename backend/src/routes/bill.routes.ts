import { Request, Response, Router } from "express";
import mongoose, { Types } from "mongoose";
import WorkOrderLocations from "../models/WorkOrderLocations.js";
import Bills from "../models/Bills.js";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const check = await WorkOrderLocations.findOne({
      userId: new Types.ObjectId(req.tokenData.userId),
      billed: false,
      state: "Completed",
    });

    if (!check) {
      res.status(404).json({
        code: 1,
        message: "None of the locations are marked as completed.",
      });
      return;
    }

    const billingProcessId = new Types.ObjectId();
    await Promise.all([
      WorkOrderLocations.updateMany(
        {
          userId: new Types.ObjectId(req.tokenData.userId),
          billed: false,
          state: "Completed",
        },
        {
          $set: {
            billed: true,
            billingProcessId,
          },
        }
      ),
      Bills.updateMany(
        {
          userId: new Types.ObjectId(req.tokenData.userId),
          billingProcessId: { $exists: false },
        },
        { $set: { billingProcessId, billedAt: new Date() } }
      ),
    ]);

    res.status(200).json({ message: "Bill generated successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate bill." });
    return;
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId: string = req.tokenData.userId as string;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid user_id format." });
      return;
    }

    const bills = await Bills.find({
      billingProcessId: { $exists: true },
      userId,
    })
      .skip(0)
      .limit(100)
      .populate("contractorId")
      .lean();

    bills.forEach((bill: any) => {
      bill["contractor"] = bill["contractorId"].name;
      delete bill["contractorId"];
    });

    res.status(200).json(bills);
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
    return;
  }
});

router.get("/detail", async (req: Request, res: Response) => {
  try {
    const userId: string = req.tokenData.userId as string;
    const billId:string = req.query?.billId as string

    if (!mongoose.Types.ObjectId.isValid(userId) ||!mongoose.Types.ObjectId.isValid(billId)) {
      res.status(400).json({ message: "Invalid userId/billId format." });
      return;
    }

    const bills = await Bills.aggregate([
      {
        $match:{
          _id:new Types.ObjectId(billId)
        }
      },
      {
        $lookup: {
          from: "workorderlocations",
          let: {
            billingProcessId: "$billingProcessId",
            contractorId: "$contractorId"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        "$$billingProcessId",
                        "$billingProcessId"
                      ]
                    },
                    {
                      $eq: [
                        "$$contractorId",
                        "$contractorId"
                      ]
                    }
                  ]
                }
              }
            },
            {
              $lookup: {
                from: "locations",
                localField: "locationId",
                foreignField: "_id",
                as: "location"
              }
            },
            {
              $unwind: {
                path: "$location"
              }
            }
          ],
          as: "bills"
        }
      },
      {
        $unwind: {
          path: "$bills"
        }
      },
      {
        $addFields: {
          rate: "$bills.rate",
          quantity: "$bills.quantity",
          location: "$bills.location.name"
        }
      },
      {
        $project: {
          rate: 1,
          quantity: 1,
          location: 1,
          _id: 0
        }
      }
    ])

    res.status(200).json(bills);
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
    return;
  }
});

export default router;
