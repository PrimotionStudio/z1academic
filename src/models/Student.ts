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
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
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
