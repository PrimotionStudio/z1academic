import { getUserIdFromCookie } from "@/functions/User";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { amount } = await request.json();
    if (!amount) throw new Error("Missing required parameter");
    const currentUserId = getUserIdFromCookie(request);
    const user = await User.findById(currentUserId);
    if (!user) throw new Error("Cannot find user");
    const transaction = await Transaction.create({
      userId: user._id,
      amount,
    });
    if (!transaction) throw new Error("Cannot start new transaction");
    return NextResponse.json({ message: "New Transaction", transaction });
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

    const transactionId = request.nextUrl.searchParams.get("transactionId");
    if (transactionId) {
      const transaction = await Transaction.findOne({
        transactionId,
      }).populate("userId");
      if (!transaction) throw new Error("Cannot find transaction");
      return NextResponse.json(
        { message: "Transaction found", transaction },
        { status: 200 },
      );
    }
    const transactions = await Transaction.find().populate("userId");

    return NextResponse.json(
      { message: "Applications found", transactions },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
