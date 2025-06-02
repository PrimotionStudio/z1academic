import "@/models/Lecturer";
import "@/models/Department";
import "@/models/Semester";
import mongoose, { Schema, Document } from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    units: {
      type: Number,
      required: true,
    },
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecturer",
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    semesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
