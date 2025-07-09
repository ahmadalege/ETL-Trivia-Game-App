// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        // <--- Intercepts any path starting with /api
        target: "http://backend_service:8000", // <-- Your backend service URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // <-- Removes the /api prefix
      },
    },
  },
});
