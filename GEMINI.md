# Adios MCP

This extension connects Gemini CLI to the OAuth-scoped Adios MCP server for
workspace source, previews, builds, deployments, and production diagnostics.

Use the `adios-build-deploy` skill for workspace creation, source updates,
validation, previews, builds, and approved deployments. Use the
`adios-operate-debug` skill for read-first diagnosis of workspace, runtime,
command, build, and workload failures.

Establish the authenticated user and `team_id` before resolving resources.
Keep all returned resource IDs scoped to that team, poll queued operations to a
terminal state, and verify results with status and logs. Ask for explicit user
approval immediately before deployments, runtime stops, file deletion, or
remote Git pushes. Never place OAuth tokens or other credentials in project
source.
