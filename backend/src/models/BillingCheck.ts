import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBillingCheck extends Document {
  userId: Types.ObjectId;
  createdAt: Date;
}

const BillingCheck: Schema<IBillingCheck> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

BillingCheck.index({ createdAt: 1 }, { expireAfterSeconds: 30 });

const model = mongoose.model<IBillingCheck>("BillingCheck", BillingCheck);
export default model;
