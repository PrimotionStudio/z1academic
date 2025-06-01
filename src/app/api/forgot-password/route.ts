import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connect } from "@/lib/database";
import User from "@/models/User";
import { sendMail } from "@/lib/sendMail";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { email } = await request.json();
    if (!email)
      throw new Error(
        "If that email is registered, a reset link has been sent. Check your SPAM folder too!",
      );
    const user = await User.findOne({
      email,
      $or: [
        { role: "General Academics Officer" },
        { role: "Department Academics Officer" },
      ],
    });
    if (!user)
      throw new Error(
        "If that email is registered, a reset link has been sent. Check your SPAM folder too!",
      );

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 1000 * 60 * 60;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;

    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset/${resetToken}`;
    await sendMail({
      to: email,
      subject: `Reset Your ${process.env.NEXT_PUBLIC_SCHOOL_NAME} Account!`,
      intro_text: `We received a request to reset the password for your ${process.env.NEXT_PUBLIC_SCHOOL_NAME} account.`,
      body_text: `
      <p>Click the button above to reset your password. This link will expire in 1 hour.</p>
      <p>If you didn’t request a password reset, you can safely ignore this email.</p>
      <p>For your security, please log in only at <a href="${process.env.NEXT_PUBLIC_BASE_URL}/login">${process.env.NEXT_PUBLIC_BASE_URL}/login</a> and secure your password.</p>
      <p>In the meantime, if you have any questions or need assistance, just reach out to our support team at <a href="mailto:${process.env.NEXT_PUBLIC_SCHOOL_EMAIL}">${process.env.NEXT_PUBLIC_SCHOOL_EMAIL}</a>.</p>
      <p>Thanks for choosing the ${process.env.NEXT_PUBLIC_SCHOOL_NAME}!</p>`,
      logo: process.env.NEXT_PUBLIC_SCHOOL_LOGO!,
      action_text: "Reset Password",
      action_url: resetUrl,
      unsubscribe_url: "https://z1lms.com/unsubscribe",
      name: user.fullName,
    });

    return NextResponse.json(
      {
        message:
          "If that email is registered, a reset link has been sent. Check your SPAM folder too!",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
