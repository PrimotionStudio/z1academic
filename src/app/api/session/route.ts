import { connect } from "@/lib/database";
import Session from "@/models/Session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { sessionName } = await request.json();
    if (!sessionName) throw new Error("Missing required parameters");
    const session = await Session.create({ name: sessionName });
    if (!session) throw new Error("Cannot add new session");
    return NextResponse.json({ message: "New session added" }, { status: 201 });
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
    const sessions = await Session.find();
    return NextResponse.json({ message: "Sessions found", sessions });
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
    const { sessionId, sessionName } = await request.json();
    if (!sessionId || !sessionName)
      throw new Error("Missing required parameters");
    const session = await Session.findByIdAndUpdate(
      sessionId,
      { name: sessionName },
      { new: true },
    );
    if (!session) throw new Error("Cannot edit session");
    return NextResponse.json({ message: "Session edited" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
