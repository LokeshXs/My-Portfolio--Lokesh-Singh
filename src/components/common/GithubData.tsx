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
  const contributionsResponse = await fetchContributions();
  const repositoryDataResponse = await fetchRepoData(GITHUB_SHOWCASE_REPOS);

  if (!contributionsResponse.data || !repositoryDataResponse.data) {
    return <div className=" flex justify-center items-center py-12">
      <p className=" text-center max-sm:text-xs">Missing Credentials to fetch the data</p>
    </div>;
  }



  return (
    <div>
      <GithubContributionsGrid weeks={contributionsResponse.data} />
      {/* <GithubRepos githubReposData={repositoryDataResponse.data}/> */}
    </div>
  );
}
