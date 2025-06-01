import { connect } from "@/lib/database";
import Faculty from "@/models/Faculty";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { name } = await request.json();
    if (!name) throw new Error("Missing required parameters");
    const faculty = await Faculty.create({ name });
    if (!faculty) throw new Error("Cannot add faculty");
    return NextResponse.json({ message: "Faculty added" }, { status: 201 });
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
    const faculties = await Faculty.find();
    return NextResponse.json({ message: "Faculties found", faculties });
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
    const { facultyId, name } = await request.json();
    if (!facultyId || !name) throw new Error("Missing required parameters");
    await Faculty.findByIdAndUpdate(facultyId, { name });
    return NextResponse.json({ message: "Faculty updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
