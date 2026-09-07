# Tool reference

The Adios MCP exposes tools for workspace source, previews, builds, deployments, logs, and resumable agent plans. The live discovery endpoint at `https://api.adios.dev/v1/mcp/tools` is the source of truth for input and output schemas.

## Discovery and identity

- `adios_capabilities` — describe tool groups and platform capabilities.
- `auth_me` — return the current authenticated principal and team context.

## Agent plans and events

- `get_agent_state` — read a session transcript, runs, plan, steps, and events.
- `save_agent_plan` — persist or update a coding plan.
- `update_agent_plan_step` — update the status and evidence for a plan step.
- `append_agent_event` — append progress, test, tool, browser, approval, or deployment events.

## Workspaces and source

- `list_workspaces`, `get_workspace`, `create_workspace`
- `list_workspace_files`, `read_workspace_file`
- `write_workspace_file`, `write_workspace_files`
- `write_workspace_adios_yaml`
- `move_workspace_file`, `delete_workspace_file`
- `get_workspace_git_status`
- `workspace_git_action`, `workspace_git_commit`, `workspace_git_push`

`delete_workspace_file` and `workspace_git_push` require explicit approval.

## Validation, builds, and previews

- `prepare_workspace_preview` — optionally create a workspace, write files, prepare the manifest, build, start, and wait for a preview URL.
- `check_workspace_adios_yaml` — find exposed secrets, unsafe settings, and risky command patterns.
- `lint_workspace`, `build_workspace`, `build_workspace_dev`
- `start_workspace_run`, `stop_workspace_run`, `restart_workspace_run`
- `run_workspace_command`
- `get_workspace_command_status`, `get_workspace_command_logs`
- `get_workspace_run_status`, `get_workspace_logs`

Queued commands return a `command_id`. Poll status and logs until the command reaches a terminal state. `stop_workspace_run` requires explicit approval.

## Review, deploy, and production

- `security_review_workspace` — collect workspace context for a security review; it is not a security verdict by itself.
- `deploy_workspace` — deploy the current workspace or a selected build to its linked workload; optionally pass a concrete `region`.
- `get_workload_logs` — read recent production workload logs.
- `deploy_workload` — deploy an existing build to a workload; optionally pass a concrete `region`.

Both deployment tools require explicit approval. When `region` is omitted, the API resolves the team's home region; MCP clients can inspect it first with `get_team_deployment_context`. A client should validate the manifest, run relevant checks, inspect the build result, and ask the user immediately before deployment.

## Authentication and tenancy

Tool calls use OAuth scopes `openid profile email mcp`. Keep the `team_id` returned or selected during the session and pass it consistently. Never reuse IDs from another team or substitute platform-wide credentials for a failed user authorization.

- `get_team_deployment_context` — return the concrete home region used for a team's default deployments.
