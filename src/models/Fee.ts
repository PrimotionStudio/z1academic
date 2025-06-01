import mongoose, { Schema, Document } from "mongoose";

interface IFee extends Document {
  label: string;
  amount: number;
}

const FeeSchema = new Schema<IFee>(
  {
    label: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Fee || mongoose.model("Fee", FeeSchema);
