# Changelog

## [Unreleased]

### Fixed

- Use the npm lockfile in the Glama Docker build and remove the nonexistent
  compilation step. Document Glama build settings and OAuth requirements.

### Changed

- Upgrade the npm bridge to `mcp-remote` 0.8.3 and require Node.js 20.18.1 or later.
  Existing users may need to sign in again because the bridge now uses a stable
  OAuth credential directory instead of a directory for each package version.
