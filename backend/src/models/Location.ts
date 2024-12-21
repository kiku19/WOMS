import mongoose, { Schema, Document } from "mongoose";

export interface ILocation extends Document {
  name: string;
  state: "Ready" | "Completed"; 
  entityId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const LocationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    state: { type: String, enum: ["Ready", "Completed"], default: "Ready" },
    entityId: { type: Schema.Types.ObjectId, required: true, ref: "Entities" },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
  },
  {
    timestamps: true,
  }
);

export const Location = mongoose.model<ILocation>("Locations", LocationSchema);
