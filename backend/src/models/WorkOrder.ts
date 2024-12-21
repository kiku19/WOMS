import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkOrder extends Document {
  contractorId: mongoose.Types.ObjectId; 
  paymentTerms: number;                 
  dueDate: Date;                         
  userId: mongoose.Types.ObjectId;    
}

const WorkOrderSchema: Schema<IWorkOrder> = new Schema(
  {
    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contractors',
      required: true,
      unique:true
    },
    paymentTerms: {
      type: Number,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
  },
  {
    timestamps: true,
  }
);

const WorkOrder = mongoose.model<IWorkOrder>('WorkOrders', WorkOrderSchema);
export default WorkOrder;
