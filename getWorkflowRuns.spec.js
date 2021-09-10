import fs from "fs";
import { getWorkflowRuns } from "./getWorkflowRuns.js";

test("comparing number of elements", async () => {
  const testData = JSON.parse(fs.readFileSync("testData.json", "utf-8"));
  const actualData = await getWorkflowRuns();
  expect(actualData.workflow_runs).toHaveLength(testData.workflow_runs.length);
});

/*test("comparing number of elements", async () => {
  const testData = JSON.parse(fs.readFileSync("testData.json", "utf-8"));
  const actualData = await getWorkflowRuns();
  for (let i = 0; i < actualData.workflow_runs.length; i++) {
    console.log(actualData.workflow_runs[i]);
    expect(actualData.workflow_runs[i]).anything();
  }
});*/

test("check if saga", async () => {
  const testData = JSON.parse(fs.readFileSync("testData.json", "utf-8"));
  const actualData = await getWorkflowRuns();
  for (let i = 0; i < actualData.workflow_runs.length; i++) {
    console.log(actualData.workflow_runs[i]);
    expect(actualData.workflow_runs[i].branch).toEqual("saga");
  }
  //expect(actualData.workflow_runs[1].branch).toEqual("saga");
});
