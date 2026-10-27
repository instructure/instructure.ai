---
name: update-nutrition-facts
description: "Update the nutritionfacts site to a published aiinfo version, create or reuse its release branch and PR, merge after validation, and verify GitHub Pages deployment. Use when asked to update or publish nutritionfacts, sync its aiinfo dependency, or complete the update-aiinfo release handoff."
---

# Update Nutrition Facts

Run from the repository root. Accept a verified published aiinfo version from
`update-aiinfo`, or determine the intended published version before editing.
This app is private: publishing means deploying GitHub Pages, not npm publishing.

## Safety And Prerequisites

- Read applicable repository and app instructions, and inspect current file
  contents before editing. Preserve unrelated work and never reset or stash it.
- Use the repository's pnpm scripts. Verify GitHub CLI access, and use
  `GH_PAGER=cat PAGER=cat` with non-interactive commands and single-quoted PR bodies.
- Honor any user restriction to PR preparation only. Otherwise carry the
  requested app update through merge and deployment, respecting required reviews,
  protections, and environment approvals. Never bypass a gate.

## 1. Update Main And Select The Release Branch

1. Check `git status --short --branch`. If unrelated changes prevent a safe
   branch switch, ask the user rather than overwriting them.
2. Run `git switch main` and `git pull --ff-only origin main`. Stop on divergence;
   do not reset local commits. Read the current app and aiinfo manifests.
3. Verify the target version exists with
   `npm view @instructure.ai/aiinfo@<version> version --registry=https://registry.npmjs.org`.
   Without a handoff version, query npm latest and compare it with main and the
   current app dependency. Do not select an unpublished version from main alone.
4. Check `.github/workflows/nutritionfacts-auto-release.yml` runs and open/recent
   PRs for this release. The upstream dispatch may already have created a branch
   and bumped the app version. Reuse that PR instead of making a duplicate.
   If it has merged, inspect main and deployment before doing more work.
5. For an open automated PR, inspect its diff and disable auto-merge with
   `gh pr merge <PR> --disable-auto` before corrections. Fetch and check out that
   release branch. Otherwise create a unique branch from updated main, such as
   `apps/nutritionfacts/aiinfo-<version>`. Keep branch names policy-compliant;
   do not rename a remote PR head because GitHub may close the PR.

## 2. Update The Dependency And Validate

1. Read `apps/nutritionfacts/package.json` on the selected branch. Set its
   `@instructure.ai/aiinfo` dependency to `^<verified-version>`, following the
   existing app convention. This is a caret range, not an exact version pin.
2. Do not rely solely on `pnpm -F nutritionfacts add ...`: it has rewritten the
   dependency to `workspace:^` in this repository. Correct that rewrite explicitly
   in the manifest, then run `pnpm install --lockfile-only --ignore-scripts`.
3. Immediately check the lockfile importer matches the requested specifier.
   A remaining `link:../../packages/aiinfo` resolution is normal for this monorepo;
   confirm the linked package version matches the intended release. Do not claim
   registry-tarball validation when testing the workspace link.
4. Run `pnpm exec vp run @instructure.ai/nutritionfacts#test` and `pnpm exec vp run @instructure.ai/nutritionfacts#build`.
   Run `pnpm -F nutritionfacts typecheck` and distinguish newly introduced
   failures from pre-existing test typing errors. Report existing issues rather
   than fixing unrelated code or describing typecheck as passing.
5. Review the diff and `git diff --check`. Keep the dependency update scoped to
   the app manifest and lockfile. Do not introduce unrelated dependency upgrades.

## 3. Version, Push, And Merge

1. If the automated branch already bumped the app version, keep that bump; do
   not increment it twice. Otherwise commit the dependency/lockfile changes with
   explicit paths, check the index is empty, then run
   `pnpm exec vp run @instructure.ai/nutritionfacts#release` for the standard patch bump.
   That command creates a commit containing everything staged, so never run it
   over unrelated staged work.
2. Commit any automated-PR corrections with explicit app/lockfile pathspecs and
   push the branch. Open a PR targeting main if one does not already exist.
   Include the aiinfo target, app version, test/build/typecheck results, and known
   pre-existing failures in the PR description.
3. Verify the final PR diff contains the intended dependency range and app bump.
   Wait for CI/security checks and required reviews. Use bounded status queries
   or supported completion notifications, not tight polling or interactive
   terminal watchers. Do not bypass failed checks or missing approvals.
4. Merge with `gh pr merge <PR> --squash` after gates pass. If an approval blocks
   progress, give the PR link and exact blocker; do not mark deployment complete.

## 4. Verify The Published Site

1. Record the merge SHA and follow its `Deploy Apps` run in
   `.github/workflows/deploy-apps.yml`. Confirm build, upload, and the actual
   `Deploy to GitHub Pages` step succeed; a successful skipped workflow is not
   a deployment. The change filter allows deployment for pushes affecting `apps/`,
   `packages/`, or shared build inputs; manual dispatch bypasses this filter.
2. If an Actions-token merge did not trigger deployment, inspect the current
   workflow and dispatch `gh workflow run deploy-apps.yml --ref main` after
   confirming main is still the expected commit. Check the app-change detection
   did not skip the manual run. Avoid launching a duplicate active deploy.
3. Verify the deployed nutritionfacts URL from the deployment result and check
   that the changed feature data is present in the served app/bundle. If it is
   stale, distinguish CDN propagation from a skipped or incorrect build.
4. Switch to main and `git pull --ff-only origin main` when safe. Confirm the
   package/app versions and worktree state. Report the published aiinfo version,
   app version, merged PR, deployment URL/result, and any unresolved limitation.
