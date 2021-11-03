export function getLatestSagaStatus(data, default_branch, status) {
  for (let i = 0; i < data.workflow_runs.length; i++) {
    if (data.workflow_runs[i].head_branch === default_branch) {
      if (data.workflow_runs[i].status === status) {
        var JSONObj = {};
        JSONObj.name = data.workflow_runs[i].repository.name;
        JSONObj.branch = data.workflow_runs[i].head_branch;
        JSONObj.conclusion = data.workflow_runs[i].conclusion;
        JSONObj.url = data.workflow_runs[i].html_url;
        JSONObj.updated_at = data.workflow_runs[i].updated_at;
        return JSONObj;
      }
    }
  }
}
