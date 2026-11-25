// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function clientManualChunks(id: string): string | undefined {
  const normalized = id.replace(/\\/g, "/");

  if (
    normalized.includes("/node_modules/react/") ||
    normalized.includes("/node_modules/react-dom/") ||
    normalized.includes("/node_modules/scheduler/") ||
    normalized.includes("/node_modules/@tanstack/react-router/")
  ) {
    return "vendor-react";
  }

  if (
    normalized.includes("/node_modules/three/") ||
    normalized.includes("/node_modules/@react-three/") ||
    normalized.includes("/node_modules/gsap/")
  ) {
    return "vendor-three";
  }

  if (
    normalized.includes("/node_modules/@radix-ui/") ||
    normalized.includes("/node_modules/lucide-react/") ||
    normalized.includes("/node_modules/framer-motion/")
  ) {
    return "vendor-ui";
  }

  if (
    normalized.includes("/src/data/smartFinderCatalogue.ts") ||
    normalized.includes("/src/data/brands.ts") ||
    normalized.includes("/src/data/repairServicesSiloData.ts")
  ) {
    return "data-catalog";
  }

  return undefined;
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    // Prevent Nitro from treating root index.html as a static template and bypassing TanStack Start SSR
    renderer: false as any,
  } as any,
  vite: {
    plugins: [],
    resolve: {
      alias: {
        "react-use-measure": path.resolve(__dirname, "node_modules/react-use-measure/dist/index.js"),
      },
    },
    environments: {
      client: {
        build: {
          rollupOptions: {
            output: {
              manualChunks: clientManualChunks,
            },
          },
        },
      },
    },
  },
});
