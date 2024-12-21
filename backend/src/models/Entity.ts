import mongoose, { Schema, Document } from "mongoose";

export interface IEntity extends Document {
  name: string;
  userId: mongoose.Types.ObjectId;
  locationCount: number;
}

const EntitySchema: Schema = new Schema(
  {
    name: { type: String, required: true , unique:true},
    userId: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
    locationCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Entity = mongoose.model<IEntity>("Entities", EntitySchema);
