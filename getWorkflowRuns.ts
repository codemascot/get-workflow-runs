import parse, { Links } from "parse-link-header";
import { getInfoFromApi } from "./lib/getInfoFromApi.js";
import { getLatestSagaStatus, WorkflowRun } from "./lib/getLatestSagaStatus.js";
import { getTeamId } from "./lib/getTeam.js";

const status = "completed";
const teamName = "nRF Asset Tracker"; 

export const getWorkflowRuns = async () => {
  const organization = (
    await getInfoFromApi("https://api.github.com/orgs/NordicSemiconductor")
  ).data;
  const teamID = await getTeamId(organization.id, teamName);

  // Get all repositories
  let pageNumber = 1;
  let parsedHeader:Links | null;
  const repos = [];
  do {
    const reposResponse = await getInfoFromApi<{name:string, default_branch:string}[]>(
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
  } while (pageNumber++ <= parseInt(parsedHeader?.last?.page ?? '-1', 10));

  // Get all the runs
  const run_promises = [];
  for (const repo of repos) {
    const run = await getInfoFromApi<{workflow_runs: WorkflowRun[]}>(
      "https://api.github.com/repos/NordicSemiconductor/" +
        repo.name +
        "/actions/runs"
    );
    run_promises.push(
      getLatestSagaStatus(
        {
        workflow_runs: run.data.workflow_runs, 
        expectedStatus: status,
        default_branch: repo.default_branch, 
        }
        )
    );
  }
  const repoRuns = await Promise.all(run_promises);
  return {
    workflow_runs: repoRuns.flat(),
  };
};
