import mongoose, { Schema, Document } from "mongoose";

interface IContractor extends Document {
  name: string;
  phone: string;
  userId: mongoose.Types.ObjectId;
}

const ContractorSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true
    },
    phone: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

export const Contractor = mongoose.model<IContractor>(
  "Contractors",
  ContractorSchema
);
