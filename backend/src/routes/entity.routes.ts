import { Router, Request, Response } from "express";
import { Entity } from "../models/Entity.ts";
import mongoose, { Types } from "mongoose";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = req.tokenData.userId

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Invalid userId format." });
    return;
  }

  try {
    const newEntity = new Entity({
      name,
      userId: new Types.ObjectId(userId as string),
    });
    await newEntity.save();
    res
      .status(201)
      .json({ message: "Entity added successfully.", entity: newEntity });
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

  try {
    const entities = await Entity.find({
      userId: new Types.ObjectId(userId as string),
    });
    res.status(200).json(entities);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
});

router.get("/search", async (req: Request, res: Response) => {
  const userId = req.tokenData.userId;
  const searchTerm:string = req.query.searchTerm as string

  if(!searchTerm?.trim()){
    res.status(200).send([])
    return
  }
  try {
    const entities = await Entity.find({
      userId: new Types.ObjectId(userId as string),
      name:new RegExp(`${searchTerm}`,'gi')
    }).limit(7);
    res.status(200).json(entities);
    return
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
});

export default router;
