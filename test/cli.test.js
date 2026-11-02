import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(new URL("../bin/adios-mcp.js", import.meta.url));
const repositoryDirectory = fileURLToPath(new URL("..", import.meta.url));

function readRepositoryJSON(path) {
  return JSON.parse(readFileSync(join(repositoryDirectory, path), "utf8"));
}

function run(...args) {
  return spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  });
}

test("prints help without starting the bridge", () => {
  const result = run("--help");

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /^Usage: adios-mcp/);
  assert.match(result.stdout, /https:\/\/api\.adios\.dev\/v1\/mcp/);
  assert.equal(result.stderr, "");
});

test("prints the package version", () => {
  const result = run("--version");

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(result.stdout.trim(), readRepositoryJSON("package.json").version);
  assert.equal(result.stderr, "");
});

test("client extension manifests expose the hosted Adios MCP server", () => {
  const packageManifest = readRepositoryJSON("package.json");
  const packageLock = readRepositoryJSON("package-lock.json");
  const portablePlugin = readRepositoryJSON("plugin.json");
  const portableMCP = readRepositoryJSON("mcp.json");
  const kimiPlugin = readRepositoryJSON("kimi.plugin.json");
  const codexPlugin = readRepositoryJSON("plugins/adios-mcp/.codex-plugin/plugin.json");
  const claudeMarketplace = readRepositoryJSON(".claude-plugin/marketplace.json");
  const claudePlugin = readRepositoryJSON("plugins/adios-mcp/.claude-plugin/plugin.json");
  const sharedMCP = readRepositoryJSON("plugins/adios-mcp/.mcp.json");
  const geminiExtension = readRepositoryJSON("gemini-extension.json");

  assert.equal(portablePlugin.version, packageManifest.version);
  assert.equal(kimiPlugin.version, packageManifest.version);
  assert.equal(codexPlugin.version, packageManifest.version);
  assert.equal(claudePlugin.version, packageManifest.version);
  assert.equal(geminiExtension.version, packageManifest.version);
  assert.equal(packageLock.version, packageManifest.version);
  assert.equal(packageLock.packages[""].version, packageManifest.version);
  assert.equal(
    portablePlugin.$schema,
    "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  );
  assert.equal(
    portableMCP.$schema,
    "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  );
  assert.deepEqual(portableMCP.mcpServers.adios, {
    type: "stdio",
    command: "npx",
    args: ["-y", "@adiosdotdev/mcp"],
  });
  assert.equal(kimiPlugin.skills, "./skills/");
  assert.equal(kimiPlugin.mcpServers.adios.url, "https://api.adios.dev/v1/mcp");
  assert.equal(claudeMarketplace.plugins[0].source, "./plugins/adios-mcp");
  assert.equal(sharedMCP.mcpServers.adios.url, "https://api.adios.dev/v1/mcp");
  assert.equal(geminiExtension.mcpServers.adios.httpUrl, "https://api.adios.dev/v1/mcp");
});

test("root client extension skills match the shared plugin skills", () => {
  for (const skill of ["adios-build-deploy", "adios-operate-debug"]) {
    const pluginSkill = readFileSync(
      join(repositoryDirectory, "plugins", "adios-mcp", "skills", skill, "SKILL.md"),
      "utf8",
    );
    const rootSkill = readFileSync(
      join(repositoryDirectory, "skills", skill, "SKILL.md"),
      "utf8",
    );

    assert.equal(rootSkill, pluginSkill, `${skill} skill copies must stay in sync`);
  }
});

test("starts the bridge with the Adios endpoint and forwarded options", (t) => {
  const fixture = mkdtempSync(join(tmpdir(), "adios-mcp-test-"));
  const packageDirectory = join(fixture, "node_modules", "mcp-remote");
  mkdirSync(packageDirectory, { recursive: true });
  t.after(() => rmSync(fixture, { recursive: true, force: true }));

  writeFileSync(
    join(packageDirectory, "package.json"),
    JSON.stringify({
      name: "mcp-remote",
      version: "0.0.0-test",
      bin: { "mcp-remote": "bridge.js" },
    }),
  );
  writeFileSync(
    join(packageDirectory, "bridge.js"),
    "process.stdout.write(JSON.stringify(process.argv.slice(2)));\n",
  );

  const result = spawnSync(process.execPath, [cli, "--debug"], {
    encoding: "utf8",
    env: {
      ...process.env,
      ADIOS_MCP_URL: "https://example.test/mcp",
      ADIOS_MCP_REMOTE_BIN: join(packageDirectory, "bridge.js"),
      NO_COLOR: "1",
    },
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.deepEqual(JSON.parse(result.stdout), [
    "https://example.test/mcp",
    "--transport",
    "http-first",
    "--debug",
  ]);
  assert.equal(result.stderr, "");
});
