import { getWorkflowRuns } from "./getWorkflowRuns.js";
import { promises as fs } from "fs";

getWorkflowRuns().then((runs) =>
  fs.writeFile("JSONObject.json", JSON.stringify(runs, null, 2), "utf-8")
);
