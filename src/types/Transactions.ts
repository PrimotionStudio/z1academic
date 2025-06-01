import { User } from "./User";

export interface Transaction {
  _id: string;
  transactionId: string;
  userId: string & User;
  amount: string;
  status: "Pending" | "Success" | "Failed";
  createdAt: Date & string;
  updatedAt: Date & string;
}
