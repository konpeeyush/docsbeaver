import { getToken } from "@/lib/auth";
import { createGitHubClient } from "@/lib/github";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { redirect } from "next/navigation";
import Link from "next/link";

export const revalidate = 300;

export default async function Dashboard() {
  const token = await getToken();
  if (!token) redirect("/");

  const octokit = createGitHubClient(token);

  interface Repo {
    id: number;
    name: string;
    description: string | null;
    owner: { login: string } | null;
  }

  let repos: Repo[] = [];
  try {
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
    });
    repos = data as Repo[];
  } catch (error) {
    console.error("Failed to fetch repos:", error);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold font-heading mb-2">Your Projects</h2>
          <p className="text-muted-foreground">
            {repos.length} repositories found
          </p>
        </div>
        <Button>+ New Project</Button>
      </div>

      {repos.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">
            No projects yet. Create one to get started.
          </p>
          <Button>Create First Project</Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((repo) => (
            <Card key={repo.id} className="p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold font-heading mb-1">{repo.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 truncate">
                github.com/{repo.owner?.login}/{repo.name}
              </p>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {repo.description || "No description"}
              </p>
              <Link href={`/editor/${repo.owner?.login}/${repo.name}`}>
                <Button variant="outline" className="w-full">
                  Open Editor
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
