import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";
import { defineConfig } from "vite";

const require = createRequire(import.meta.url);

export default defineConfig({
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
                find: /^pdfjs-dist$/,
                replacement: require.resolve("pdfjs-dist/legacy/build/pdf.mjs"),
            },
        ],
    },
});
