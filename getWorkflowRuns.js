import axios from "axios";
import parse from "parse-link-header";
import { getReposResponse } from "./lib/getReposResponse.js";
import { getOrganization } from "./lib/getOrganization.js";
import { getRunPromises } from "./lib/getRunPromises.js";
import { getTeamId } from "./lib/getTeam.js";
import { getLatestSagaStatus } from "./lib/getLatestSagaStatus.js";

const status = "completed";
const teamName = "nRF Asset Tracker";

export const getWorkflowRuns = async () => {
  const organization = await getOrganization("NordicSemiconductor");
  const teamID = await getTeamId(organization.id, teamName);

  // Get all repositories
  let pageNumber = 1;
  let parsedHeader;
  const repos = [];
  do {
    const reposResponse = await getReposResponse(
      organization.id,
      teamID,
      pageNumber
    );
    parsedHeader = parse(reposResponse.headers["link"]);
    for (const repo of reposResponse.data) {
      repos.push({ name: repo.name, default_branch: repo.default_branch });
    }
  } while (pageNumber++ <= parsedHeader?.last?.page ?? -1);

  // Get all the runs
  const run_promises = [];
  for (const repo of repos) {
    run_promises.push(
      axios
        .get(
          "https://api.github.com/repos/NordicSemiconductor/" +
            repo.name +
            "/actions/runs",
          {
            headers: {
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
            },
          }
        )
        .then((res) =>
          getLatestSagaStatus(res.data, repo.default_branch, status)
        )
        .catch((error) => {
          console.error("error2:", error);
        })
    );
  }
  const repoRuns = await Promise.all(run_promises);
  return {
    workflow_runs: repoRuns.flat(),
  };
};
