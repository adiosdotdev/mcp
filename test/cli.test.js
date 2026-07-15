import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(new URL("../bin/adios-mcp.js", import.meta.url));

function run(...args) {
  return spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  });
}

test("prints help without starting the bridge", () => {
  const result = run("--help");

  assert.equal(result.status, 0);
  assert.match(result.stdout, /^Usage: adios-mcp/);
  assert.match(result.stdout, /https:\/\/api\.adios\.dev\/v1\/mcp/);
  assert.equal(result.stderr, "");
});

test("prints the package version", () => {
  const result = run("--version");

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "0.1.0");
  assert.equal(result.stderr, "");
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
      NODE_PATH: join(fixture, "node_modules"),
      NO_COLOR: "1",
    },
  });

  assert.equal(result.status, 0);
  assert.deepEqual(JSON.parse(result.stdout), [
    "https://example.test/mcp",
    "--transport",
    "http-first",
    "--debug",
  ]);
  assert.equal(result.stderr, "");
});
