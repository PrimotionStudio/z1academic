import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/database";
import Video from "@/models/Video";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const videos = await Video.find({ publishedStatus: "unpublished" })
      .populate({ path: "course", populate: "departmentId" })
      .populate("requestedBy");
    return NextResponse.json({ message: "Videos found", videos });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
