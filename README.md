> [!WARNING]
> Commits to `main` trigger builds & deploys to [instructure.ai](https://instructure.ai/). Use pull requests to update packages.

# instructure.ai

This is a monorepo of apps and packages. Apps are served on [instructure.ai](https://instructure.ai)

Cconfigs and dev dependencies are shared from the root package `@instructure.ai/shared-configs` and extended in workspace packages in `apps` and `/packages`.

Helper utilities are provided for adding and managing packages.

```shell
pnpm new <packagename> [--template (default: vanilla | react | instui)] [--type (default: app | package)]
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
* vitest
* biomejs
* typescript-native
* dotenvx
* github publishing
* vscode settings
* shared public assets
* github copilot instructions