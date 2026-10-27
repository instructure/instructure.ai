# <<packagename>>

Use the workspace's pinned Node 26 and pnpm versions.

```sh
pnpm exec vp run <<packagename>>#typecheck
pnpm exec vp run <<packagename>>#test
pnpm exec vp run <<packagename>>#build
```

`vp pack` builds ESM/CommonJS artifacts and declarations. The build then uses
`pnpm pack` to create the release tarball in `src/`.
