import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    deps: {
      moduleDirectories: ["node_modules", "./node_modules"],
    },
    globals: true,
  },
  resolve: {
    alias: {
      components: "./src/components",
      utils: "./src/utils",
      styles: "./src/styles",
    },
  },
  dedupe: ["react", "react-dom"]
});
