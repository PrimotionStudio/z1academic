import "@/models/Course";
import "@/models/Department";
import "@/models/Semester";
import mongoose, { Schema } from "mongoose";

const ElectiveSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    semester: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Elective ||
  mongoose.model("Elective", ElectiveSchema);
