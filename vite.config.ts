import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Routes to pre-render for SEO (static pages only)
const includedRoutes = [
  "/",
  "/products",
  "/categories",
  "/faq",
  "/shipping",
  "/returns",
  "/contact",
  "/imprint",
  "/privacy",
  "/terms",
  "/about",
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssgOptions: {
    includedRoutes: () => includedRoutes,
    dirStyle: "nested",
    formatting: "minify",
  },
}));
