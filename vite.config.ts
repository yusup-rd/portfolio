import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const require = createRequire(import.meta.url);

export default defineConfig({
    test: {
        environment: "jsdom",
        include: ["tests/**/*.test.{ts,tsx}"],
        setupFiles: ["./tests/setup.ts"],
        clearMocks: true,
        restoreMocks: true,
        unstubEnvs: true,
        unstubGlobals: true,
    },
    define: { __BUILD_YEAR__: new Date().getFullYear() },
    plugins: [react(), tailwindcss()],
    worker: {
        format: "es",
        plugins: () => [
            {
                name: "pdf-worker-exports",
                // PDF.js imports the entry when a browser cannot start a worker.
                options: (options) => ({
                    ...options,
                    preserveEntrySignatures: "strict",
                }),
            },
        ],
    },
    resolve: {
        alias: [
            {
                find: "@",
                replacement: fileURLToPath(new URL("./src", import.meta.url)),
            },
            {
                find: /^pdfjs-dist$/,
                replacement: require.resolve("pdfjs-dist/legacy/build/pdf.mjs"),
            },
        ],
    },
});
