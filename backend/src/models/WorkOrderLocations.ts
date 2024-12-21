import mongoose, { Schema, Document } from "mongoose";

export interface IWorkOrderLocation extends Document {
  workOrderId: mongoose.Types.ObjectId;
  locationId: mongoose.Types.ObjectId;
  rate: number;
  quantity: number;
  contractorId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  state: "Ready" | "Completed";
  billed: boolean;
  billingProcessId?: mongoose.Types.ObjectId;
  isDeleted: boolean;
}

const WorkOrderLocationSchema: Schema<IWorkOrderLocation> = new Schema(
  {
    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contractors",
      required: true,
    },
    workOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkOrders",
      required: true,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Locations",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    billingProcessId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    rate: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    state: { type: String, enum: ["Ready", "Completed"], default: "Ready" },
    billed: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

//PREVENTS CREATING SAME LOCATION TWICE FOR A CONTRACT
WorkOrderLocationSchema.index(
  { contractorId: 1, locationId: 1 },
  { unique: true }
);

const WorkOrderLocation = mongoose.model<IWorkOrderLocation>(
  "WorkOrderLocation",
  WorkOrderLocationSchema
);
export default WorkOrderLocation;
