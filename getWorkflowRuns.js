import parse from "parse-link-header";
import { getTeamId } from "./lib/getTeam.js";
import { getLatestSagaStatus } from "./lib/getLatestSagaStatus.js";
import { getInfoFromApi } from "./lib/getInfoFromApi.js";

const status = "completed";
const teamName = "nRF Asset Tracker";

export const getWorkflowRuns = async () => {
  const organization = (
    await getInfoFromApi("https://api.github.com/orgs/NordicSemiconductor")
  ).data;
  const teamID = await getTeamId(organization.id, teamName);

  // Get all repositories
  let pageNumber = 1;
  let parsedHeader;
  const repos = [];
  do {
    const reposResponse = await getInfoFromApi(
      "https://api.github.com/organizations/" +
        organization.id +
        "/team/" +
        teamID +
        "/repos?page=" +
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
    let run = await getInfoFromApi(
      "https://api.github.com/repos/NordicSemiconductor/" +
        repo.name +
        "/actions/runs"
    );
    run_promises.push(
      getLatestSagaStatus(run.data, repo.default_branch, status)
    );
  }
  const repoRuns = await Promise.all(run_promises);
  return {
    workflow_runs: repoRuns.flat(),
  };
};
