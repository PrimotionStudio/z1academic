import { Department } from "./Department";
import { Period } from "./Period";
import { Session } from "./Session";

export interface AssessmentType {
  _id: string;
  name: string;
  score: number;
}

export interface GradeScheme {
  _id: string;
  assessmentTypes: AssessmentType[];
  department: Department;
  totalScore: number;
  semester: Period;
  level: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface InputAssessmentType {
  name: string;
  score: number;
}

export interface InputGradeScheme {
  _id?: string;
  assessmentTypes: InputAssessmentType[];
  department: string;
  semester: string;
  level: number;
}
