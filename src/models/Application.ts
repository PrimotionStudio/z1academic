import "@/models/User";
import "@/models/Transaction";
import mongoose, { Document, Schema } from "mongoose";

interface IApplication extends Document {
  userId: Schema.Types.ObjectId;
  program: string;
  dateOfBirth: Date;
  stateOfOrigin: string;
  lga: string;
  contactAddress: string;
  nextOfKin: string;
  nextOfKinPhone: string;
  examType: string;
  examNumber: string;
  examYear: string;
  subjects: {
    subject: string;
    grade: string;
  }[];
  resultFile: {
    url: string;
    fileType: string;
  };
  termsAccepted: boolean;
  transaction: Schema.Types.ObjectId;
  status: "Pending" | "Accepted" | "Rejected";
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    program: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    stateOfOrigin: {
      type: String,
      required: true,
    },
    lga: {
      type: String,
      required: true,
    },
    contactAddress: {
      type: String,
      required: true,
    },
    nextOfKin: {
      type: String,
      required: true,
    },
    nextOfKinPhone: {
      type: String,
      required: true,
    },
    examType: {
      type: String,
      required: true,
    },
    examNumber: {
      type: String,
      required: true,
    },
    examYear: {
      type: String,
      required: true,
    },
    subjects: {
      type: [
        {
          subject: String,
          grade: String,
        },
      ],
      required: true,
    },
    resultFile: {
      type: {
        url: String,
        fileType: String,
      },
      required: true,
    },
    termsAccepted: Boolean,
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);
