---
name: update-aiinfo
description: 'Refresh aiinfo from the upstream Google Sheet, cut a package release, open and merge its PR, verify npm publication, and invoke update-nutrition-facts to deploy the site. Use when asked to update aiinfo, refresh its source data, or run the package and nutritionfacts release workflow.'
---

# Update AiInfo

Run from the repository root. Complete the package release before handing off to
the [update-nutrition-facts skill](../update-nutrition-facts/SKILL.md).

## Safety And Prerequisites

- Read applicable repository instructions. Use the existing pnpm tooling.
- Check `git status --short --branch` before switching branches or editing.
  Preserve unrelated work; do not stash, reset, or commit it. If it prevents a
  safe switch to main, ask the user how to proceed.
- Verify GitHub CLI access with `gh auth status`. Never print credentials.
- Use `GH_PAGER=cat PAGER=cat` for GitHub CLI commands. Use single-quoted PR bodies
  so Markdown backticks cannot execute shell commands.
- A request to run this release workflow includes its PR merge and publication,
  unless the user limits it to preparation or review. Respect that limit and
  required reviews, protections, and environment approvals; never bypass them.

## 1. Update Main And Create A Branch

1. Run `git switch main`, then `git pull --ff-only origin main`. If fast-forward
   fails, stop and resolve with the user; do not reset local commits.
2. Read `packages/aiinfo/package.json` and query
   `npm view @instructure.ai/aiinfo version --registry=https://registry.npmjs.org`.
   Inspect any version mismatch, existing release PRs, tags, and workflow runs.
   Do not reuse a published version or assume main's version has been published.
3. Create a unique branch such as `packages/aiinfo/release-YYYY-MM-DD` from the
   updated main. Use a suffix if that branch already exists.

## 2. Refresh And Validate The Feed

1. Run `UPDATE=1 CI=1 pnpm -F aiinfo cache:update`. Both flags matter: without
   `UPDATE` the script does not invoke its main routine; `CI` makes an unchanged
   cache a successful result.
2. Verify a successful live fetch, not the updater's fallback to cached CSV after
   a network error. Inspect the cache, checksums, changelog, generated modules,
   and exports. Preserve upstream CSV text rather than manually rewriting it.
3. Compare feature IDs using Papa Parse against the pre-refresh CSV from Git.
   Check for removals: generation can leave stale component folders/exports.
   Reconcile actual removals before releasing; do not delete unrelated entries.
4. If there are no upstream differences, report that. Continue a specifically
   requested version-only release, but do not manufacture a data changelog.
5. After generation, run the focused updater tests first:
   `pnpm -F aiinfo exec vitest run scripts/updateCache.test.ts --pool=threads --maxWorkers=1 --testTimeout=60000`.
6. Run the full aiinfo suite with
   `pnpm -F aiinfo exec vitest run --pool=threads --maxWorkers=1 --testTimeout=60000`,
   then `UPDATE=1 CI=1 pnpm build package aiinfo`.
   Run `pnpm test app nutritionfacts` and `pnpm build app nutritionfacts` against
   the refreshed workspace data. Report failures and do not bypass release gates.

## 3. Version And Open The PR

1. Review `git diff`, `git diff --check`, and worktree status. Build/lint commands
   may modify generated files. Stage only intended aiinfo cache, changelog,
   generated modules/exports, and built outputs; never stage an entire dirty tree.
2. Commit those paths with an explicit pathspec, then check the index is empty
   before `pnpm release package aiinfo`. This command bumps the patch version and
   commits the manifest, but commits everything staged; it does not publish npm.
   Use `--version=X.Y.Z` only when the user requests a specific valid version.
3. Push the branch and open a PR targeting main. Include the actual changes,
   target version, validation results, and any known pre-existing failures.
4. Wait for checks and required reviews. Use bounded, non-interactive status
   queries or supported completion notifications, not tight polling loops or
   interactive terminal watchers. Merge with `gh pr merge <PR> --squash` only
   once the applicable gates pass. If blocked by approval or failed checks,
   report the exact blocker rather than claiming completion.

## 4. Verify Release And Hand Off

1. Record the merge SHA. Track the corresponding `Tag on Merge` and
   `Release Packages` runs, not an older successful run. Confirm the tag is
   `@instructure.ai/aiinfo@<version>` and points to the intended release commit.
2. If the main push did not trigger tag automation (for example after an
   Actions-token merge), inspect `.github/workflows/tag-on-merge.yml` and dispatch
   `gh workflow run tag-on-merge.yml --ref main` only after confirming main is
   still the intended commit. Avoid duplicate runs. `release-package.yml` is
   chained from that workflow and has no manual dispatch of its own.
3. Inspect publish logs and the GitHub release. Workflow success alone is not
   proof of npm publication: steps can skip. Verify the exact version with
   `npm view @instructure.ai/aiinfo@<version> version --registry=https://registry.npmjs.org`.
   Allow for registry propagation; never republish or bump again just because
   a newly accepted version briefly returns 404.
4. After publication is verified, switch to main and run
   `git pull --ff-only origin main`, preserving unrelated work.
5. Read and execute the linked `update-nutrition-facts` skill in this same task.
   Pass the verified aiinfo version and merge SHA, validation results, and any
   downstream sync workflow/PR already created by the release dispatch.
   Do not stop at an npm release when the requested site update remains undone.