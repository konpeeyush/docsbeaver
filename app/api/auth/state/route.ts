import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { state } = await req.json();

  if (!state) {
    return Response.json({ error: "Missing state" }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return Response.json({ ok: true });
}
