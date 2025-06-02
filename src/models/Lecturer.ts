import "@/models/User";
import "@/models/Department";
import mongoose, { Document, Model, Schema } from "mongoose";

const LecturerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      unique: [true, "Cannot same lecturer to multiple department"],
      ref: "User",
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Lecturer ||
  mongoose.model("Lecturer", LecturerSchema);
