import mongoose, { Schema, Types } from "mongoose";

export interface IBillNo extends Document {
  sequence: 0;
  userId: Types.ObjectId;
}

const BillNoSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  sequence: {
    type: Number,
    required: true,
  },
});

const model = mongoose.model<IBillNo>("BillingCheck", BillNoSchema);
export default model;