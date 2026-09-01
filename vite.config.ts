import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "robots.txt"],
      manifest: {
        name: "Food Tracker",
        short_name: "Food Tracker",
        description: "Офлайн трекер калорий и БЖУ",
        theme_color: "#000000", // укажите ваш основной цвет
        icons: [
          {
            src: "adnroidIcon.svg",
            sizes: "192x192 512x512", // Браузер сам масштабирует SVG под нужный размер
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "adnroidIcon.svg",
            sizes: "192x192 512x512",
            type: "image/svg+xml",
            purpose: "maskable", // Позволит Android красиво скруглять иконку
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
      },
    }),
  ],
});
