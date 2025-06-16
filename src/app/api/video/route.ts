import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/database";
import Video from "@/models/Video";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const videoId = request.nextUrl.searchParams.get("videoId");
    if (videoId) {
      const video = await Video.findById(videoId)
        .populate({ path: "course", populate: "departmentId" })
        .populate("requestedBy");
      if (!video) throw new Error("Video not found");
      return NextResponse.json({ message: "Video found", video });
    }
    const videos = await Video.find({ publishedStatus: "published" })
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

export async function POST(request: NextRequest) {
  try {
    await connect();
    const {
      title,
      shortDescription,
      course,
      fileLink,
      coverImage,
      requestedBy,
    } = await request.json();

    const video = await Video.create({
      title,
      shortDescription,
      course,
      fileLink,
      coverImage,
      requestedBy,
      publishedStatus: "published",
    });
    if (!video) throw new Error("Cannot create video");
    return NextResponse.json(
      { message: "Video created successfully", video },
      { status: 201 },
    );
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
    const { videoId, publishedStatus } = await request.json();
    if (!videoId) throw new Error("Missing required parameters");

    const video = await Video.findByIdAndUpdate(
      videoId,
      { publishedStatus },
      { new: true },
    );
    if (!video) throw new Error("Video not found");

    return NextResponse.json({ message: "Video updated successfully", video });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connect();
    const { videoId } = await request.json();
    if (!videoId) {
      throw new Error("Missing required parameter: videoId");
    }

    const video = await Video.findByIdAndDelete(videoId);

    if (!video) {
      throw new Error("Video not found");
    }

    return NextResponse.json({ message: "Video deleted successfully", video });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
