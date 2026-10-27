# instructure.ai

This pnpm monorepo contains apps deployed to [instructure.ai](https://instructure.ai)
and packages published to the [instructure.ai npm organization](https://www.npmjs.com/org/instructure.ai).

## Development requirements

Use Node **26.12.1** (pinned in [.node-version](./.node-version)) and pnpm
**12.15.0** (pinned in [package.json](./package.json)). Vite+ **1.4.0** provides
Vite, Vitest, Oxc, library packaging, script execution, and workspace tasks.
The [pnpm workspace catalog](./pnpm-workspace.yaml) keeps the bundled tools and
coverage providers aligned. Upgrade Vite+ as a unit rather than updating its
bundled components independently.
The direct Vitest declaration and coverage-provider versions stay aligned with
the bundled runner for peer resolution and editor integration.

The published `@instructure.ai/aiinfo` package supports **Node >=20.0.0**.
Its builds target Node 20; maintenance scripts and all other workspace packages
use Node 26. CI tests the packed ESM and CommonJS exports on Node 20.0.0,
current Node 20, and Node 26 without loading the development toolchain.
`vp migrate` may flag aiinfo's public Node 20 engine range for review: do not
raise that consumer requirement to satisfy the test runner. Test/CI execution
uses the separately pinned Node 26 runtime.

```sh
pnpm install --frozen-lockfile
pnpm exec vp check
pnpm exec vp run typecheck:all
pnpm exec vp run test:all
pnpm exec vp run build:apps
pnpm exec vp run @instructure.ai/aiinfo#build:lib
```

Formatting, lint, compiler checks, tests, and builds are blocking in CI.
Existing warning-level lint rules remain warnings. `vp check` includes
type-aware checks; explicit TypeScript 7 compiler checks also validate every
workspace and aiinfo's declaration project.

## Native workspace commands

Use Vite+'s builtin commands and task filtering, not custom workspace dispatchers.
The local CLI works without a global Vite+ installation:

```sh
# Select a package task and forward arguments
pnpm exec vp run @instructure.ai/canvas-mcp#test --coverage
pnpm exec vp run --filter './apps/*' typecheck

# Start or preview one app, preserving its package-local config
pnpm exec vp -C apps/nutritionfacts dev
pnpm exec vp -C apps/nutritionfacts preview

# Inspect tasks and workspace packages
pnpm exec vp run
pnpm list -r --depth -1

# Apply formatting or lint fixes explicitly
pnpm exec vp fmt
pnpm exec vp lint --fix
```

`vp build` and `vp test` invoke builtin tools; `vp run <task>` executes the
configured task and its dependencies. Use `build:apps` for the deployed site:
it prepares root public files, builds the root site first, then builds the other
apps (including newly generated apps) into their existing subdirectories, and synchronizes the issue-template
package list. Roadmap asset generation and Canvas MCP style optimization remain
part of their build tasks.

Tasks are uncached initially because builds share `dist/` and maintenance
operations have side effects. Remote refresh, release/version, and publication
operations are never part of ordinary validation. `aiinfo#build:lib` uses checked-in
data; the full `aiinfo#build` intentionally refreshes data and creates a pnpm tarball.
`vp pack` builds library artifacts; `pnpm pack` creates the npm release archive.

## Creating apps and packages

Four local starters are registered with `vp create`:

```sh
pnpm exec vp create vanilla -- my-app
pnpm exec vp create react -- my-react-app
pnpm exec vp create instui -- my-instui-app
pnpm exec vp create esm -- my-library
pnpm install
```

Apps are created under `apps/`, ESM libraries under `packages/`, with scoped
`@instructure.ai/<name>` manifests. The local generators only compose and render
project-specific templates; Vite+ owns template selection and invocation.
Generated apps depend on the root site build and are automatically selected by
`build:apps` for validation and deployment.
Run pnpm installation after generation. InstUI generation fetches the current
Instructure UI guidance and reports failures rather than silently omitting it.

## Shared configuration

The private root package, `@instructure.ai/shared-configs`, exports:

- `./vanilla`: shared app build paths, Lightning CSS, and package metadata.
- `./react`: app configuration plus React and the React compiler.
- `./vitest`: shared test discovery, Istanbul coverage, and the custom YAML reporter.
- `./types`: shared external type declarations.

[vite.config.mts](./vite.config.mts) owns root tasks and centralized lint/format
settings. Package-specific lint differences use root path overrides. Each
package's `vite.config.mts` composes app/test settings, with a `pack` block for
library or Roadmap asset builds. Shared app baselines do not inherit root tasks.
Each workspace declares `vite-plus` through the catalog for pnpm resolution.
App config factories receive `import.meta.dirname` so metadata comes from the
selected app's manifest even when a command starts at the workspace root.

Coverage remains package-local and the custom reporter writes summary YAML.
VS Code uses Oxc's root configuration for formatting and type-aware lint.

## Release preparation

Release preparation remains project-specific:

```sh
pnpm exec vp run @instructure.ai/aiinfo#release
pnpm exec vp run @instructure.ai/nutritionfacts#release --version=2.12.0
```

These commands bump the selected package's version and create a commit; they do
not publish. Ensure the index contains no unrelated staged work first.
GitHub workflows retain tag-based release automation, npm OIDC/provenance
publication, and Pages deployment. Dependency installation and tarball creation
continue to use pnpm.

## Contributing

The protected `main` branch requires a PR and squash merge. Branch names must
match the [branch policy](./.github/policies/branch-naming.yml), for example:

- `shared-configs/vite-plus-migration`
- `apps/site/simplify`
- `packages/widget/create`

Keep package-only dependencies and changes scoped to that package. Shared
configuration changes must validate every affected workspace.
