import "@/models/User";
import { v4 as uuidv4 } from "uuid";
import mongoose, { Document, Schema } from "mongoose";

interface ITransactionSchema extends Document {
  transactionId: string;
  userId: Schema.Types.ObjectId;
  amount: string;
  status: "Pending" | "Success" | "Failed";
}

const TransactionSchema = new Schema<ITransactionSchema>(
  {
    transactionId: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Transaction ||
  mongoose.model<ITransactionSchema>("Transaction", TransactionSchema);
