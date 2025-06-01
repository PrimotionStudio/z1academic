import "@/models/Faculty";
import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    maxLevels: {
      type: Number,
      required: true,
    },
    programTitle: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Department ||
  mongoose.model("Department", DepartmentSchema);
