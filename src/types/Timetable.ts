import { Course } from "./Course";
import { Department } from "./Department";
import { Period } from "./Period";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type TimeSlot =
  | "7:00 AM"
  | "8:00 AM"
  | "9:00 AM"
  | "10:00 AM"
  | "11:00 AM"
  | "12:00 PM"
  | "1:00 PM"
  | "2:00 PM"
  | "3:00 PM"
  | "4:00 PM";

export interface TimetableEntry {
  _id: string;
  course: Course;
  day: DayOfWeek;
  timeSlot: TimeSlot;
}

export interface Timetable {
  _id: string;
  department: Department;
  semester: Period;
  level: number;
  entries: TimetableEntry[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface InputTimetableEntry {
  course: string;
  day: DayOfWeek;
  timeSlot: TimeSlot;
}

export interface InputTimetable {
  department: string;
  semester: string;
  level: number;
  entries: InputTimetableEntry[];
}
