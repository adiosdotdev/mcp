---
name: adios-build-deploy
description: Build, preview, validate, and deploy projects through the hosted Adios MCP server. Use when work requires creating or importing an Adios workspace, uploading or editing project files, generating adios.yaml, running lint or build commands, starting a preview, inspecting build output, or deploying a verified workspace after explicit approval.
---

# Build and Deploy with Adios

Use the `adios` MCP server to move source code through an inspectable workspace, preview, and deployment flow. Preserve the user's existing source and stop for explicit approval before production or destructive actions.

## Workflow

1. Call `auth_me` and retain the returned `team_id`. If more than one team is possible and the request does not identify one, ask the user to choose.
2. Resolve the workspace with `get_workspace` or `list_workspaces`. Create a new workspace only when the user requests one or no suitable workspace exists.
3. Inspect before changing existing source with `list_workspace_files`, `read_workspace_file`, and `get_workspace_git_status`.
4. Write the smallest coherent change. Prefer `write_workspace_files` for a related batch and `write_workspace_adios_yaml` for a new manifest. Never place credentials in source or `adios.yaml`; use Adios secrets.
5. Run `check_workspace_adios_yaml` before a build or deploy. Address exposed secrets and risky command findings before continuing.
6. Use `lint_workspace` and `build_workspace_dev` for queued validation. Poll `get_workspace_command_status` and read `get_workspace_command_logs` until each command reaches a terminal state. Do not create duplicate commands while one is running.
7. Start or update a preview with `prepare_workspace_preview` or `start_workspace_run`, then verify with `get_workspace_run_status` and `get_workspace_logs`.
8. Summarize the verified revision, checks, preview URL, and remaining risks. Ask for explicit approval before `deploy_workspace` or `deploy_workload`; pass `approved=true` only after that approval.
9. After deployment, inspect `get_workload_logs` when a workload ID is available and report the release result.

## Guardrails

- Treat `delete_workspace_file`, `workspace_git_push`, `stop_workspace_run`, `deploy_workspace`, and `deploy_workload` as approval-sensitive. Never infer approval from a broad request to investigate, fix, preview, or build.
- Do not overwrite unrelated files. Read an existing file before replacing it unless its full content was supplied by the user in the current task.
- Keep `team_id`, `workspace_id`, `command_id`, `build_id`, and `workload_id` from tool results; do not guess IDs.
- A successful tool call is not enough: verify queued commands, runtime readiness, and post-deploy logs.
- If OAuth or team authorization fails, stop and ask the user to authenticate or select an authorized team. Do not seek broader credentials.

## Handoff

Return the workspace ID, checks run, command outcomes, preview URL when available, deployment status, and any approval or follow-up still required.
