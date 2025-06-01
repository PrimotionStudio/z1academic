import mongoose, { Schema, Document, Model } from "mongoose";

interface ISemester extends Document {
  name: string;
  isActive: boolean;
}

interface ISemesterModel extends Model<ISemester> {
  toggleActive: (sessionId: string) => Promise<void>;
}

const SemesterSchema = new Schema<ISemester>(
  {
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

SemesterSchema.statics.toggleActive = async function (semesterId: string) {
  await this.updateMany({}, { isActive: false });
  await this.findByIdAndUpdate(semesterId, { isActive: true });
};

export default (mongoose.models.Semester as ISemesterModel) ||
  mongoose.model<ISemester, ISemesterModel>("Semester", SemesterSchema);
