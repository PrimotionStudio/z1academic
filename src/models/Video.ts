import "@/models/Course";
import "@/models/User";
import mongoose, { Schema } from "mongoose";

const VideoSchema = new Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    fileLink: { type: String, required: true },
    coverImage: { type: String, required: true },
    publishedStatus: {
      type: String,
      enum: ["unpublished", "published"],
      default: "unpublished",
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);
