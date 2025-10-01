# instructure.ai

This site is live at [instructure.ai](https://instructure.ai).

## Setup

1. `git clone git@github.com:instructure/instructure.ai.git`
2. `cd instructure.ai`
3. `pnpm i`
4. `pnpm dev`

## Deploy

The [Deploy static content to Pages](https://github.com/instructure/instructure.ai/actions/workflows/deploy-static.yml) workflow triggers on push to `main`.  It also has a `workflow_dispatch` event trigger so it can be manually run.

The workflow builds the static site and deploys the `dist` folder to Github Pages.  If you're concerned about rendering issues, you can build it locally with `pnpm build && pnpm preview` to view the static `dist` build before committing / pushing to remote.