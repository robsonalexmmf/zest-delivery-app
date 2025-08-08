import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const extraPlugins: any[] = [];

  // Carrega o plugin do Lovable somente em desenvolvimento e de forma dinâmica
  if (mode === "development") {
    try {
      const mod = await import("lovable-tagger");
      if (mod?.componentTagger) {
        extraPlugins.push(mod.componentTagger());
      }
    } catch (e) {
      // Ignora se o pacote não estiver disponível no ambiente
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            router: ["react-router-dom"],
            radix: ["@radix-ui/react-dialog", "@radix-ui/react-slot", "@radix-ui/react-tabs"],
          },
        },
      },
    },
    plugins: [react(), ...extraPlugins],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      __DEV__: mode === "development",
    },
  };
});
