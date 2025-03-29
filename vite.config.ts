// import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  worker: {
    format: "es", // Ensure workers are built as ES modules,
    rollupOptions: {
      output: {
        generatedCode: "es2015",
      },
    },
  },
  // server: { fs: { allow: ["./triplit"] } },
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },
  build: {
    target: "es2022", // Ensure modern JS features are supported
    rollupOptions: {
      output: {
        inlineDynamicImports: true, // Enable dynamic imports for better chunking
      },
    },
  },
});
