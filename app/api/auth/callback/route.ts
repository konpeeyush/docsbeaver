import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code) return NextResponse.redirect(new URL("/?error=missing_code", request.url));
  if (!state) return NextResponse.redirect(new URL("/?error=invalid_state", request.url));

  const oauthState = request.cookies.get("oauth_state")?.value;

  if (!oauthState || oauthState !== state) {
    return NextResponse.redirect(new URL("/?error=invalid_state", request.url));
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();
  if (data.error) return NextResponse.redirect(new URL(`/?error=${data.error}`, request.url));

  const res = NextResponse.redirect(new URL("/dashboard", request.url));
  res.cookies.set("gh_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  res.cookies.delete("oauth_state");
  return res;
}
