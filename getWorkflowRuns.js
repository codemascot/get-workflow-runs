import axios from "axios";
import parse from "parse-link-header";
import { promises as fs } from "fs";
//import nock from "nock";

const status = "completed";
const teamName = "nRF Asset Tracker";

export const getWorkflowRuns = () => {
  /*const scope = nock("https://api.github.com")
    .get("/orgs/NordicSemiconductor")
    .reply(200, {
      headers: {
        server: "GitHub.com",
        date: "Fri, 10 Sep 2021 08:23:54 GMT",
        "content-type": "application/json; charset=utf-8",
        "content-length": "1754",
      },
    });
  console.log(scope);*/
  return axios
    .get("https://api.github.com/orgs/NordicSemiconductor", {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    })
    .then((res) => {
      console.log(res);
      fs.writeFile(
        "./TestData/organizationHeaders.json",
        JSON.stringify(
          {
            url: "https://api.github.com/orgs/NordicSemiconductor",
            headers: res.headers,
            body: res.data,
          },
          null,
          2
        ),
        "utf-8"
      );
      const NordicSemiconductor = res.data.id;
      return axios
        .get(
          "https://api.github.com/organizations/" +
            NordicSemiconductor +
            "/teams",
          {
            headers: {
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
            },
          }
        )
        .then((res) => {
          fs.writeFile(
            "./TestData/teams.json",
            JSON.stringify(
              {
                url:
                  "https://api.github.com/organizations/" +
                  NordicSemiconductor +
                  "/teams",
                headers: res.headers,
                body: res.data,
              },
              null,
              2
            ),
            "utf-8"
          );
          let teamID;
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].name === teamName) {
              teamID = res.data[i].id;
              break;
            }
          }
          let pageNumber = 1;
          return axios
            .get(
              "https://api.github.com/organizations/" +
                NordicSemiconductor +
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
              fs.writeFile(
                "./TestData/repos" + pageNumber + ".json",
                JSON.stringify(
                  {
                    url:
                      "https://api.github.com/organizations/" +
                      NordicSemiconductor +
                      "/team/" +
                      teamID +
                      "/repos?page=" +
                      pageNumber,
                    headers: responseOne.headers,
                    body: responseOne.data,
                  },
                  null,
                  2
                ),
                "utf-8"
              );
              var parsed = parse(responseOne.headers["link"]);
              const repo_promises = [];
              for (let i = 0; i < parsed.last.page - 1; i++) {
                pageNumber++;
                repo_promises.push(
                  axios
                    .get(
                      "https://api.github.com/organizations/" +
                        NordicSemiconductor +
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
                      fs.writeFile(
                        "./TestData/repos" + pageNumber + ".json",
                        JSON.stringify(
                          {
                            url:
                              "https://api.github.com/organizations/" +
                              NordicSemiconductor +
                              "/team/" +
                              teamID +
                              "/repos?page=" +
                              pageNumber,
                            headers: response.headers,
                            body: response.data,
                          },
                          null,
                          2
                        ),
                        "utf-8"
                      );
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
                            .then((res) => {
                              fs.writeFile(
                                "./TestData/runs_" + repo_name + ".json",
                                JSON.stringify(
                                  {
                                    url:
                                      "https://api.github.com/repos/NordicSemiconductor/" +
                                      repo_name +
                                      "/actions/runs",
                                    headers: res.headers,
                                    body: res.data,
                                  },
                                  null,
                                  2
                                ),
                                "utf-8"
                              );
                              return getLatestSagaStatus(
                                res.data,
                                default_branch
                              );
                            })
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
        })
        .catch((error) => {
          console.error("error2:", error);
        });
    })
    .catch((error) => {
      console.error("error2:", error);
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
