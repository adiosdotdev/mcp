# Tool reference

The Adios MCP exposes tools for workspace source, previews, builds, deployments, hosted Git repositories and pull requests, apps, workflows, logs, and resumable agent plans. The live discovery endpoint at `https://api.adios.dev/v1/mcp/tools` is the source of truth for input and output schemas.

## Discovery and identity

- `adios_capabilities` — describe tool groups and platform capabilities.
- `auth_me` — return the current authenticated principal and team context.

## Agent plans and events

- `get_agent_state` — read a session transcript, runs, plan, steps, and events.
- `list_agents` — list the agent definitions, versions, suites, and bindings authorized for a team.
- `list_agent_runs` — list agent run history with team-scoped filters.
- `save_agent_plan` — persist or update a coding plan.
- `update_agent_plan_step` — update the status and evidence for a plan step.
- `append_agent_event` — append progress, test, tool, browser, approval, or deployment events.
- `create_project_task`, `list_project_tasks` — save and list follow-up TODOs for a project. Creating a task never runs it; a user approves it separately.

## Workspaces and source

- `list_workspaces`, `get_workspace`, `create_workspace`
- `rename_workspace_preview` — set a friendly alias for a workspace preview. The canonical preview URL does not change.
- `list_workspace_files`, `read_workspace_file`
- `write_workspace_file`, `write_workspace_files`
- `write_workspace_adios_yaml`
- `move_workspace_file`, `delete_workspace_file`
- `get_workspace_git_status`
- `stage_workspace_file`, `unstage_workspace_file`, `workspace_git_commit`, `workspace_git_push`

`delete_workspace_file` and `workspace_git_push` require explicit approval.

## Validation, builds, and previews

- `prepare_workspace_preview` — optionally create a workspace, write files, prepare the manifest, build, start, and wait for a preview URL.
- `check_workspace_adios_yaml` — find exposed secrets, unsafe settings, and risky command patterns.
- `lint_workspace`, `build_workspace`, `build_workspace_dev`
- `start_workspace_run`, `stop_workspace_run`, `restart_workspace_run`
- `test_workspace`, `integration_test_workspace`
- `get_workspace_command_status`, `get_workspace_command_logs`
- `get_workspace_run_status`, `get_workspace_logs`

Queued commands return a `command_id`. Poll status and logs until the command reaches a terminal state. `stop_workspace_run` requires explicit approval.

## Repositories, branches, and pull requests

- `list_repositories` — list hosted Git repositories visible to you in a team.
- `list_repository_branches`, `compare_repository_branches`, `create_repository_branch`
- `create_repository_workspace` — create a workspace from one branch.
- `get_repository_usage` — read a repository's current disk usage.
- `workspace_git_pull_branch` — fast-forward the workspace branch from its Adios remote. It fails if local and remote history have diverged.
- `workspace_git_push_branch` — push the workspace's work branch.
- `list_pull_requests`, `get_pull_request`, `create_pull_request`
- `merge_pull_request`, `close_pull_request`

`workspace_git_push_branch`, `merge_pull_request`, and `close_pull_request` require explicit approval. `create_pull_request` opens a pull request but never merges it.

## Apps, databases, and workflows

- `list_apps`, `get_app` — list team workloads (apps, APIs, workers, databases, and caches) or read one, including its source and requested resources.
- `inspect_database` — list the databases and tables of a database workload without running SQL.
- `list_workflows`, `get_workflow`, `list_workflow_runs`

These tools are read-only.

## Review, deploy, and production

- `security_review_workspace` — collect workspace context for a security review; it is not a security verdict by itself.
- `deploy_workspace` — deploy the current workspace or a selected build to its linked workload; optionally pass a concrete `region`.
- `get_workload_logs` — read recent production workload logs.
- `deploy_workload` — deploy an existing build to a workload; optionally pass a concrete `region`.

Both deployment tools require explicit approval. When `region` is omitted, the API resolves the team's home region; MCP clients can inspect it first with `get_team_deployment_context`. A client should validate the manifest, run relevant checks, inspect the build result, and ask the user immediately before deployment.

## Logs and incidents

- `query_observability_logs` — query team workload logs from the platform log index.
- `list_observability_incidents` — list grouped workload incidents and trends.
- `get_observability_incident` — read one incident and its occurrences.

## Authentication and tenancy

Tool calls use OAuth scopes `openid profile email mcp`. The connection acts as you and can reach every team your account belongs to; each tool call names the team it works on. Keep the `team_id` returned or selected during the session and pass it consistently. Never reuse IDs from another team or substitute platform-wide credentials for a failed user authorization.

- `get_team_deployment_context` — return the concrete home region used for a team's default deployments.
