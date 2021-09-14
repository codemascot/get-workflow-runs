import axios from "axios";
import parse from "parse-link-header";
import { getOrganization } from "./lib/getOrganization.js";
import { getTeamId } from "./lib/getTeam.js";

const status = "completed";
const teamName = "nRF Asset Tracker";

export const getWorkflowRuns = async () => {
  const organization = await getOrganization("NordicSemiconductor");
  const teamID = await getTeamId(organization.id, teamName);
  let pageNumber = 1;
  return axios
    .get(
      "https://api.github.com/organizations/" +
        organization.id +
        "/team/" +
        teamID +
        "/repos?page=" +
        pageNumber,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    )
    .then((responseOne) => {
      var parsed = parse(responseOne.headers["link"]);
      const repo_promises = [];
      for (let i = 0; i < parsed.last.page - 1; i++) {
        pageNumber++;
        repo_promises.push(
          axios
            .get(
              "https://api.github.com/organizations/" +
                organization.id +
                "/team/" +
                teamID +
                "/repos?page=" +
                pageNumber,
              {
                headers: {
                  Authorization: `token ${process.env.GITHUB_TOKEN}`,
                },
              }
            )
            .then((response) => {
              responseOne = responseOne.data.concat(response.data);
              const run_promises = [];
              for (let i = 0; i < responseOne.length; i++) {
                const repo_name = responseOne[i].name;
                const default_branch = responseOne[i].default_branch;
                run_promises.push(
                  axios
                    .get(
                      "https://api.github.com/repos/NordicSemiconductor/" +
                        repo_name +
                        "/actions/runs",
                      {
                        headers: {
                          Authorization: `token ${process.env.GITHUB_TOKEN}`,
                        },
                      }
                    )
                    .then((res) =>
                      getLatestSagaStatus(res.data, default_branch)
                    )
                    .catch((error) => {
                      console.error("error2:", error);
                    })
                );
              }
              return Promise.all(run_promises);
            })
            .catch((error) => {
              console.error("error2:", error);
            })
        );
      }
      return Promise.all(repo_promises);
    })
    .then((repoRuns) => ({
      workflow_runs: repoRuns.flat(),
    }))
    .catch((error) => {
      console.error("error:", error);
    });
};

function getLatestSagaStatus(data, default_branch) {
  for (let i = 0; i < data.workflow_runs.length; i++) {
    if (data.workflow_runs[i].head_branch === default_branch) {
      if (data.workflow_runs[i].status === status) var JSONObj = {};
      JSONObj.name = data.workflow_runs[i].repository.name;
      JSONObj.branch = data.workflow_runs[i].head_branch;
      JSONObj.conclusion = data.workflow_runs[i].conclusion;
      JSONObj.url = data.workflow_runs[i].html_url;
      JSONObj.updated_at = data.workflow_runs[i].updated_at;
      return JSONObj;
    }
  }
}
