@AGENTS.md

# DocsBeaver

Client-side docs builder. Users create Fumadocs sites → committed to their GitHub → deployed on Vercel. No database — GitHub repos are the storage layer.

## Stack
- Package manager: Bun (always `bun`/`bunx`, never npm/npx)
- Next.js 16 App Router, TypeScript strict
- fumadocs-core + fumadocs-ui + fumadocs-mdx — docs rendering
- coss ui (@coss/style) — Base UI components, CSS vars: `--font-sans` / `--font-mono` / `--font-heading`
- BlockNote — block editor, requires `"use client"` + `next/dynamic({ ssr: false })`
- CodeMirror 6 — code editor (`@uiw/react-codemirror`, `@codemirror/lang-markdown`)
- Octokit — GitHub API (browser-side and server-side)

## Non-obvious decisions
- **Two files per doc page**: `.mdx` (Fumadocs renders this) + `content/docs/.blocks/*.json` (BlockNote source of truth). Always commit both on save.
- **BlockNote's built-in MDX serializer is lossy** — use `lib/blocknoteMdxSerializer.ts` instead (to be built).
- **GitHub API commits one file at a time** — commit `.json` first, then `.mdx` sequentially.
- **No NextAuth** — single API route at `app/api/auth/callback/route.ts` handles GitHub OAuth token exchange. Token stored in httpOnly cookie `gh_token`.
- **Images**: commit to repo as base64 via GitHub API → reference via `raw.githubusercontent.com` URL.
- **Fumadocs source**: `lib/source.ts` uses `collections/server` (auto-generated into `.source/` on `bun dev`). Don't import from `.source/` directly.

## Auth
- `lib/auth.ts` — `getToken()` reads `gh_token` cookie (server-side)
- `lib/github.ts` — all GitHub API helpers using Octokit
- Protected routes: `/dashboard`, `/editor` — enforced in `middleware.ts`

## Env vars (never hardcode)
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_TEMPLATE_OWNER` / `NEXT_PUBLIC_TEMPLATE_REPO` — the Fumadocs template repo to fork

## Commands
- `bun dev` — dev server (also generates `.source/` for Fumadocs)
- `bun run build` — production build
- `bun run typecheck` — tsc --noEmit

## Tests
Single file only: `bunx vitest run src/lib/blocknoteMdxSerializer.test.ts`

## Git workflow
**Never auto-stage or auto-commit changes.** Always:
1. Make changes to files
2. Show unstaged changes with `git status` or `git diff`
3. Wait for explicit user approval before staging or committing
4. Only stage files when user explicitly asks to commit
5. Show staged changes before committing

This ensures the user reviews all changes before they're locked into git history.
