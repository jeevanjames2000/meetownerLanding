import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3003,
    strictPort: true,
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    base: "/",
    hmr: {
      host: "preprod.meetowner.in", // Optional, for Hot Module Replacement
    },
    // allowedHosts: ["preprod.meetowner.in"], // Remove this or make it more permissive if needed
  },
});
