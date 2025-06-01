import mongoose, { Document, Schema } from "mongoose";
import { genSalt, hash } from "bcryptjs";

interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  activateToken?: string;
  photo?: string;
  verified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
  role:
    | "User"
    | "Student"
    | "Lecturer"
    | "Super Admin"
    | "Financial Officer"
    | "Admissions Officer"
    | "General Academics Officer"
    | "General Examination Officer"
    | "Department Academics Officer"
    | "Department Examination Officer";
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already registered"],
    },
    phone: {
      type: String,
      required: true,
      unique: [true, "Phone number already registered"],
    },
    password: {
      type: String,
      required: true,
    },
    activateToken: String,
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: [
        "User",
        "Student",
        "Lecturer",
        "Super Admin",
        "Financial Officer",
        "Admissions Officer",
        "General Academics Officer",
        "General Examination Officer",
        "Department Academics Officer",
        "Department Examination Officer",
      ],
      default: "General Academics Officer",
    },
    photo: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
