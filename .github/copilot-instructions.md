# Project Overview

## Technologies Used

This project is a pnpm monorepo with shared configs exported from the root package.json. Use the pinned Node 26 development runtime and pnpm package manager. Vite+ provides builds, tests, formatting, lint, task orchestration, and `vp create` scaffolding. Keep each root/app/package configuration scoped appropriately. Published aiinfo artifacts must remain compatible with Node >=20.0.0. Do not install alternative standalone linters, formatters, or test runners.

## Coding Standards

Use `pnpm exec vp check`, `pnpm exec vp run typecheck:all`, and `pnpm exec vp run test:all` for blocking validation. Use `pnpm exec vp run build:apps` for the deployed site and `pnpm exec vp run @instructure.ai/aiinfo#build:lib` for an offline library build. Prefer native Vite+ tasks and filtering over custom workspace dispatch scripts; use bundled `vpx` for TypeScript maintenance scripts. Prefer ESM, functional components, hooks, and TypeScript. aiinfo intentionally emits both ESM and CommonJS for consumers. Preserve explicit errors, add tests, and comment only non-obvious logic.
