import nock from "nock";
import { getRunPromises } from "./getRunPromises";
beforeAll(async () => {
  const scope = nock("https://api.github.com");
  // Resolve teamsResponse
  scope
    .get("/repos/NordicSemiconductor/asset-tracker-cloud-app-js/actions/runs")
    .reply(200, [
      {
        name: "testrepo",
        default_branch: "saga",
      },
    ]);

  scope
    .get("/repos/NordicSemiconductor/asset-tracker-cloud-aws-js/actions/runs")
    .reply(200, [
      {
        name: "testrepo2",
        default_branch: "saga",
      },
    ]);
});

describe("getReposResponse", () => {
  it("should resolve run info to sensible response", async () => {
    expect(await getRunPromises("asset-tracker-cloud-app-js")).toMatchObject({
      data: [
        {
          name: "testrepo",
          default_branch: "saga",
        },
      ],
    });

    expect(await getRunPromises("asset-tracker-cloud-aws-js")).toMatchObject({
      data: [
        {
          name: "testrepo2",
          default_branch: "saga",
        },
      ],
    });
  });
});

afterAll(() => {
  expect(nock.isDone()).toBeTruthy();
});
