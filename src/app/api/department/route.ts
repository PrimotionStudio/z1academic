import { connect } from "@/lib/database";
import Department from "@/models/Department";
import { InputDepartment } from "@/types/Department";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { name, facultyId, maxLevels, programTitle, jambCutOff } =
      (await request.json()) as InputDepartment;
    if (
      !name ||
      !facultyId ||
      !programTitle ||
      !jambCutOff ||
      maxLevels % 100 !== 0
    )
      throw new Error("Missing required parameters");
    const department = await Department.create({
      name,
      facultyId,
      maxLevels,
      jambCutOff,
      programTitle,
    });
    if (!department) throw new Error("Cannot add department");
    return NextResponse.json({ message: "Department added" }, { status: 201 });
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
    const departments = await Department.find();
    return NextResponse.json({ message: "Departments found", departments });
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
      departmentId,
      name,
      facultyId,
      maxLevels,
      programTitle,
      jambCutOff,
    } = (await request.json()) as InputDepartment & { departmentId: string };
    if (
      !departmentId ||
      !name ||
      !jambCutOff ||
      !facultyId ||
      !programTitle ||
      maxLevels % 100 !== 0
    )
      throw new Error("Missing required parameters");
    await Department.findByIdAndUpdate(departmentId, {
      name,
      facultyId,
      maxLevels,
      jambCutOff,
      programTitle,
    });
    return NextResponse.json(
      { message: "Department updated" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
