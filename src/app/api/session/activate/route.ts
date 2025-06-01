import { connect } from "@/lib/database";
import Session from "@/models/Session";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    await connect();
    const { sessionId } = await request.json();
    if (!sessionId) throw new Error("Missing required parameters");
    await Session.toggleActive(sessionId);
    return NextResponse.json({ message: "Session activated" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
