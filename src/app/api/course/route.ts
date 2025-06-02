import { connect } from "@/lib/database";
import Course from "@/models/Course";
import { InputCourse } from "@/types/Course";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { code, department, lecturer, level, name, semester, units } =
      (await request.json()) as InputCourse;
    if (
      !code ||
      !department ||
      !lecturer ||
      !name ||
      !semester ||
      !level ||
      !units
    )
      throw new Error("Missing required parameters");
    const course = await Course.create({
      code,
      departmentId: department,
      lecturer,
      level,
      name,
      semesterId: semester,
      units,
    });
    if (!course) throw new Error("Cannot add new course");
    return NextResponse.json({ message: "Course Added" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}

export async function GET() {
  try {
    await connect();
    const courses = await Course.find()
      .populate({
        path: "lecturer",
        populate: "userId",
      })
      .populate("departmentId")
      .populate("semesterId");
    return NextResponse.json({ message: "Courses found", courses });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connect();
    const {
      courseId,
      code,
      department,
      lecturer,
      level,
      name,
      semester,
      units,
    } = (await request.json()) as InputCourse & { courseId: string };
    if (
      !courseId ||
      !code ||
      !department ||
      !lecturer ||
      !name ||
      !semester ||
      !level ||
      !units
    )
      throw new Error("Missing required parameters");
    const course = await Course.findByIdAndUpdate(courseId, {
      code,
      departmentId: department,
      lecturer,
      level,
      name,
      semesterId: semester,
      units,
    });
    if (!course) throw new Error("Cannot edit course");
    return NextResponse.json({ message: "Course updated" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
