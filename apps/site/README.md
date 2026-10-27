# instructure.ai

This site is live at [instructure.ai](https://instructure.ai).

## Setup

1. `git clone git@github.com:instructure/instructure.ai.git`
2. `cd instructure.ai`
3. `pnpm i`
4. `pnpm exec vp -C apps/site dev` (using the pinned Node 26 runtime)

## Deploy

The [Deploy Apps](https://github.com/instructure/instructure.ai/actions/workflows/deploy-apps.yml) workflow triggers on push to `main`. It also has a `workflow_dispatch` event trigger so it can be manually run.

The workflow builds the static site and deploys the root `dist` folder to GitHub Pages. Run `pnpm exec vp run build:apps`, then `pnpm exec vp -C apps/site preview` from the workspace root to inspect a local build before pushing.
