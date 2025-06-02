import { connect } from "@/lib/database";
import Lecturer from "@/models/Lecturer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();
    const lecturers = await Lecturer.find().populate("userId");
    // .populate("department");
    return NextResponse.json({ message: "Lecturers found", lecturers });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
