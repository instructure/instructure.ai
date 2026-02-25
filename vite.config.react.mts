import { defineConfig, mergeConfig } from "vite";
import baseConfig from "./vite.config.mts";
import react from "@vitejs/plugin-react";

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler", { target: "19" }]],
        },
      }),
    ],
  }),
);
