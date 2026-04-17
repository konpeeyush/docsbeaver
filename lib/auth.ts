import { cookies } from "next/headers";

export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get("gh_token")?.value ?? null;
}

export function generateState(): string {
  return crypto.randomUUID();
}

export function getLoginUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "repo user",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    state,
  });
  return `https://github.com/login/oauth/authorize?${params}`;
}
