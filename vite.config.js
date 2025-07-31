import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import compression from "vite-plugin-compression";
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";
export default defineConfig({
  build: {
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("/src/components/")) {
            return "components";
          }
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
    obfuscatorPlugin({
      options: {
        debugProtection: false,
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 3003,
    strictPort: true,
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    proxy: {
      "/api": {
        target: "https://api.meetowner.in",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    hmr: {
      host: "meetowner.in",
    },
  },
});
