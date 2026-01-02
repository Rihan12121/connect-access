import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import vitePrerender from "vite-plugin-prerender";

// Routes to pre-render for SEO
const prerenderRoutes = [
  "/",
  "/products",
  "/categories",
  "/category/baby",
  "/category/beauty",
  "/category/electronics",
  "/category/fashion",
  "/category/home",
  "/category/sports",
  "/faq",
  "/contact",
  "/about",
  "/shipping",
  "/returns",
  "/imprint",
  "/privacy",
  "/terms",
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" &&
      vitePrerender({
        staticDir: path.resolve(__dirname, "dist"),
        routes: prerenderRoutes,
        renderer: {
          renderAfterTime: 500,
        },
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
