import nock from "nock";
import { getTeamId } from "./getTeam";
const teamName = "nRF Asset Tracker";

beforeAll(async () => {
  const scope = nock("https://api.github.com");
  // Resolve team ID
  scope.get("/organizations/33217104/teams").reply(200, [
    {
      name: "nRF Asset Tracker",
      id: 4465041,
    },
    {
      name: "Other team",
      id: 123456,
    },
  ]);
});

describe("getTeam", () => {
  it("should resolve an organization name and teamName to an ID", async () => {
    expect(await getTeamId(33217104, teamName)).toBe(4465041);
  });
});

afterAll(() => {
  expect(nock.isDone()).toBeTruthy();
});
