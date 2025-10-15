> [!WARNING]
> Commits to `main` trigger builds & deploys to [instructure.ai](https://instructure.ai/). Use pull requests to update packages.

# @instructure.ai/shared-configs

![Version](https://img.shields.io/github/package-json/version/instructure/instructure.ai?labelColor=%230E1721&color=%234279B6) ![NPM Builds](https://img.shields.io/github/actions/workflow/status/instructure/instructure.ai/release-package.yml?logo=npm&logoColor=%23CB3837&label=package%20builds&labelColor=%230E1721) ![Web Builds](https://img.shields.io/github/actions/workflow/status/instructure/instructure.ai/deploy-apps.yml?logo=javascript&logoColor=%23F7DF1E&label=web%20builds&labelColor=%230E1721) ![Code Coverage](https://img.shields.io/badge/dynamic/yaml?url=https%3A%2F%2Fraw.githubusercontent.com%2Finstructure%2Finstructure.ai%2Frefs%2Fheads%2Fmain%2Fcoverage%2Fcoverage.yml&query=coverage.total&logo=vitest&logoColor=%236E9F18&label=coverage&labelColor=%230E1721&color=%234279B6)


This is a monorepo of apps and packages. Apps are served on [instructure.ai](https://instructure.ai)

Configs and dev dependencies are shared from the root package `@instructure.ai/shared-configs` and extended in workspace packages in `/apps` and `/packages`.

Helper utilities are provided for adding and managing packages.

```shell
pnpm new <packagename> [--template (default: vanilla | react | instui | esm)]
```

Will instantiate a new vanillajs or react project with all configurations set up under `./<apps|packages>/<packagename>`

pnpm scripts allow specifying a package name, or omitting it (if available) to recursively execute. 

```shell
pnpm build [<packagename>]
pnpm dev <packagename>
pnpm preview <packagename>
pnpm lint [<packagename>]
```

The `workspace` script exposes various helpers to make managing multiple packages or apps easier. Options are:

* all
* packages
* apps
* root
* package <name>
* app <name>
* <name>

So you can run `pnpm lint apps && pnpm build apps` without touching `/packages` or the Workspace root.

What comes out of the box?

* vite (vanilla-ts, react-ts)
* vite-node
* vite-plugin-dts
* vitest
* biomejs
* typescript-native
* dotenvx
* github publishing
* vscode settings
* shared public assets
* github copilot instructions