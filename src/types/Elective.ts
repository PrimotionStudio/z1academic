import { Course } from "./Course";
import { Department } from "./Department";
import { Period } from "./Period";

export interface Elective {
  _id: string;
  course: Course;
  department: Department;
  level: number;
  semester: Period;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface InputElective {
  course: string;
  department: string;
  level: number;
  semester: string;
}
