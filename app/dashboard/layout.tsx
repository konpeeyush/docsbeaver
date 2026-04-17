import { getToken } from "@/lib/auth";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();
  if (!token) redirect("/");

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border bg-background sticky top-0 z-40">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold font-heading">DocsBeaver</h1>
          <SignOutButton />
        </nav>
      </header>
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {children}
      </main>
    </div>
  );
}
