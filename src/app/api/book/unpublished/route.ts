import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/database";
import Book from "@/models/Book";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const books = await Book.find({ publishedStatus: "unpublished" })
      .populate("department")
      .populate("requestedBy");
    return NextResponse.json({ message: "Books found", books });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
