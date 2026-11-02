# Adios MCP

Use Adios workspaces, previews, builds, logs, and deployments from Codex, Claude Code, Gemini CLI, Kimi Code, GitHub Copilot, ChatGPT, and other MCP clients.

This repository packages the hosted Adios MCP service for public installation. It includes a portable Agent Plugins v1 package, Codex and Claude Code marketplace plugins, native Gemini CLI and Kimi Code extensions, two reusable workflows, connection examples, and a readable tool reference. The server runs at Adios, so users don't need to deploy anything from this repository.

## Endpoints

| Purpose | URL |
| --- | --- |
| Streamable HTTP (preferred) | `https://api.adios.dev/v1/mcp` |
| SSE fallback | `https://api.adios.dev/v1/mcp/sse` |
| Public connection metadata | `https://api.adios.dev/v1/mcp/config` |
| Public tool discovery | `https://api.adios.dev/v1/mcp/tools` |

Tool calls use Adios OAuth and act as the signed-in user. The connection can reach every team that user belongs to, and each tool call names the team it works on. Connection metadata and tool schemas are public; an Adios account is required to act on workspaces or workloads.

## Install in Codex

Register the GitHub marketplace:

```sh
codex plugin marketplace add adiosdotdev/mcp
```

Restart the ChatGPT desktop app, open **Plugins**, choose the **Adios** marketplace, install **Adios.dev**, and complete OAuth when prompted. The plugin installs the remote MCP connection and both workflow skills.

To connect only the MCP server without the plugin:

```sh
codex mcp add adios --url https://api.adios.dev/v1/mcp
codex mcp login adios
```

The equivalent `config.toml` is in [`examples/codex-config.toml`](examples/codex-config.toml).

## Install in Claude Code

Register the marketplace and install the plugin:

```sh
claude plugin marketplace add adiosdotdev/mcp
claude plugin install adios-mcp@adios
```

Restart Claude Code or run `/reload-plugins`, then open `/mcp` and complete OAuth for the Adios server. The plugin installs the MCP connection and both workflow skills.

## Install in Gemini CLI

Install the repository as a Gemini CLI extension:

```sh
gemini extensions install https://github.com/adiosdotdev/mcp
```

Restart Gemini CLI after installation. The extension loads the hosted MCP server and both workflow skills. If sign-in does not start automatically, run `/mcp auth adios` in Gemini CLI and complete OAuth in the browser.

## Install in Kimi Code

Install the repository from the Kimi Code plugin manager:

```text
/plugins install https://github.com/adiosdotdev/mcp
/reload
/mcp-config login adios
```

Complete OAuth in the browser after the login command. The plugin connects Kimi Code, including Kimi K3 sessions, to the hosted MCP server and loads both workflow skills.

## Install as a portable Agent Plugin

Clients implementing [Agent Plugins v1](https://agent-plugins.org/) discover the root `plugin.json`, `mcp.json`, and `skills/` automatically. For example, install the repository in GitHub Copilot CLI with:

```sh
copilot plugins install adiosdotdev/mcp
```

The portable package starts `npx -y @adiosdotdev/mcp`, which bridges stdio to the hosted endpoint and completes Adios OAuth when the client connects.

## Install only the skills

Ask Codex to install either GitHub path with `$skill-installer`:

```text
Use $skill-installer to install https://github.com/adiosdotdev/mcp/tree/main/plugins/adios-mcp/skills/adios-build-deploy
```

```text
Use $skill-installer to install https://github.com/adiosdotdev/mcp/tree/main/plugins/adios-mcp/skills/adios-operate-debug
```

Skill-only installs do not configure the MCP server; add the `adios` MCP connection separately.

## Use through npm

For MCP clients that start a local stdio command, use the public npm package.

Requires Node.js 20.18.1 or later and npm.

```json
{
  "mcpServers": {
    "adios": {
      "command": "npx",
      "args": ["-y", "@adiosdotdev/mcp"]
    }
  }
}
```

The command starts a local bridge to the hosted Adios endpoint and opens OAuth when the client connects. Nothing from the Adios platform runs locally.

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

For the Glama directory listing, see [`docs/glama.md`](docs/glama.md) for build
settings and hosted connector setup.

## Safety

Deploys, workload changes, runtime stops, remote Git pushes, pull request merges and closes, and file deletion must remain approval-sensitive. Never commit Adios OAuth tokens, app credentials, or workspace secrets to this repository or to project source.

## Repository layout

```text
.agents/plugins/marketplace.json       Codex marketplace catalog
.claude-plugin/marketplace.json        Claude Code marketplace catalog
plugin.json                            Portable Agent Plugins v1 manifest
mcp.json                               Portable npm stdio bridge configuration
kimi.plugin.json                       Kimi Code plugin manifest
plugins/adios-mcp/.codex-plugin/       Codex plugin manifest
plugins/adios-mcp/.claude-plugin/      Claude Code plugin manifest
plugins/adios-mcp/.mcp.json            Hosted MCP connection
plugins/adios-mcp/skills/              Codex and Claude Code workflows
plugins/adios-mcp/assets/             Shared plugin branding
gemini-extension.json                  Gemini CLI extension manifest
GEMINI.md                              Gemini CLI extension context
skills/                                Portable, Gemini, and Kimi workflow copies
bin/adios-mcp.js                       npm stdio bridge command
docs/                                  Tool and operating reference
examples/                              Direct client configuration
```

Adios platform documentation: [www.adios.dev/mcp](https://www.adios.dev/mcp)

## License

MIT
