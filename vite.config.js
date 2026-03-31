import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.webp"],
      manifest: {
        name: "CriptoGraph",
        short_name: "CriptoGraph",
        description: "Dashboard de monitoramento de criptomoedas",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/logo.webp",
            sizes: "192x192",
            type: "image/webp",
          },
          {
            src: "/logo.webp",
            sizes: "512x512",
            type: "image/webp",
          },
        ],
      },
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setupTests.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      thresholds: {
        lines: 60,
        branches: 55,
        functions: 40,
        statements: 60,
      },
    },
  },
});


