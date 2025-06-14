import "@/models/Semester";
import "@/models/Course";
import "@/models/Department";
import mongoose, { Schema, Model, Document } from "mongoose";

type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

type TimeSlot =
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

interface ITimetableEntry {
  course: Schema.Types.ObjectId;
  day: DayOfWeek;
  timeSlot: TimeSlot;
}

interface ITimetable extends Document {
  department: Schema.Types.ObjectId;
  semester: Schema.Types.ObjectId;
  level: number;
  entries: ITimetableEntry[];
}

const TimetableSchema = new Schema<ITimetable>(
  {
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
    level: {
      type: Number,

      required: true,
    },
    entries: {
      type: [
        {
          course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
          },
          semester: {
            type: Schema.Types.ObjectId,
            ref: "Semester",
            required: true,
          },
          level: {
            type: Number,
            required: true,
          },
          day: {
            type: String,
            required: true,
            enum: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
          },
          timeSlot: {
            type: String,
            required: true,
            enum: [
              "7:00 AM",
              "8:00 AM",
              "9:00 AM",
              "10:00 AM",
              "11:00 AM",
              "12:00 PM",
              "1:00 PM",
              "2:00 PM",
              "3:00 PM",
              "4:00 PM",
            ],
          },
        },
      ],
      index: true,
    },
  },
  { timestamps: true },
);

export default (mongoose.models.Timetable as Model<ITimetable>) ||
  mongoose.model<ITimetable>("Timetable", TimetableSchema);
