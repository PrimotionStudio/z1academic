import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/database";
import Timetable from "@/models/Timetable";
import { InputTimetable } from "@/types/Timetable";
import Course from "@/models/Course";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const newTimetable = (await request.json()) as InputTimetable;
    if (
      !newTimetable.department ||
      !newTimetable.semester ||
      !newTimetable.level ||
      !newTimetable.entries ||
      !Array.isArray(newTimetable.entries)
    )
      throw new Error("Missing required parameters");

    const courseIds = Array.from(
      new Set(newTimetable.entries.map((e) => e.course)),
    );

    const courses = await Course.find({ _id: { $in: courseIds } }).populate(
      "lecturer",
    );

    if (courses.length !== courseIds.length) {
      throw new Error("One or more courses not found");
    }

    const bookingMap = new Map<string, string>();
    for (const entry of newTimetable.entries) {
      const course = courses.find((c) => c._id.toString() === entry.course);
      if (!course) throw new Error("Cannot find course");
      const lecturerId = course.lecturer._id.toString();
      const key = `${lecturerId}-${entry.day}-${entry.timeSlot}`;
      if (bookingMap.has(key)) {
        const conflictingCourseId = bookingMap.get(key);
        throw new Error(
          `Lecturer ${lecturerId} is already booked for course ${conflictingCourseId} on ${entry.day} at ${entry.timeSlot}`,
        );
      }
      bookingMap.set(key, course._id.toString());
    }

    const timetable = await Timetable.findOneAndUpdate(
      {
        department: newTimetable.department,
        level: newTimetable.level,
        semester: newTimetable.semester,
      },
      newTimetable,
      {
        new: true,
        upsert: true,
      },
    );
    if (!timetable) throw new Error("Cannot set timetable");
    return NextResponse.json({ message: "Timetable set" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 400 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connect();
    const department = request.nextUrl.searchParams.get("departmentId");
    const semester = request.nextUrl.searchParams.get("semesterId");
    const level = request.nextUrl.searchParams.get("level");

    if (department && level && semester) {
      const timetable = await Timetable.findOne({
        department,
        semester,
        level,
      }).populate("entries.course");
      if (!timetable) throw new Error("Cannot find timetable");
      return NextResponse.json({
        message: "Timetable found",
        timetable,
      });
    }

    const timetableId = request.nextUrl.searchParams.get("timetableId");
    if (timetableId) {
      const timetable = await Timetable.findById(timetableId);
      if (!timetable) throw new Error("Cannot find timetable");
      return NextResponse.json({
        message: "Timetable found",
        timetable,
      });
    }

    const timetables = await Timetable.find();
    return NextResponse.json({
      message: "Timetables found",
      timetables,
    });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 400 },
    );
  }
}
