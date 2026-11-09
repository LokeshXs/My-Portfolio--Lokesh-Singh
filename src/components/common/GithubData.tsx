import { fetchContributions, fetchRepoData } from "@/actions/github";
import GithubContributionsGrid from "./GithubContributionsGrid";
import { GITHUB_SHOWCASE_REPOS } from "@/lib/data";
import GithubRepos from "./GithubRepos";

export type githubResponseType = {
  contributionDays: {
    date: string;
    contributionCount: number;
  }[];
}[];

export default async function GithubData() {
  // Both requests run at the same time.
  const [contributionsResponse, repositoryDataResponse] = await Promise.all([
    fetchContributions(),
    fetchRepoData(GITHUB_SHOWCASE_REPOS),
  ]);

  // Each part shows on its own, so one failing doesn't hide the other.
  return (
    <div>
      {contributionsResponse.data ? (
        <GithubContributionsGrid weeks={contributionsResponse.data} />
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground max-sm:text-xs">
          Couldn&apos;t load the contribution graph right now.
        </p>
      )}
      {repositoryDataResponse.data && <GithubRepos githubReposData={repositoryDataResponse.data} />}
    </div>
  );
}
