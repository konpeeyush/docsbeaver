import { Octokit } from "octokit";

export function createGitHubClient(token: string) {
  return new Octokit({ auth: token });
}

export async function getRepo(octokit: Octokit, owner: string, repo: string) {
  const { data } = await octokit.rest.repos.get({ owner, repo });
  return data;
}

export async function listFiles(octokit: Octokit, owner: string, repo: string, path = "") {
  const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
  return Array.isArray(data) ? data : [data];
}

export async function getFile(octokit: Octokit, owner: string, repo: string, path: string) {
  const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
  if ("content" in data && data.type === "file") {
    return {
      content: Buffer.from(data.content, "base64").toString("utf-8"),
      sha: data.sha,
    };
  }
  throw new Error("Not a file");
}

export async function commitFile(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  sha?: string
) {
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString("base64"),
    ...(sha ? { sha } : {}),
  });
}

export async function createFromTemplate(
  octokit: Octokit,
  templateOwner: string,
  templateRepo: string,
  newName: string
) {
  const { data } = await octokit.rest.repos.createUsingTemplate({
    template_owner: templateOwner,
    template_repo: templateRepo,
    name: newName,
    private: false,
  });
  return data;
}
