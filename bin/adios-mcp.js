#!/usr/bin/env node

import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_MCP_URL = "https://api.adios.dev/v1/mcp";
const ownPackagePath = fileURLToPath(new URL("../package.json", import.meta.url));

function readJSON(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function findPackageJSON(packageName) {
  const require = createRequire(import.meta.url);

  try {
    return require.resolve(`${packageName}/package.json`);
  } catch (packageJSONError) {
    let directory;

    try {
      directory = dirname(require.resolve(packageName));
    } catch {
      throw packageJSONError;
    }

    const root = parse(directory).root;
    while (directory !== root) {
      const candidate = join(directory, "package.json");
      if (existsSync(candidate)) {
        try {
          if (readJSON(candidate).name === packageName) {
            return candidate;
          }
        } catch {
          // Keep walking when an ancestor has an unrelated or invalid manifest.
        }
      }
      directory = dirname(directory);
    }

    throw packageJSONError;
  }
}

function resolveBridgeBin() {
  if (process.env.ADIOS_MCP_REMOTE_BIN) {
    return resolve(process.env.ADIOS_MCP_REMOTE_BIN);
  }

  const packagePath = findPackageJSON("mcp-remote");
  const manifest = readJSON(packagePath);
  const bin = typeof manifest.bin === "string"
    ? manifest.bin
    : manifest.bin?.["mcp-remote"] ?? Object.values(manifest.bin ?? {})[0];

  if (!bin) {
    throw new Error("The installed mcp-remote package does not expose a CLI.");
  }

  return resolve(dirname(packagePath), bin);
}

function printHelp() {
  process.stdout.write(`Usage: adios-mcp [mcp-remote options]\n\n`);
  process.stdout.write(`Connect a stdio MCP client to ${DEFAULT_MCP_URL}.\n\n`);
  process.stdout.write("Options are forwarded to mcp-remote. Set ADIOS_MCP_URL to override the hosted endpoint.\n");
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  printHelp();
  process.exit(0);
}

if (args.includes("--version") || args.includes("-v")) {
  process.stdout.write(`${readJSON(ownPackagePath).version}\n`);
  process.exit(0);
}

const endpoint = process.env.ADIOS_MCP_URL || DEFAULT_MCP_URL;

let bridgeBin;
try {
  bridgeBin = resolveBridgeBin();
} catch (error) {
  process.stderr.write(`adios-mcp: ${error.message}\n`);
  process.exit(1);
}

const child = spawn(
  process.execPath,
  [bridgeBin, endpoint, "--transport", "http-first", ...args],
  { env: process.env, stdio: "inherit" },
);

child.once("error", (error) => {
  process.stderr.write(`adios-mcp: unable to start the MCP bridge: ${error.message}\n`);
  process.exitCode = 1;
});

child.once("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exitCode = code ?? 1;
});
