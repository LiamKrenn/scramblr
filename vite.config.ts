// import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  // server: { fs: { allow: ["./triplit"] } },
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },
});
