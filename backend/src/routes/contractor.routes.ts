import { Router, Request, Response } from "express";
import { Contractor } from "../models/Contractor.js";
import mongoose, { Types } from "mongoose";
import WorkOrderLocation from "../models/WorkOrderLocations.js";

const router = Router();

// Add a contractor
router.post("/", async (req: Request, res: Response) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    res.status(400).json({ message: "Name and phone are required." });
    return;
  }

  try {
    const newContractor = new Contractor({
      name,
      phone,
      userId: req.tokenData.userId,
    });
    await newContractor.save();
    res.status(201).json({
      message: "Contractor added successfully.",
      contractor: newContractor,
    });
    return;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      res
        .status(400)
        .json({ message: "Phone number already exists.", code: 1 });
      return;
    } else {
      res.status(500).json({ message: "Server error.", error });
      return;
    }
  }
});

// Get all contractors
router.get("/", async (req: Request, res: Response) => {
  try {
    const userId: string = req.tokenData.userId as string;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid user_id format." });
      return;
    }

    const contractors = await Contractor.find({
      userId: new Types.ObjectId(userId),
    }).sort({ createdAt: -1 });
    res.status(200).json(contractors);
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
    return;
  }
});

router.get("/search", async (req: Request, res: Response) => {
  try {
    const userId: string = req.tokenData.userId as string;
    const searchTerm: string = req.query.searchTerm as string;

    if (!searchTerm?.trim()) {
      res.status(200).send([]);
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid user_id format." });
      return;
    }

    const contractors = await Contractor.find({
      userId: new Types.ObjectId(userId),
      name: new RegExp(`${searchTerm}`,'gi'),
    })
      .sort({ createdAt: -1 })
      .limit(7);
    res.status(200).json(contractors);
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
    return;
  }
});

router.get("/searchWithLocation", async (req: Request, res: Response) => {
  try {
    const userId: string = req.tokenData.userId as string;
    const searchTerm: string = req.query.searchTerm as string;

    const locationId: string = req.query.locationId as string;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      res.status(400).json({ message: "Invalid user_id format." });
      return;
    }

    const query = [
      {
        $match: {
          locationId: new Types.ObjectId(locationId),
        },
      },
      {
        $lookup: {
          from: "contractors",
          localField: "contractorId",
          foreignField: "_id",
          as: "contractor",
        },
      },
      {
        $unwind: {
          path: "$contractor",
        },
      },
      {
        $match: {
          "contractor.name": new RegExp(searchTerm, "gi"),
        },
      },
      {
        $skip: 0,
      },
      {
        $limit: 30,
      },
      {
        $replaceRoot:{
          newRoot:"$contractor"
        }
      }
    ];

    if (!searchTerm.trim()) {
      query.splice(3,1)
    }

    const contractors = await WorkOrderLocation.aggregate(query);

    res.status(200).json(contractors);
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
    return;
  }
});

export default router;
