import { connect } from "@/lib/database";
import Fee from "@/models/Fee";
import { InputFee } from "@/types/Fee";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { label, amount } = (await request.json()) as InputFee;
    if (!label || !amount) throw new Error("Missing required parameters");
    const fee = await Fee.create({ label, amount });
    if (!fee) throw new Error("Cannot add new fee");
    return NextResponse.json({ message: "New fee added" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}

export async function GET() {
  try {
    await connect();
    const fees = await Fee.find();
    return NextResponse.json({ message: "Applications found", fees });
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
    const { feeId, label, amount } = (await request.json()) as InputFee & {
      feeId: string;
    };
    if (!feeId || !label || !amount)
      throw new Error("Missing required parameters");
    const fee = await Fee.findByIdAndUpdate(
      feeId,
      { label, amount },
      { new: true },
    );
    if (!fee) throw new Error("Cannot edit fee");
    return NextResponse.json({ message: "Fee edited" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
