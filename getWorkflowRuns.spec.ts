import { promises as fs } from "fs";
import * as path from "path";
import { getWorkflowRuns } from "./getWorkflowRuns";
import * as nock from "nock";
import {URL} from "url";

const getResponse = async (filename: string) =>
  JSON.parse(
    ((await fs.readFile(path.join(process.cwd(), "TestData", filename + ".json"))).toString())
  );

const getResponseBody = async (filename: string) => (await getResponse(filename)).body;

beforeAll(async () => {
  const scope = nock("https://api.github.com");

  // Resolve organization ID
  scope
    .get("/orgs/NordicSemiconductor")
    .reply(200, await getResponseBody("organization"));

  // Resolve Team ID
  scope
    .get("/organizations/33217104/teams")
    .reply(200, await getResponseBody("teams"));

  // Fetch repos of team
  const { body: repos1body, headers: repos1headers } = await getResponse(
    "repos1"
  );
  scope
    .get("/organizations/33217104/team/4465041/repos?page=1")
    .reply(200, repos1body, repos1headers);

  const { body: repos2body, headers: repos2headers } = await getResponse(
    "repos2"
  );
  scope
    .get("/organizations/33217104/team/4465041/repos?page=2")
    .reply(200, repos2body, repos2headers);

  // Set up all the repos
  const repoResponses = (
    await fs.readdir(path.join(process.cwd(), "TestData"))
  ).filter((name) => name.startsWith("runs_"));

  await Promise.all(
    repoResponses.map(async (name) => {
      const { url, body } = await getResponse(name.replace(".json", ""));
      scope.get(new URL(url).pathname).reply(200, body);
    })
  );
});

test("comparing number of elements", async () => {
  const testData = JSON.parse(
    await fs.readFile(
      path.join("TestData", "expectedWorkflowRuns.json"),
      "utf-8"
    )
  );
  const actualData = await getWorkflowRuns();

  expect(actualData.workflow_runs).toMatchObject(testData.workflow_runs);
});

afterAll(() => {
  expect(nock.isDone()).toBeTruthy();
});