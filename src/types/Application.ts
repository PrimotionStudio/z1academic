import { User } from "@/types/User";
import { Transaction } from "./Transactions";

export interface InputApplicationData {
  program: string;
  dateOfBirth: string;
  stateOfOrigin: string;
  lga: string;
  contactAddress: string;
  nextOfKin: string;
  nextOfKinPhone: string;
  examType: string;
  examNumber: string;
  examYear: string;
  subjects: Array<{
    subject: string;
    grade: string;
  }>;
  resultFile: {
    url: string;
    fileType: string;
  };
  termsAccepted: boolean;
}

export interface Application {
  _id: string;
  userId: string & User;
  program: string;
  dateOfBirth: string;
  stateOfOrigin: string;
  lga: string;
  contactAddress: string;
  nextOfKin: string;
  nextOfKinPhone: string;

  examType: string;
  examNumber: string;
  examYear: string;
  subjects: Array<{
    subject: string;
    grade: string;
  }>;
  resultFile: {
    url: string;
    mime: string;
  };
  termsAccepted: boolean;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: string;
  transaction: Transaction;
}

export interface ApplicationFormProps {
  applicationData: InputApplicationData;
  updateData: (data: Partial<InputApplicationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export interface ReviewFormProps {
  applicationData: InputApplicationData;
  updateData: (data: Partial<InputApplicationData>) => void;
  onPrevious: () => void;
  onSubmit: () => void;
}

export interface ApplicationReview {
  applicationId: string;
  status: "Pending" | "Accepted" | "Rejected";
}
