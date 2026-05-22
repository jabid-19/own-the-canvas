import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
/// <reference types="vitest" />

export default defineConfig(({ mode }) => {
  const isLib = mode === "lib";

  return {
    plugins: [
      react(),
      ...(isLib
        ? [
            dts({
              include: ["src/components/**", "src/hooks/**", "src/types/**", "src/index.ts"],
              outDir: "lib",
              insertTypesEntry: true,
            }),
          ]
        : []),
    ],
    build: isLib
      ? {
          lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "OwnTheCanvas",
            formats: ["es", "cjs"],
            fileName: (format) => `index.${format === "es" ? "es" : "cjs"}.js`,
          },
          outDir: "lib",
          copyPublicDir: false,
          rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime"],
            output: {
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
              },
            },
          },
        }
      : {},
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/docs/test-setup.ts"],
    },
  };
});
