---
name: adios-operate-debug
description: Diagnose and operate Adios workspaces, preview runtimes, commands, builds, and deployed workloads through the hosted Adios MCP server. Use when work requires inspecting status or Git state, reading runtime/build/command logs, explaining a failed preview or deployment, reviewing workspace context for security, or performing a user-approved restart or stop.
---

# Operate and Debug Adios

Use an evidence-first diagnostic flow. Start with read-only tools, identify the failing layer, and mutate runtime or source state only when the user requests a fix.

## Diagnostic workflow

1. Call `auth_me` and establish `team_id`. Resolve the target using `get_workspace` or `list_workspaces`; do not guess a workspace or workload ID.
2. Establish current state with `get_workspace`, `get_workspace_run_status`, and `get_workspace_git_status`.
3. Choose logs that match the failure:
   - Use `get_workspace_command_status` and `get_workspace_command_logs` when a `command_id` exists.
   - Use `get_workspace_logs` with `type=build` for build failures.
   - Use `get_workspace_logs` with `type=runtime` for preview startup or runtime failures.
   - Use `get_workload_logs` for a deployed workload.
4. Read only the source files implicated by the evidence using `list_workspace_files` and `read_workspace_file`. Common first checks are `adios.yaml`, dependency manifests, lock files, and the runtime entrypoint.
5. Run `check_workspace_adios_yaml` for manifest or startup problems. Use `security_review_workspace` only to collect review context; inspect the returned Git and file evidence before making a security judgment.
6. State the most likely cause, cite the tool evidence, and distinguish confirmed facts from hypotheses.
7. If the user asked for a fix, make the smallest change, rerun the relevant command, poll it to completion, and verify runtime status and logs.

## Operational actions

- Prefer `restart_workspace_run` after a verified configuration or source fix.
- Use `run_workspace_command` only when the specialized lint, build, start, stop, or restart tool does not fit.
- Poll long-running commands instead of issuing duplicates. Include relevant log excerpts in the summary without exposing secrets.
- Ask for explicit approval before `stop_workspace_run`, file deletion, or deployment. Pass `approved=true` only after approval.

## Guardrails

- Do not treat missing logs as proof of health. Report the gap and inspect status or the adjacent log surface.
- Do not reveal access tokens, secrets, or complete sensitive environment values found in logs or files.
- Do not turn a diagnostic request into a source edit, restart, stop, or deploy without authorization.
- If OAuth is expired or the principal lacks team access, ask the user to re-authenticate or select an authorized team.

## Handoff

Report the affected workspace or workload, current state, evidence inspected, root cause or leading hypothesis, changes made, verification results, and any remaining risk or approval needed.
