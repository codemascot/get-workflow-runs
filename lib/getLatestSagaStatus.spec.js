import { getLatestSagaStatus } from "./getLatestSagaStatus";

describe("getLatestSagaStatus", () => {
  const run = {
    head_branch: "saga",
    status: "completed",
    conclusion: "success",
    html_url: "https://example.com",
    updated_at: "2021-01-01T00:00:00Z",
    repository: {
      name: "my-test-repo",
    },
  };

  it("should return the latest workflow run for a given branch out of a listof workflow runs", () => {
    const result = getLatestSagaStatus(
      { workflow_runs: [run] },
      "saga",
      "completed"
    );
    expect(result).toEqual({
      name: "my-test-repo",
      branch: "saga",
      conclusion: "success",
      url: "https://example.com",
      updated_at: "2021-01-01T00:00:00Z",
    });
  });

  it("should ignore runs with unexpected status", () => {
    const result = getLatestSagaStatus(
      {
        workflow_runs: [
          {
            ...run,
            status: "in_progress",
          },
        ],
      },
      "saga",
      "completed"
    );
    expect(result).toBeUndefined();
  });
});
