import { Department } from "./Department";
import { Lecturer } from "./Lecturer";
import { Period } from "./Period";

export interface Course {
  _id: string;
  name: string;
  code: string;
  units: number;
  lecturer: Lecturer;
  departmentId: Department;
  level: number;
  semesterId: Period;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface InputCourse {
  name: string;
  code: string;
  units: number;
  lecturer: string;
  department: string;
  level: number;
  semester: string;
}
