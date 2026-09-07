# Glama setup

Adios runs the MCP service at `https://api.adios.dev/v1/mcp`. This repository
contains client configuration and a JavaScript stdio bridge to that service.

## Build the repository listing

Open the [Glama build settings](https://glama.ai/mcp/servers/adiosdotdev/mcp/admin/dockerfile)
and configure:

| Setting | Value |
| --- | --- |
| Install/build command | `npm ci --omit=dev --ignore-scripts` |
| Server command | `node` |
| Server arguments | `bin/adios-mcp.js` |

There is no compilation step. Do not use `pnpm run build` or `npm run build`:
the package ships JavaScript directly and does not define a `build` script.
Use npm so the installation follows the committed `package-lock.json`.

The exported root `Dockerfile` includes Glama's `mcp-proxy` wrapper and a pinned
Git revision. In Glama's command settings, enter only the server command and
arguments above; Glama adds its wrapper. Sync the repository and select the
intended revision when generating a new build.

Run Glama's build test before creating a release. A successful image build
does not by itself establish that authenticated MCP inspection works.

## Authentication and hosted connections

Adios allows MCP initialization and tool discovery without credentials. An
inspector must retain the `Mcp-Session-Id` returned by initialization and send
it with later MCP requests. The separate `/v1/mcp/tools` endpoint also provides
public tool schemas.

Executing tools uses Adios OAuth. An unattended container cannot complete an
interactive browser sign-in on its own. Keep any credentials needed for
authenticated testing in Glama's private configuration, never in this
repository or a Dockerfile.

For clients connecting to the service directly, use a Glama remote connector
with Streamable HTTP at `https://api.adios.dev/v1/mcp` and Adios OAuth. This
connects to the service already hosted by Adios and does not require building
the npm bridge. See [Glama's connector submission guidance](https://glama.ai/mcp/faq).

The repository's `glama.json` declares GitHub maintainers for the repository
listing. It does not configure a build or provide OAuth credentials.
