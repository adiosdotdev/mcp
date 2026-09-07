# Contributing

Keep this repository focused on public installation, MCP connection metadata, and reusable workflows. The hosted MCP implementation remains in the Adios platform repository.

Before opening a change:

1. Keep the endpoint and tool names aligned with the live `/config` and `/tools` responses.
2. Keep skills concise and preserve explicit approval before deploys, runtime stops, and deletion.
3. Keep the root portable/Gemini/Kimi skill copies byte-for-byte aligned with the shared plugin skills.
4. Run `npm run check`, `claude plugin validate . --strict`, `claude plugin validate plugins/adios-mcp --strict`, and `gemini extensions validate .`.
5. Add the local marketplace with `codex plugin marketplace add .`, restart the ChatGPT desktop app, install the plugin, and test in a new task.
6. Test Claude with `claude plugin marketplace add .` and Gemini with `gemini extensions link .` before publishing.
7. Test the portable plugin in a compatible client and install the local Kimi plugin with `/plugins install <repository-path>`; inspect `/plugins info adios-mcp` before publishing.
8. Never add OAuth tokens, client secrets, workspace credentials, or production log data.

Use an imperative commit subject, such as `Update Adios tool reference`.
