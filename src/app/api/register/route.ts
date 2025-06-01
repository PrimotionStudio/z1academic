import { connect } from "@/lib/database";
import { sendMail } from "@/lib/sendMail";
import User from "@/models/User";
import { InputRegisterUser } from "@/types/User";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const user: InputRegisterUser = await request.json();
    if (!user.fullName || !user.email || !user.phone || !user.password)
      throw new Error("Missing required fields");

    const activateToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({ ...user, activateToken });
    if (!newUser) throw new Error("Failed to create account");

    const activateUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/activate/${activateToken}`;
    await sendMail({
      to: user.email,
      logo: process.env.NEXT_PUBLIC_SCHOOL_LOGO!,
      subject: `Activate your ${process.env.NEXT_PUBLIC_SCHOOL_NAME} account`,
      intro_text: `Welcome to ${process.env.NEXT_PUBLIC_SCHOOL_NAME}!`,
      action_text: "Activate Account",
      action_url: activateUrl,
      body_text: `
      <p>Your account was successfully created.</p>
      <p>Please click the button above to activate your account and continue with your application.</p>
      <p>In the meantime, if you have any questions or need assistance, just reach out to our support team at <a href="mailto:${process.env.NEXT_PUBLIC_SCHOOL_EMAIL}">${process.env.NEXT_PUBLIC_SCHOOL_EMAIL}</a>.</p>
      <p>We'd love to have you at ${process.env.NEXT_PUBLIC_SCHOOL_NAME}!</p>`,
      unsubscribe_url: "https://z1lms.com/unsubscribe",
      name: user.fullName,
    });

    return NextResponse.json(
      { message: "A verification email has been sent to your email address." },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
