import { Department } from "./Department";
import { User } from "./User";

export interface Lecturer {
  _id: string;
  userId: User;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface InputLecturer {
  userId: string;
  department: string;
}
