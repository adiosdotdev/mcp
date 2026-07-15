# Contributing

Keep this repository focused on public installation, MCP connection metadata, and reusable workflows. The hosted MCP implementation remains in the Adios platform repository.

Before opening a change:

1. Keep the endpoint and tool names aligned with the live `/config` and `/tools` responses.
2. Keep skills concise and preserve explicit approval before deploys, runtime stops, and deletion.
3. Validate JSON and both skill folders.
4. Add the local marketplace with `codex plugin marketplace add .`, restart the ChatGPT desktop app, install the plugin, and test in a new task.
5. Never add OAuth tokens, client secrets, workspace credentials, or production log data.

Use an imperative commit subject, such as `Update Adios tool reference`.
