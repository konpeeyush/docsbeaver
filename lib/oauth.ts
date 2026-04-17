export function generateState(): string {
  return crypto.randomUUID();
}

export function getLoginUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
    scope: "repo user",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    state,
  });
  return `https://github.com/login/oauth/authorize?${params}`;
}
