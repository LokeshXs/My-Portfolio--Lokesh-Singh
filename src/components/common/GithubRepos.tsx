import { fetchTopLanguages } from "@/lib/utils";
import { IconGitFork, IconStar } from "@tabler/icons-react";
import { format } from "date-fns";
import { Langar } from "next/font/google";
import Link from "next/link";

export default function GithubRepos({
  githubReposData,
}: {
  githubReposData: {
    name: string;
    owner: string;
    description: string | null;
    url: string;
    forks_count: number;
    stargazers_count: number;
    created_at: string;
    topics: string[] | undefined;
    languages: {
      [key: string]: number;
    };
  }[];
}) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 max-md:grid-cols-1">
      {githubReposData.map((repoData, _) => (
        <RepoCard key={repoData.name} repoData={repoData} />
      ))}
    </div>
  );
}

function RepoCard({
  repoData,
}: {
  repoData: {
    name: string;
    owner: string;
    description: string | null;
    url: string;
    forks_count: number;
    stargazers_count: number;
    created_at: string;
    topics: string[] | undefined;
    languages: {
      [key: string]: number;
    };
  };
}) {
  const topLanguages = fetchTopLanguages(repoData.languages);

  return (
    <Link

      key={repoData.name}
      href={repoData.url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:shadow-custom flex h-full w-full flex-col gap-6 max-sm:gap-4 rounded-md border p-2 transition-all duration-300"
    >
      <div className="flex flex-col items-start gap-1">
        <p className=" max-sm:text-sm">
          <span >{repoData.owner}</span>/
          <span className="font-medium">{repoData.name}</span>
        </p>
        <p className="text-muted-foreground text-xs">{repoData.description}</p>
      </div>

      {/* mt-auto pushes the stats to the bottom, so cards line up whatever the description length. */}
      <div className="mt-auto flex items-end justify-between gap-2">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-4 max-sm:gap-2">
            <span className="flex items-center gap-1">
              <IconStar className="h-4 w-4" />{" "}
              <p className="text-xs">{repoData.stargazers_count}</p>
            </span>

            <span className="flex items-center gap-1">
              <IconGitFork className="h-4 w-4" />{" "}
              <p className="text-xs">{repoData.forks_count}</p>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {topLanguages.slice(0, 2).map(([lang, perc]) => (
              <p key={lang} className="text-muted-foreground text-xs">
                {lang}: {perc}
              </p>
            ))}
          </div>
        </div>

        <p className="text-muted-foreground text-xs">
          {" "}
          {format(repoData.created_at, "d-LLL-yyyy")}
        </p>
      </div>
    </Link>
  );
}
