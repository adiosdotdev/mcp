# Adios MCP

Use Adios workspaces, previews, builds, logs, and deployments from Codex, ChatGPT, and other MCP clients.

This repository packages the hosted Adios MCP service for public installation. It includes a Codex marketplace plugin, two reusable skills, connection examples, and a readable tool reference. The server runs at Adios, so users don't need to deploy anything from this repository.

## Endpoints

| Purpose | URL |
| --- | --- |
| Streamable HTTP (preferred) | `https://api.adios.dev/v1/mcp` |
| SSE fallback | `https://api.adios.dev/v1/mcp/sse` |
| Public connection metadata | `https://api.adios.dev/v1/mcp/config` |
| Public tool discovery | `https://api.adios.dev/v1/mcp/tools` |

Tool calls use Adios OAuth and are scoped to the authenticated user and team. Connection metadata and tool schemas are public; an Adios account is required to act on workspaces or workloads.

## Install in Codex

Register the GitHub marketplace:

```sh
codex plugin marketplace add adiosdotdev/mcp
```

Restart the ChatGPT desktop app, open **Plugins**, choose the **Adios** marketplace, install **Adios MCP**, and complete OAuth when prompted. The plugin installs the remote MCP connection and both workflow skills.

To connect only the MCP server without the plugin:

```sh
codex mcp add adios --url https://api.adios.dev/v1/mcp
codex mcp login adios
```

The equivalent `config.toml` is in [`examples/codex-config.toml`](examples/codex-config.toml).

## Install only the skills

Ask Codex to install either GitHub path with `$skill-installer`:

```text
Use $skill-installer to install https://github.com/adiosdotdev/mcp/tree/main/plugins/adios-mcp/skills/adios-build-deploy
```

```text
Use $skill-installer to install https://github.com/adiosdotdev/mcp/tree/main/plugins/adios-mcp/skills/adios-operate-debug
```

Skill-only installs do not configure the MCP server; add the `adios` MCP connection separately.

## Other MCP clients

Create a remote or Streamable HTTP MCP connection named `adios` with this URL:

```text
https://api.adios.dev/v1/mcp
```

Let the client complete OAuth rather than adding a static token. If the client does not support Streamable HTTP, use the SSE endpoint shown above. Configuration field names vary by client.

## Included workflows

- `adios-build-deploy`: create or import a workspace, update source, validate `adios.yaml`, run lint/build, start a preview, and deploy after approval.
- `adios-operate-debug`: inspect Git/runtime/command state, analyze logs, diagnose failures, and perform verified operational fixes.

See [`docs/tool-reference.md`](docs/tool-reference.md) for the current tool groups and approval-sensitive operations. The live `/tools` endpoint remains the source of truth.

## Safety

Deploys, workload changes, runtime stops, and file deletion must remain approval-sensitive. Never commit Adios OAuth tokens, app credentials, or workspace secrets to this repository or to project source.

## Repository layout

```text
.agents/plugins/marketplace.json       Codex marketplace catalog
plugins/adios-mcp/.codex-plugin/       Plugin manifest
plugins/adios-mcp/.mcp.json            Hosted MCP connection
plugins/adios-mcp/skills/              Reusable Codex workflows
docs/                                  Tool and operating reference
examples/                              Direct client configuration
```

Adios platform documentation: [www.adios.dev/mcp](https://www.adios.dev/mcp)

## License

MIT
