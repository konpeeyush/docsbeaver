import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl, generateState } from "@/lib/auth";
import { cookies } from "next/headers";
import { BookOpen, Zap, Code2 } from "lucide-react";

export default async function Home() {
  const state = generateState();
  const cookieStore = await cookies();
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  const loginUrl = getLoginUrl(state);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border bg-background">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold font-heading">DocsBeaver</h1>
          <a href={loginUrl} className="inline-flex">
            <Button variant="default">Sign in with GitHub</Button>
          </a>
        </nav>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-16 w-full">
        <section className="text-center mb-20">
          <h2 className="text-5xl font-bold font-heading mb-4 text-foreground">
            Build and deploy docs in minutes
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create beautiful documentation sites with Fumadocs. Edit in Notion-like blocks or raw MDX. Deploy free to Vercel.
          </p>
          <a href={loginUrl}>
            <Button size="lg">Get Started</Button>
          </a>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <BookOpen className="w-8 h-8 mb-4 text-primary" />
            <h3 className="text-xl font-semibold font-heading mb-2">Write Anywhere</h3>
            <p className="text-muted-foreground">
              Choose between a block editor or raw MDX. Both compile to beautiful docs powered by Fumadocs.
            </p>
          </Card>

          <Card className="p-6">
            <Zap className="w-8 h-8 mb-4 text-primary" />
            <h3 className="text-xl font-semibold font-heading mb-2">Deploy Instantly</h3>
            <p className="text-muted-foreground">
              Your docs live on GitHub. Every save deploys automatically to Vercel. Free forever on Hobby tier.
            </p>
          </Card>

          <Card className="p-6">
            <Code2 className="w-8 h-8 mb-4 text-primary" />
            <h3 className="text-xl font-semibold font-heading mb-2">Built for Developers</h3>
            <p className="text-muted-foreground">
              Own your content. Full control over your docs, versioning, and deployment pipeline.
            </p>
          </Card>
        </section>
      </main>
    </div>
  );
}
