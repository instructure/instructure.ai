# Project Overview

## Technologies Used

This project is a monorepo with shared configs exported from the root package.json. It is built using modern technologies and follows best practices for accessibility, performance, and maintainability. The workspace root package (`@instructure.ai/shared-configs`) provides orchestration for the monorepo and handles creating packages.  Each package in ./packages or ./apps and ./ (root package) should be treated in isolation. The project is set up with [Vite](https://vite.dev/guide/) for fast development and build times, [Biome](https://biomejs.dev/guides/getting-started/) for code quality and formatting, and [Vitest](https://vitest.dev/guide/) for testing. Do not try to install alternative versions of packages such as es-lint, prettier, or jest. Use the tools provided by the shared-configs package.

## Coding Standards

You should use the provided script and utilities from the root package to build your application. Prefer vite-node over node, shell/bash or other libraries. ESM is the preferred module type and cjs is not necessary. Follow the coding standards and best practices outlined in the documentation to ensure consistency and maintainability. Prefer functional components and hooks over class components. Use TypeScript for type safety and improved developer experience. Prefer built-ins over recommending new dependencies. Ensure your code is well-documented and includes comments where necessary. Always write tests.