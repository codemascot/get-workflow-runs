import nock from "nock";
import { getOrganization } from "./getOrganization.js";

beforeAll(async () => {
  const scope = nock("https://api.github.com");
  // Resolve organization ID
  scope.get("/orgs/NordicSemiconductor").reply(200, {
    id: 33217104,
  });

  scope.get("/orgs/ACME").reply(200, {
    id: 1234567,
  });
});

describe("getOrganization", () => {
  it("should resolve an organization name to an ID", async () => {
    expect(await getOrganization("NordicSemiconductor")).toMatchObject({
      id: 33217104,
    });

    expect(await getOrganization("ACME")).toMatchObject({
      id: 1234567,
    });
  });
});

afterAll(() => {
  expect(nock.isDone()).toBeTruthy();
});
