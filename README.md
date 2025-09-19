> [!WARNING]
> Commits to `main` trigger builds & deploys to [instructure.ai](https://instructure.ai/). Use pull requests to update packages.

# instructure.ai

This is a monorepo of pages or micro-sites that are served on [instructure.ai](https://instructure.ai)

Cconfigs and dev dependencies are shared from the root package `@instructure.ai/shared-configs` and extended in workspace packages in `/packages`.

Helper utilities are provided for adding and managing packages.

```shell
pnpm new <packagename> [--template (default: vanilla | react)]
```

Will instantiate a new vanillajs or react project with all configurations set up under `./packages/<packagename>`

pnpm scripts allow specifying a package name, or omitting it (if available) to recursively execute.

```shell
pnpm build [<packagename>]
pnpm dev <packagename>
pnpm preview <packagename>
```

What comes out of the box?

* vite (vanilla-ts, react-ts)
* vite-node
* vitest
* biomejs
* typescript-native
* dotenvx
* github publishing
* vscode settings
* shared public assets