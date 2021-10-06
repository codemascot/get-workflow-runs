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
    let run = await getRunPromises(repo.name);
    run_promises.push(
      getLatestSagaStatus(run.data, repo.default_branch, status)
    );
  }
  const repoRuns = await Promise.all(run_promises);
  return {
    workflow_runs: repoRuns.flat(),
  };
};
