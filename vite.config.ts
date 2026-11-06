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
              include: ["src/components/**", "src/hooks/**", "src/runtime/**", "src/types/**", "src/index.ts"],
              exclude: ["**/*.test.ts", "**/*.test.tsx", "**/*.stories.tsx"],
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
            // preserveModules: one output file per source module, so bundlers can
            // tree-shake unused components (entryName is the module path, e.g. "components/Mandala/Mandala").
            fileName: (format, entryName) => `${entryName}.${format === "es" ? "es" : "cjs"}.js`,
          },
          outDir: "lib",
          copyPublicDir: false,
          rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime"],
            output: {
              preserveModules: true,
              preserveModulesRoot: "src",
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
