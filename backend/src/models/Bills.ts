import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBill extends Document {
  userId: Types.ObjectId;
  billNo?: number;
  totalAmount: number;
  contractorId: Types.ObjectId;
  billingProcessId?: Types.ObjectId;
  billedAt?:Date
}

const BillSchema: Schema<IBill> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  billingProcessId:{
    type: mongoose.Schema.Types.ObjectId,
  },
  billNo: {
    type: Number,
  },
  billedAt: {
    type: Date,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'Contractors'
  },
});

const model = mongoose.model<IBill>("Bills", BillSchema);
export default model;
