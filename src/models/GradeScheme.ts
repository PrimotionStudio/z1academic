import "@/models/Semester";
import "@/models/Department";
import mongoose, { Schema, type Document } from "mongoose";

export interface AssessmentType {
  name: string;
  score: number;
}

export interface GradeScheme extends Document {
  assessmentTypes: AssessmentType[];
  department: Schema.Types.ObjectId;
  totalScore: number;
  level: number;
  maxCourseUnits: number;
  semester: Schema.Types.ObjectId;
}

const AssessmentTypeSchema = new Schema({
  name: {
    type: String,
    required: [true, "Assessment type name is required"],
    trim: true,
  },
  score: {
    type: Number,
    required: [true, "Score is required"],
    min: [1, "Score must be at least 1"],
    max: [100, "Score cannot exceed 100"],
  },
});

const GradeSchemeSchema = new Schema(
  {
    assessmentTypes: {
      type: [AssessmentTypeSchema],
      validate: {
        validator: (assessmentTypes: AssessmentType[]) =>
          assessmentTypes.length > 0,
        message: "At least one assessment type is required",
      },
    },
    totalScore: {
      type: Number,
      default: 100,
      validate: {
        validator: (value: number) => value === 100,
        message: "Total score must equal 100",
      },
    },
    level: {
      type: Number,
      required: true,
    },
    maxCourseUnits: {
      type: Number,
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    semester: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

GradeSchemeSchema.pre("save", function (next) {
  const totalScore = this.assessmentTypes.reduce(
    (sum, type) => sum + type.score,
    0,
  );
  this.totalScore = totalScore;
  if (totalScore !== 100) {
    return next(new Error("Total score must equal 100"));
  }
  next();
});

GradeSchemeSchema.pre("save", async function (next) {
  if (
    !this.isNew &&
    !this.isModified("level") &&
    !this.isModified("department") &&
    !this.isModified("semester")
  )
    return next();

  const exists = await mongoose.models.GradingScheme.findOne({
    _id: { $ne: this._id },
    level: this.level,
    department: this.department,
    semester: this.semester,
  });

  if (exists)
    return next(
      new Error(
        "A grading scheme for this level, department, and semester already exists.",
      ),
    );

  next();
});

export default mongoose.models.GradingScheme ||
  mongoose.model<GradeScheme>("GradingScheme", GradeSchemeSchema);
