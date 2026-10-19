# instructure.ai

This is a monorepo of apps and packages. Apps are served on the [instructure.ai](https://instructure.ai) website and packages are released to the [instructure.ai](https://www.npmjs.com/org/instructure.ai) NPM organization.

Configs and dev dependencies are shared from the root package `@instructure.ai/shared-configs` and extended in workspace packages in `/apps` and `/packages`.

## Development Requirements

Use Node.js 24.15.0 or newer and pnpm 12.14.0 (pinned in `package.json`). Run `pnpm install --frozen-lockfile`, `pnpm typecheck`, and `pnpm test all` from the workspace root. `pnpm build apps` builds the deployed site; `pnpm build:root` builds its root page.

The workspace uses TypeScript 7 through `tsc`, including root scripts and shared build configurations. Library declarations are generated separately from maintenance scripts. Validate the library with `pnpm --filter @instructure.ai/aiinfo build:lib`; its full build also refreshes remote feature data.

TypeScript 7.0.2 and YAML 2 are retained for build-tool peer compatibility; Node type declarations follow the supported Node 24 runtime. Ansis 5 is an explicitly pinned beta. CI lint reporting is advisory while existing source findings are addressed separately; compiler, test, and build checks are blocking.

## @instructure.ai/shared-configs

![Version](https://img.shields.io/github/package-json/version/instructure/instructure.ai?labelColor=%230E1721&color=%234279B6) ![NPM Builds](https://img.shields.io/github/actions/workflow/status/instructure/instructure.ai/release-package.yml?logo=npm&logoColor=%23CB3837&label=package%20builds&labelColor=%230E1721) ![Web Builds](https://img.shields.io/github/actions/workflow/status/instructure/instructure.ai/deploy-apps.yml?logo=javascript&logoColor=%23F7DF1E&label=web%20builds&labelColor=%230E1721) ![Code Coverage](https://img.shields.io/badge/dynamic/yaml?url=https%3A%2F%2Fraw.githubusercontent.com%2Finstructure%2Finstructure.ai%2Frefs%2Fheads%2Fmain%2Fcoverage%2Fcoverage.yml&query=coverage.totals.total&logo=vitest&logoColor=%236E9F18&label=coverage&labelColor=%230E1721&color=%234279B6)

`@instructure.ai/shared-configs` is the root package of this monorepo and provides package templates, workspace utilities, and base configurations.

### Package Templates

Package templates are provided for apps and packages and can be instantiated with the Workspace script `new`.

```shell
pnpm new <packageName> [--template (default: vanilla | react | instui | esm)]
```

### Workspace Utilities

In addition to pnpm builtins, the `workspace` script provides an interface for interacting with multiple packages at once.

```shell
pnpm build <option> [args]
pnpm dev <packagename> [args]
pnpm preview <packagename> [args]
pnpm release <option> [args]
pnpm lint <option> [args]
pnpm test <option> [args]
pnpm workspace [info]
```

Global `option`s provided by `workspace` are:

- all
- apps
- packages
- root
- app `<name>`
- package `<name>`
- `<name>`

Though individual scripts may only support a subset of options, and will throw an error when an unsupported option is passed. Any args can be passed and will be used against each package in the options list.

```shell
# Example: lint & build all apps
# and pass the `jsx-a11y-plugin` flag to `oxclint`

pnpm lint apps --jsx-a11y-plugin && pnpm build apps
```

Package names can be passed with or without the workspace prefix. `pnpm release @instructure.ai/aiinfo` is the same as `pnpm release aiinfo`.

### Base Configurations

Configuration files are provided and where possible use inheritance. There are also some devex hints provided.

#### Dev Experience

- Recommended vscode plugins will be prompted when this repo is opened `./vscode/extensions.json`
- VScode project settings for things like lint-on-save `./vscode/settings.json`
- Github copilot instructions when using an [instui](https://instructure.design/) package `./template/instui/.github/copilot-instructions.md`

#### Vite

Vite is only used for Apps and uses shared configs to provide a baseline setup for each package. Settings can be overwritten using [mergeConfig](https://vite.dev/guide/api-javascript.html#mergeconfig).
`mergeConfig(baseconfig, {...opts})`

```shell
📁 /
    ├── 📄 vite.config.mts # Base config for apps
    ├── 📄 vite.config.react.mts # Merges ./vite.config.mts
    ├── 📂 apps/
    │   └── 📂 roadmap/
    │       └── vite.config.mts # Merges ./vite.config.react.mts (INSTUI)
    │   └── 📂 site/
    │       └── vite.config.mts # Merges ./vite.config.mts (Vanilla)
    └── 📂 /packages
        └── 📂 aiinfo/
            └── ❌ # Packages do not use Vite (ESM)
```

#### Typescript

> [!NOTE]
> This project uses [TypeScript 7](https://www.npmjs.com/package/typescript), including its native compiler, through `tsc`.

Typescript uses shared configs to provide a baseline setup for each package. Settings can be overwritten by re-declaring them in the package's `tsconfig.json`. See [tsconfig extends](https://www.typescriptlang.org/tsconfig/#extends).

```shell
📁 /
    ├── 📄 tsconfig.json # Base config for apps
    ├── 📄 tsconfig.node.json # Extends ./tsconfig.json
    ├── 📂 apps/
    │   └── 📂 roadmap/
    │       └── tsconfig.json # Extends ./tsconfig.node.json (INSTUI)
    │   └── 📂 site/
    │       └── tsconfig.json # Extends ./tsconfig.json (Vanilla)
    └── 📂 /packages
        └── 📂 aiinfo/
            └── tsconfig.json # Extends ./tsconfig.json (ESM)
```

#### TSDown

tsdown is used for type-aware rolldown builds of ESM modules. It is not used for apps. tsdown does not currently provide a merge/extend functionality in its config so a fresh copy is created for each package.

```shell
📁 /
    ├── 📂 .template/
    │   └── 📂 esm/
    │       └── tsdown.config.mts # Base config for packages (ESM)
    ├── 📂 apps/
    │   └── 📂 site/
    │       └── ❌ # Apps do not use tsdown
    └── 📂 /packages
        └── 📂 aiinfo/
            └── tsdown.config.mts # Copies ./.template/esm/tsdown.config.mts (ESM)
```

#### Vitest

Vitest uses shared configs to provide a baseline setup for each package. Settings can be overwritten using [mergeConfig](https://vitest.dev/config/).
`mergeConfig(baseconfig, {...opts})`

```shell
📁 /
    ├── 📄 vitest.config.shared.mts # Base config
    ├── 📄 vitest.config.mts # Merges ./vitest.config.shared.mts (workspace root config)
    ├── 📂 apps/
    │   └── 📂 roadmap/
    │       └── vitest.config.mts # Merges ./vitest.config.shared.mts
    └── 📂 /packages
        └── 📂 aiinfo/
            └── vite.config.mts # Merges ./vitest.config.shared.mts
```

Vitest uses istanbul to provide coverage for non-v8 (hi firefox 👋) testing. A custom reporter is included that outputs basic rollup stats in `./coverage/coverage.yml`.

#### OxC

OxC is configured to use a root config, each package's config is an extended copy from its template folder.

```shell
📁 /
    ├── 📄 .oxfmtrc.jsonc # Base formatter config
    ├── 📄 .oxlintrc.json # Base lint config
    └── 📂 /apps
    │   └── 📂 roadmap/
    │       └── .oxfmtrc.jsonc # Extends ./.oxfmtrc.jsonc
    │       └── .oxlintrc.json # Extends ./.oxlintrc.json
    └── 📂 /packages
        └── 📂 aiinfo/
    │       └── .oxfmtrc.jsonc # Extends ./.oxfmtrc.jsonc
    │       └── .oxlintrc.json # Extends ./.oxlintrc.json
```

#### Package.json

The root workspace package.json defines workspace exports and shares workspace `devDependencies`.

```shell
📁 /
    ├── 📄 package.json # Base config (workspace root config)
    └── 📂 /apps
    │   └── 📂 roadmap/
    │       └── package.json # Imports ./package.json exports
    └── 📂 /packages
        └── 📂 aiinfo/
            └── package.json # Imports ./package.json exports
```

##### devDependencies

The following `devDependencies` are provided. No `dependencies` are included.

```json
  "devDependencies": {
    "@instructure/browserslist-config-instui": "latest",
    "@testing-library/react": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "typescript": "^7.0.2",
    "@vitejs/plugin-react": "latest",
    "@vitest/coverage-istanbul": "latest",
    "@vitest/coverage-v8": "latest",
    "babel-plugin-react-compiler": "latest",
    "browserslist": "latest",
    "istanbul-lib-report": "latest",
    "istanbul-reports": "latest",
    "jsdom": "latest",
    "lightningcss": "latest",
    "oxfmt": "latest",
    "oxlint": "latest",
    "oxlint-tsgolint": "latest",
    "react-compiler-runtime": "latest",
    "vite": "^8.3.4",
    "vite-node": "latest",
    "vitest": "latest",
    "yaml": "latest"
  },
```

In workspace packages they are imported with:

```json
  "devDependencies": {
    "@instructure.ai/shared-configs": "workspace:^"
  }
```

This import is included in the template when using the workspace script `new`.

## Contributing

This repo uses github rules to protect the `main` branch. Requirements:

- Must be a PR
- Must be a squash merge
- Branch name must start with a valid App or Package path or `shared-configs` followed by branch purpose

### Valid

- shared-configs/refactorTypes
- apps/site/simplify
- packages/widget/create

### Invalid

- site/simplify
- widget/create
- refactorWidget

In general, try to only touch files in the app or package your PR is associated with. Don't add a dependency to the root `./package.json` when it will only be used by your package. Don't update root configs, etc. If there's a rationale for changing a root setup which will affect multiple packages, then each package needs to be released in your PR.
