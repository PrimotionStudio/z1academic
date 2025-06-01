import { getUserIdFromCookie } from "@/functions/User";
import { connect } from "@/lib/database";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connect();

    const currentUserId = getUserIdFromCookie(request);

    const user = await User.findById(currentUserId);
    if (!user) throw new Error("Unauthorized");

    return NextResponse.json({
      message: "User found",
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error, user: null },
      { status: 401 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connect();
    const { fullName, email, phone, photo } = await request.json();
    if (!fullName || !email || !phone || !photo)
      throw new Error("Missing required parameters");

    const currentUserId = getUserIdFromCookie(request);
    const user = await User.findByIdAndUpdate(
      currentUserId,
      {
        fullName,
        email,
        phone,
        photo,
      },
      { new: true },
    );
    if (!user) throw new Error("Cannot find user");
    return NextResponse.json({ message: "Profile Updated" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
