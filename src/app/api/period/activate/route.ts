import { connect } from "@/lib/database";
import Period from "@/models/Semester";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    await connect();
    const { periodId } = await request.json();
    if (!periodId) throw new Error("Missing required parameters");
    await Period.toggleActive(periodId);
    return NextResponse.json({ message: "Period activated" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
