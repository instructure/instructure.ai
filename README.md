# instructure.ai

This is a monorepo of apps and packages. Apps are served on the [instructure.ai](https://instructure.ai) website and packages are released to the [instructure.ai](https://www.npmjs.com/org/instructure.ai) NPM organization.

Configs and dev dependencies are shared from the root package `@instructure.ai/shared-configs` and extended in workspace packages in `/apps` and `/packages`.


## @instructure.ai/shared-configs

![Version](https://img.shields.io/github/package-json/version/instructure/instructure.ai?labelColor=%230E1721&color=%234279B6) ![NPM Builds](https://img.shields.io/github/actions/workflow/status/instructure/instructure.ai/release-package.yml?logo=npm&logoColor=%23CB3837&label=package%20builds&labelColor=%230E1721) ![Web Builds](https://img.shields.io/github/actions/workflow/status/instructure/instructure.ai/deploy-apps.yml?logo=javascript&logoColor=%23F7DF1E&label=web%20builds&labelColor=%230E1721) ![Code Coverage](https://img.shields.io/badge/dynamic/yaml?url=https%3A%2F%2Fraw.githubusercontent.com%2Finstructure%2Finstructure.ai%2Frefs%2Fheads%2Fmain%2Fcoverage%2Fcoverage.yml&query=coverage.total&logo=vitest&logoColor=%236E9F18&label=coverage&labelColor=%230E1721&color=%234279B6)

`@instructure.ai/shared-configs` is the root package of this monorepo and provides package templates, workspace utilities, and base configurations.

### Package Templates

Package templates are provided for apps and packages and can be instantiated with the Workspace script `new`.

```shell
pnpm new <packagename> [--template (default: vanilla | react | instui | esm)]
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

* all
* apps
* packages
* root
* app `<name>`
* package `<name>`
* `<name>`

Though individual scripts may only support a subset of options, and will throw an error when an unsupported option is passed. Any args can be passed and will be used against each package in the options list.

```shell
# lint & build apps
# passes the `write` flag to `biome check`

pnpm lint apps --write && pnpm build apps
```

Package names can be passed with or without the workspace prefix.  `pnpm release @instructure.ai/aiinfo` is the same as `pnpm release aiinfo`.

### Base Configurations

Configuration files are provided and where possible use inheritance. There are also some devex hints provided.

#### Dev Experience

* Recommended vscode plugins will be prompted when this repo is opened `./vscode/extensions.json`
* VScode project settings for things like lint-on-save `./vscode/settings.json`
* Github copilot instructions when using an [instui](https://instructure.design/) package `./template/instui/.github/copilot-instructions.md`

#### Vite

Vite uses shared configs to provide a baseline setup for each package.  Settings can be overwritten using [mergeConfig](https://vite.dev/guide/api-javascript.html#mergeconfig).
`mergeConfig(baseconfig, {...opts})`

```shell
📁 /
    ├── 📄 vite.config.mts # Base config for apps
    ├── 📄 vite.config.esm.mts # Base config for packages
    ├── 📄 vite.config.react.mts # Merges ./vite.config.mts
    ├── 📂 apps/
    │   └── 📂 roadmap/
    │       └── vite.config.mts # Merges ./vite.config.react.mts
    └── 📂 /packages
        └── 📂 aiinfo/
            └── vite.config.mts # Merges ./vite.config.esm
```
  
#### Typescript

> [!NOTE]
> This project uses the experimental [@typescript/native-preview](https://www.npmjs.com/package/@typescript/native-preview)

Typescript uses shared configs to provide a baseline setup for each package. Settings can be overwritten by re-declaring them in the package's `tsconfig.json`. See [tsconfig extends](https://www.typescriptlang.org/tsconfig/#extends).

```shell
📁 /
    ├── 📄 tsconfig.json # Base config for apps
    ├── 📄 tsconfig.node.json # Extends ./tsconfig.json
    ├── 📂 apps/
    │   └── 📂 roadmap/
    │       └── tsconfig.json # Extends ./tsconfig.node.json
    └── 📂 /packages
        └── 📂 aiinfo/
            └── tsconfig.json # Extends ./tsconfig.json
```

#### Vitest

Vitest uses shared configs to provide a baseline setup for each package.  Settings can be overwritten using [mergeConfig](https://vitest.dev/config/).
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

#### Biome

Biome is **not** configured to use a root config, each package's config is a standalone copy from its template folder.

```shell
📁 /
    ├── 📄 biome.jsonc # Copy of ./template/shared/biome.jsonc (workspace root config)
    ├── 📂 .template/
    │   └── 📂 shared/
    │       └── biome.jsonc # Base config
    └── 📂 /apps
    │   └── 📂 roadmap/
    │       └── biome.jsonc # Copy of ./template/shared/biome.jsonc
    └── 📂 /packages
        └── 📂 aiinfo/
            └── biome.jsonc # Copy of ./template/shared/biome.jsonc
```

#### Package.json

The root workspace package.json defines workspace exports and shares workspace `devDependencies`.

```shell
📁 /
    ├── 📄 package.json # Base config (workspace root config)
    └── 📂 /apps
    │   └── 📂 roadmap/
    │       └── package.json # Imports ./package.json
    └── 📂 /packages
        └── 📂 aiinfo/
            └── package.json # Imports ./package.json
```

##### devDependencies

The following `devDependencies` are provided.  No `dependencies` are included.

```json
"devDependencies": {
    "@biomejs/biome": "latest",
    "@instructure/browserslist-config-instui": "^11",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "@typescript/native-preview": "latest",
    "@vitejs/plugin-react": "latest",
    "@vitest/coverage-istanbul": "latest",
    "@vitest/coverage-v8": "latest",
    "babel-plugin-react-compiler": "latest",
    "browserslist": "latest",
    "istanbul-lib-report": "latest",
    "istanbul-reports": "latest",
    "lightningcss": "latest",
    "react-compiler-runtime": "^latest",
    "terser": "latest",
    "vite": "latest",
    "vite-node": "latest",
    "vite-plugin-dts": "latest",
    "vitest": "latest",
    "yaml": "latest"
  },
```

In workspace packages they are imported with:

```
  "devDependencies": {
    "@instructure.ai/shared-configs": "workspace:^"
  }
```

This import is included in the template when using the workspace script `new`.

## Contributing

This repo uses github rules to protect the `main` branch.  Requirements:

* Must be a PR
* Must be a squash merge
* Branch name must start with a valid package name (incl. `shared-configs`)
