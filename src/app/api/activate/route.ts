import { connect } from "@/lib/database";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    await connect();

    const { token } = await request.json();
    if (!token) throw new Error("Unauthorized");

    const user = await User.findOneAndUpdate(
      { activateToken: token },
      {
        verified: true,
        activateToken: null,
      },
      { new: true },
    );
    if (!user) throw new Error("Cannot find user");

    return NextResponse.json(
      { message: "Your account had been activated", user },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
