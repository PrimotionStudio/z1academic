import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema(
  {
    instituitionName: {
      type: String,
      required: true,
    },
    instituitionEmail: {
      type: String,
      required: true,
    },
    instituitionPhone: String,
    photo: String,
  },
  { timestamps: true },
);

export default mongoose.models.Config || mongoose.model("Config", ConfigSchema);
