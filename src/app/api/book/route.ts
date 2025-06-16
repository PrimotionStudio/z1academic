import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/database";
import Book from "@/models/Book";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const bookId = request.nextUrl.searchParams.get("bookId");
    if (bookId) {
      const book = await Book.findById(bookId)
        .populate("department")
        .populate("requestedBy");
      if (!book) throw new Error("Book not found");
      return NextResponse.json({ message: "Book found", book });
    }
    const books = await Book.find({ publishedStatus: "published" })
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

export async function POST(request: NextRequest) {
  try {
    await connect();
    const {
      title,
      shortDescription,
      author,
      department,
      fileLink,
      coverImage,
      requestedBy,
    } = await request.json();

    const book = await Book.create({
      title,
      shortDescription,
      author,
      department,
      fileLink,
      coverImage,
      requestedBy,
      publishedStatus: "published",
    });
    if (!book) throw new Error("Cannot create book");
    return NextResponse.json(
      { message: "Book created successfully", book },
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
    const { bookId } = await request.json();
    if (!bookId) throw new Error("Missing required parameters");

    const book = await Book.findByIdAndUpdate(
      bookId,
      { publishedStatus: "published" },
      { new: true },
    );
    if (!book) throw new Error("Book not found");

    return NextResponse.json({ message: "Book updated successfully", book });
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
    const { bookId } = await request.json();
    if (!bookId) throw new Error("Missing required parameters");

    const book = await Book.findByIdAndDelete(bookId);
    if (!book) throw new Error("Book not found");

    return NextResponse.json({ message: "Book deleted successfully", book });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
