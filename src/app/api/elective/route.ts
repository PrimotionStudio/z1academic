import { connect } from "@/lib/database";
import Elective from "@/models/Elective";
import { InputElective } from "@/types/Elective";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { course, department, level, semester } =
      (await request.json()) as InputElective;
    if (!course || !department || !level || !semester)
      throw new Error("Missing required parameters");
    const elective = await Elective.create({
      course,
      department,
      level,
      semester,
    });
    if (!elective) throw new Error("Cannot add elective");
    return NextResponse.json({ message: "Elective added" }, { status: 201 });
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
    const electives = await Elective.find()
      .populate({
        path: "course",
        populate: [
          {
            path: "lecturer",
            populate: {
              path: "userId",
            },
          },
          {
            path: "departmentId",
          },
        ],
      })
      .populate("department")
      .populate("semester");
    return NextResponse.json({ message: "Electives found", electives });
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
    const { electiveId, elective } = (await request.json()) as {
      electiveId: string;
      elective: InputElective;
    };
    if (
      !electiveId ||
      !elective.course ||
      !elective.department ||
      !elective.level ||
      !elective.semester
    )
      throw new Error("Missing required parameters");
    await Elective.findByIdAndUpdate(electiveId, {
      course: elective.course,
      department: elective.department,
      level: elective.level,
      semester: elective.semester,
    });
    return NextResponse.json({ message: "Elective updated" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
