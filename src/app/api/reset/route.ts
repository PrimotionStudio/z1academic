import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/database";
import User from "@/models/User";
import { sendMail } from "@/lib/sendMail";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { email, resetToken, password, confirmPassword } = await req.json();
    if (password !== confirmPassword) throw new Error("Passwords do not match");
    if (!email) throw new Error("Cannot find admin");
    const user = await User.findOne({
      email,
      resetPasswordToken: resetToken,

      $or: [
        { role: "General Academics Officer" },
        { role: "Department Academics Officer" },
      ],
    });
    if (!user) throw new Error("Cannot find admin");
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    await sendMail({
      to: email,
      subject: `Your Password for ${process.env.NEXT_PUBLIC_SCHOOL_NAME} has been changed`,
      intro_text: `This is to inform you that a password reset action was just executed on your ${process.env.NEXT_PUBLIC_SCHOOL_NAME} account.`,
      body_text: `
          <p>If you didn’t request a password reset, Please contact support at <a href="mailto:${process.env.NEXT_PUBLIC_SCHOOL_EMAIL}">${process.env.NEXT_PUBLIC_SCHOOL_EMAIL}</a>.</p>
          <p>For your security, please log in only at <a href="${process.env.NEXT_PUBLIC_BASE_URL}/login">${process.env.NEXT_PUBLIC_BASE_URL}/login</a> and secure your password.</p>
          <p>In the meantime, if you have any questions or need assistance, just reach out to our support team at <a href="mailto:${process.env.NEXT_PUBLIC_SCHOOL_EMAIL}">${process.env.NEXT_PUBLIC_SCHOOL_EMAIL}</a>.</p>
          <p>Thanks for choosing the ${process.env.NEXT_PUBLIC_SCHOOL_NAME}!</p>`,
      logo: process.env.NEXT_PUBLIC_SCHOOL_LOGO!,
      unsubscribe_url: "https://z1lms.com/unsubscribe",
      name: user.fullName,
    });

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connect();
    const resetToken = req.nextUrl.searchParams.get("resetToken");
    if (!resetToken) throw new Error("Reset token is required");

    const user = await User.findOne({
      resetPasswordToken: resetToken,

      $or: [
        { role: "General Academics Officer" },
        { role: "Department Academics Officer" },
      ],
    });
    if (!user) throw new Error("Cannot find admin");
    return NextResponse.json(
      { message: "User password reset", email: user.email },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
