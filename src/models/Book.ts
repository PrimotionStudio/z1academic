import mongoose, { Schema } from "mongoose";

const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String },
    author: { type: String, required: true },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    fileLink: { type: String, required: true },
    coverImage: { type: String, required: true },
    publishedStatus: {
      type: String,
      enum: ["unpublished", "published"],
      default: "unpublished",
    },
    requestedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
