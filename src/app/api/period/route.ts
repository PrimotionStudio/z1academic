import { connect } from "@/lib/database";
import Period from "@/models/Semester";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { periodName } = await request.json();
    if (!periodName) throw new Error("Missing required parameters");
    const period = await Period.create({ name: periodName });
    if (!period) throw new Error("Cannot add new Period");
    return NextResponse.json({ message: "New Period added" }, { status: 201 });
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
    const periods = await Period.find();
    return NextResponse.json({ message: "Periods found", periods });
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
    const { periodId, periodName } = await request.json();
    if (!periodId || !periodName)
      throw new Error("Missing required parameters");
    const period = await Period.findByIdAndUpdate(
      periodId,
      { name: periodName },
      { new: true },
    );
    if (!period) throw new Error("Cannot edit Period");
    return NextResponse.json({ message: "Period edited" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
