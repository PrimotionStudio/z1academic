import { getUserIdFromCookie } from "@/functions/User";
import { connect } from "@/lib/database";
import User from "@/models/User";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    await connect();
    const { password, newPassword, confirmPassword } = await request.json();
    if (!password || !newPassword || !confirmPassword)
      throw new Error("Missing required parameters");

    if (newPassword !== confirmPassword)
      throw new Error("Passwords must match");

    const currentUserId = getUserIdFromCookie(request);
    const user = await User.findById(currentUserId);
    if (!user) throw new Error("Cannot find user");

    if (!(await compare(password, user.password)))
      throw new Error("Incorrect password");

    user.password = newPassword;
    await user.save();

    return NextResponse.json({ message: "Password Updated" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
