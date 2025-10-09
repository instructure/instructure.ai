import baseConfig from "@instructure.ai/shared-configs/react";
import { defineConfig, mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      tsconfigPaths(),
dts({
  tsconfigPath: "./tsconfig.types.json",
  rollupTypes: true,
  insertTypesEntry: true,
  entryRoot: "src",
  outDir: "dist",
  exclude: [
    "**/*.test.*",
    "**/__tests__/**",
    "scripts/**",
    "utils/**",
    "dist/**",
    "**/*.config.*",
    "vite.config.*",
  ],
}),
    ],
    build: {
      lib: {
        entry: "src/index.ts",
        name: "AiInfo",
        formats: ["es"],
        fileName: () => "index.mjs",
      },
      rollupOptions: {
        external: [/^react($|\/)/, /^react-dom($|\/)/, /^@instructure\/ui-/],
        output: { exports: "named" },
      },
      outDir: "dist",
      target: "esnext",
      sourcemap: false,
      emptyOutDir: true,
    terserOptions: {
      compress: {
        ecma: 2020,
        module: true,
        passes: 2,
        pure_getters: true,
        unsafe_arrows: true,
        unsafe_methods: true,
        toplevel: true,
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
      mangle: {
        toplevel: true,
      },
    }
    },
  })
);
