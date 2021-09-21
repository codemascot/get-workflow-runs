import nock from "nock";
import { getReposResponse } from "./getReposResponse";

beforeAll(async () => {
  const scope = nock("https://api.github.com");
  // Resolve teamsResponse
  scope.get("/organizations/33217104/team/4465041/repos?page=1").reply(200, [
    {
      name: "testrepo",
      default_branch: "saga",
    },
  ]);

  scope.get("/organizations/33217104/team/4465041/repos?page=2").reply(200, [
    {
      name: "testrepo2",
      default_branch: "saga",
    },
  ]);
});

describe("getReposResponse", () => {
  it("should resolve team info to sensible response", async () => {
    expect(await getReposResponse(33217104, 4465041, 1)).toMatchObject({
      data: [
        {
          name: "testrepo",
          default_branch: "saga",
        },
      ],
    });

    expect(await getReposResponse(33217104, 4465041, 2)).toMatchObject({
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
