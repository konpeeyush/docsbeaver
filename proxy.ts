import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/editor"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("gh_token");
  const isProtected = PROTECTED.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*"],
};
