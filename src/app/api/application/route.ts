import { getUserIdFromCookie } from "@/functions/User";
import { connect } from "@/lib/database";
import { sendMail } from "@/lib/sendMail";
import Application from "@/models/Application";
import User from "@/models/User";
import { ApplicationReview, InputApplicationData } from "@/types/Application";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const currentUserId = getUserIdFromCookie(request);

    const applicationData = (await request.json()) as InputApplicationData & {
      transaction: string;
      amount: number;
    };
    if (!applicationData) throw new Error("No application data given");
    const user = await User.findById(currentUserId);
    if (!user) throw new Error("Cannot find user");
    const application = await Application.create({
      ...applicationData,
      userId: user._id,
    });
    if (!application) throw new Error("Cannot create new application");

    await sendMail({
      to: user.email,
      logo: process.env.NEXT_PUBLIC_SCHOOL_LOGO!,
      subject: `Your application for ${applicationData.program} has been saved`,
      intro_text: `Complete your payment of ₦${applicationData.amount.toLocaleString()} to start application review process`,
      body_text: `
      <p>Your application was successfully recorded.</p>
      <p>Please complete the payment of ₦${applicationData.amount.toLocaleString()} to start application review process.</p>
      <p>In the meantime, if you have any questions or need assistance, just reach out to our support team at <a href="mailto:${process.env.NEXT_PUBLIC_SCHOOL_EMAIL}">${process.env.NEXT_PUBLIC_SCHOOL_EMAIL}</a>.</p>
      <p>We'd love to have you at ${process.env.NEXT_PUBLIC_SCHOOL_NAME}!</p>`,
      unsubscribe_url: "https://z1lms.com/unsubscribe",
      name: user.fullName,
    });

    return NextResponse.json(
      { message: "Application under review" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connect();
    const applicationId = request.nextUrl.searchParams.get("applicationId");
    if (applicationId) {
      const application = await Application.findOne({
        _id: applicationId,
      })
        .populate("userId")
        .populate("transaction");
      if (!application) throw new Error("Cannot find transaction");
      return NextResponse.json(
        { message: "Application found", application },
        { status: 200 },
      );
    }
    const applications = await Application.find().populate("userId");
    return NextResponse.json(
      { message: "Applications found", applications },
      { status: 200 },
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
    const { applicationId, status } =
      (await request.json()) as ApplicationReview;
    if (!applicationId || !status)
      throw new Error("Missing required parameters");

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true },
    ).populate("userId");
    if (!application) throw new Error("Cannot find application");
    if (status === "Accepted") {
      const user = await User.findByIdAndUpdate(
        application.userId._id,
        { role: "Student" },
        { new: true },
      );
      if (!user) throw new Error("Cannot find user");
    }
    return NextResponse.json({ message: `Application ${status}` });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
