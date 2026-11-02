# Changelog

## [Unreleased]

### Fixed

- Correct the Codex install steps: install the plugin with
  `codex plugin add adios-mcp@adios` and sign in with `codex mcp login adios`.

## [1.0.2] - 2026-11-02

### Added

- Add shared Adios branding and support links to the marketplace plugin.

### Fixed

- Update locked bridge dependencies to clear npm audit findings in
  `body-parser`, `proxy-addr`, `qs`, and `undici`.
- Document all 67 hosted tools, including repository, pull request, app,
  workflow, and observability tools, and list pull request merge and close
  with the other approval-required actions.
- Describe OAuth team access accurately: the connection can reach every team
  the user belongs to, and each tool call names its team.
- Keep internal release material outside the public source and npm package.
- Update the tool reference and debugging workflows to use dedicated Git
  staging and test tools.
- Use the npm lockfile in the Glama Docker build and remove the nonexistent
  compilation step. Document Glama build settings and OAuth requirements.

### Changed

- Align the npm package, lockfile, portable plugin, Codex/Claude plugins,
  and Gemini/Kimi extensions at version `1.0.2` and check version alignment
  in the existing suite. The `--version` test reads `package.json`.
- Upgrade the npm bridge to `mcp-remote` 0.8.3 and require Node.js 20.18.1 or later.
  Existing users may need to sign in again because the bridge now uses a stable
  OAuth credential directory instead of a directory for each package version.
