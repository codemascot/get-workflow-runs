import nock from "nock";
import { getInfoFromApi } from "./getInfoFromApi";

beforeAll(async () => {
  const scope = nock("https://api.github.com");
  // Resolve organization ID
  scope.get("/orgs/NordicSemiconductor").reply(200, {
    id: 33217104,
  });

  scope.get("/orgs/ACME").reply(200, {
    id: 1234567,
  });

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

describe("getOrganization", () => {
  it("should resolve an organization name to an ID", async () => {
    expect(
      await getInfoFromApi("https://api.github.com/orgs/NordicSemiconductor")
    ).toMatchObject({
      data: {
        id: 33217104,
      },
    });

    expect(
      await getInfoFromApi("https://api.github.com/orgs/ACME")
    ).toMatchObject({
      data: {
        id: 1234567,
      },
    });
    expect(
      await getInfoFromApi(
        "https://api.github.com/repos/NordicSemiconductor/asset-tracker-cloud-app-js/actions/runs"
      )
    ).toMatchObject({
      data: [
        {
          name: "testrepo",
          default_branch: "saga",
        },
      ],
    });

    expect(
      await getInfoFromApi(
        "https://api.github.com/repos/NordicSemiconductor/asset-tracker-cloud-aws-js/actions/runs"
      )
    ).toMatchObject({
      data: [
        {
          name: "testrepo2",
          default_branch: "saga",
        },
      ],
    });

    expect(
      await getInfoFromApi(
        "https://api.github.com/organizations/33217104/team/4465041/repos?page=1"
      )
    ).toMatchObject({
      data: [
        {
          name: "testrepo",
          default_branch: "saga",
        },
      ],
    });

    expect(
      await getInfoFromApi(
        "https://api.github.com/organizations/33217104/team/4465041/repos?page=2"
      )
    ).toMatchObject({
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
