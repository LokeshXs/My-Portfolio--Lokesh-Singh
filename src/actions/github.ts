"use server";

import { githubResponseType } from "@/components/common/GithubData";
import axios from "axios";
import { Octokit } from "@octokit/rest";
import { GITHUB_USERNAME } from "@/lib/data";

export async function fetchContributions() {
  try {
    const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
    const accessToken = process.env.GITHUB_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("No Access Token");
    }
    const query = `
    query {
      viewer {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
`;

    const response = await axios.post(
      GITHUB_GRAPHQL_URL,
      { query },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data: githubResponseType =
      response.data.data.viewer.contributionsCollection.contributionCalendar
        .weeks;

    return {
      status: "success",
      data: data,
    };
  } catch (err) {
    console.log(err);
    return {
      status: "error",
      message: "Github token is missing",
    };
  }
}

export async function fetchRepoData(names: string[]) {
  try {
    const githubToken = process.env.GITHUB_ACCESS_TOKEN;
    const githubUsername = GITHUB_USERNAME;

    // These repos are public, so a token is optional here: without one GitHub still answers
    // (with a lower rate limit). The contribution grid is what really needs the token.
    const octokit = new Octokit(githubToken ? { auth: githubToken } : {});

    const reposData = names.map(async (name) => {
      const response = await octokit.request("GET /repos/{owner}/{repo}", {
        owner: githubUsername,
        repo: name,
        headers: {
          "X-Github-Api-Version": "2022-11-28",
        },
      });

      const languagesUsed = await octokit.request("GET /repos/{owner}/{repo}/languages",{
          owner: githubUsername,
        repo: name,
        headers: {
          "X-Github-Api-Version": "2022-11-28",
        },
      })

      
      const data = response.data;
      const languagesData = languagesUsed.data;
      const filteredData = {
        name: data.name,
        owner:data.owner.login,
        description: data.description,
        url: data.html_url,
        forks_count: data.forks_count,
        stargazers_count: data.stargazers_count,
        created_at: data.created_at,
        topics:data.topics,
        languages:languagesData
      };

      return filteredData;
    });

    const data = await Promise.all(reposData);

    return {
      status: "success",
      data: data,
    };
  } catch (err) {
    console.log(err);

    return {
      status: "error",
      message: "Could not load the GitHub repos",
    };
  }
}
