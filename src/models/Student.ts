import "@/models/User";
import "@/models/Department";
import mongoose, { Document, Schema } from "mongoose";

interface IStudent extends Document {
  userId: Schema.Types.ObjectId;
  department: Schema.Types.ObjectId;
  level: number;
}

const StudentSchema = new Schema<IStudent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      refuired: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    level: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
