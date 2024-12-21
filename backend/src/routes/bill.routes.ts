import { Request, Response, Router } from "express";
import WorkOrder from "../models/WorkOrder.ts";
import mongoose, { Types } from "mongoose";
import BillingCheck from "../models/BillingCheck.ts";
import WorkOrderLocations from "../models/WorkOrderLocations.ts";
import Bills from "../models/Bills.ts";

const router = Router();

// Create a new work order
// router.post("/", async (req: Request, res: Response) => {
//   try {
//     const result = await BillingCheck.findOne({
//       userId: new Types.ObjectId(req.tokenData.userId),
//     });
//     if (result) {
//       res.status(423).json({
//         error: "The Process is currently locked and cannot be started again.",
//       });
//       return;
//     }

//     //SET THE TIMER FOR 10 SECONDS
//     await BillingCheck.create({
//       userId: new Types.ObjectId(req.tokenData.userId),
//       createdAt: new Date(),
//     });

//     const billingProcessId = new Types.ObjectId();
//     let skip = 0;
//     let limit = 100;

//     while (true) {
//       const locationsBasedOnContractor = await WorkOrderLocations.aggregate([
//         {
//           $match: {
//             billed: false,
//             state: "Completed",
//           },
//         },
//         {
//           $sort: {
//             contractorId: 1,
//           },
//         },
//         {
//           $skip: limit * skip,
//         },
//         {
//           $limit: limit,
//         },
//         {
//           $group: {
//             _id: "$contractorId",
//             totalAmount: {
//               $sum: { $multiply: ["$rate", "quantity"] },
//             },
//             locations: {
//               $push: {
//                 locationId: "$locationId",
//                 rate: "$rate",
//                 quantity: "$quantity",
//               },
//             },
//           },
//         },
//         {
//           $lookup: {
//             from: "Bills",
//             let: {
//               contractorId: "$_id",
//             },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       {
//                         $eq: ["$$contractorId", "$contractorId"],
//                       },
//                       {
//                         $eq: [billingProcessId, "$billingProcessId"],
//                       },
//                       {
//                         $eq: [
//                           "$userId",
//                           new Types.ObjectId(req.tokenData.userId),
//                         ],
//                       },
//                     ],
//                   },
//                 },
//               },
//             ],
//             as: "bill",
//           },
//         },
//         {
//           $unwind: {
//             path: "$bill",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//       ]);

//       if (!locationsBasedOnContractor.length) break;

//       const billUpdates = [];
//       const locationUpdates = [];
//       const billInserts = [];

//       for (const workOrder of locationsBasedOnContractor) {
//         const bill = workOrder.bill;

//         let billNo = bill?.billNo;

//         if (bill) {
//           billUpdates.push({
//             updateOne: {
//               filter: {
//                 userId: new Types.ObjectId(req.tokenData.userId),
//                 billingProcessId,
//                 contractorId: workOrder._id,
//               },
//               update: {
//                 $inc: { totalAmount: workOrder.totalAmount },
//               },
//             },
//           });
//         } else {
//           billNo = await getBillNo(req.tokenData.userId);
//           billInserts.push({
//             insertOne: {
//               document: {
//                 userId: new Types.ObjectId(req.tokenData.userId),
//                 billingProcessId,
//                 contractorId: workOrder._id,
//                 totalAmount: workOrder.totalAmount,
//                 billNo,
//               },
//             },
//           });
//         }

//         locationUpdates.push({
//           updateMany: {
//             filter: {
//               contractorId: workOrder._id,
//               status: "Completed",
//               billed: false,
//             },
//             update: { $set: { billed: true, billNo } },
//           },
//         });
//       }

//       // Perform bulk writes
//       if (billUpdates.length > 0) {
//         await Bills.bulkWrite(billUpdates);
//       }

//       if (billInserts.length > 0) {
//         await Bills.bulkWrite(billInserts);
//       }

//       if (locationUpdates.length > 0) {
//         await WorkOrderLocations.bulkWrite(locationUpdates);
//       }

//       skip++;
//     }
//     //RESET THE TIMER FOR 10 SECONDS
//     await BillingCheck.deleteOne({
//       userId: new Types.ObjectId(req.tokenData.userId),
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to create work order" });
//   }
// });

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
