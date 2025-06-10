import { defineConfig } from "vite";
import { unplugin } from "../dist/index";

export default defineConfig({
  plugins: [
    unplugin.vite({
      include: [".ts", ".tsx"],
      exclude: ["node_modules"],
    }),
  ],
  build: {
    target: "es2020",
    lib: {
      entry: "src/schemas.ts",
      name: "schemas",
      formats: ["es", "cjs"],
      fileName: (format) => `schemas.${format === "es" ? "mjs" : "js"}`,
    },
    rollupOptions: {
      external: ["zod", "zod/v4"],
      output: {
        globals: {
          zod: "z",
          "zod/v4": "z",
        },
      },
    },
  },
});
