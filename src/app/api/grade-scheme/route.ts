import { connect } from "@/lib/database";
import GradeScheme from "@/models/GradeScheme";
import { InputGradeScheme } from "@/types/GradeScheme";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const scheme = (await req.json()) as InputGradeScheme;
    if (!scheme) throw new Error("Missing required parameters");
    const totalScore = scheme.assessmentTypes.reduce(
      (sum: number, type: any) => sum + Number(type.score),
      0,
    );
    if (totalScore !== 100) throw new Error("Total score must equal 100");
    const gradeScheme = await GradeScheme.create(scheme);
    if (!gradeScheme) throw new Error("Cannot set new grade scheme");
    return NextResponse.json(
      { message: "New grade scheme added" },
      { status: 201 },
    );
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
    const gradeSchemes = await GradeScheme.find()
      .populate("department")
      .populate("semester");
    return NextResponse.json({ message: "Grade Schemes found", gradeSchemes });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connect();
    const scheme = (await req.json()) as InputGradeScheme & {
      schemeId: string;
    };
    if (!scheme || !scheme._id) throw new Error("Missing required parameters");
    const totalScore = scheme.assessmentTypes.reduce(
      (sum: number, type: any) => sum + Number(type.score),
      0,
    );
    if (totalScore !== 100) throw new Error("Total score must equal 100");
    const gradeScheme = await GradeScheme.findByIdAndUpdate(
      scheme._id,
      {
        assessmentTypes: scheme.assessmentTypes,
        department: scheme.department,
        level: scheme.level,
        semester: scheme.semester,
      },
      { new: true },
    );
    if (!gradeScheme) throw new Error("Cannot edit grade scheme");
    return NextResponse.json(
      { message: "Grade scheme updated", gradeScheme },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
