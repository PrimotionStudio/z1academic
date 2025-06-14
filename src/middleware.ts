import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const excludedPaths = [
    "/api/login",
    "/api/register",
    "/api/activate",
    "/api/forgot-password",
    "/api/reset",
    "/api/timetable",
  ];

  if (excludedPaths.some((path) => pathname.startsWith(path)))
    return NextResponse.next();

  const token = req.cookies.get("token");
  if (!token) {
    if (pathname.startsWith("/api"))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/me/:path*", "/api/:path*"],
};
