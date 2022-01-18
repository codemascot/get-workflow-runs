type JSONOBJECT = {
	name: string
	branch: string
	conclusion: string
	url: string
	updated_at: string
}

export type WorkflowRun = {
	head_branch: string
	repository: { name: string }
	status: string
	conclusion: string
	html_url: string
	updated_at: string
}

export function getLatestSagaStatus({
	workflow_runs,
	default_branch,
	expectedStatus,
}: {
	workflow_runs: WorkflowRun[]
	default_branch: string
	expectedStatus: string
}): JSONOBJECT | undefined {
	for (const run of workflow_runs) {
		if (run.head_branch !== default_branch || run.status !== expectedStatus) {
			continue
		}
		return {
			name: run.repository.name,
			branch: run.head_branch,
			conclusion: run.conclusion,
			url: run.html_url,
			updated_at: run.updated_at,
		}
	}
	return undefined
}
