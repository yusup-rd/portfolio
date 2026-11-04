import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

await build();
// Run the same React tree in Node at build time. Only dist is deployed; no
// production Node server or browser-only renderer is needed for indexing.
const serverDirectory = "node_modules/.tmp/portfolio-ssr";
await build({
    build: {
        ssr: "src/entry-server.tsx",
        outDir: serverDirectory,
        copyPublicDir: false,
    },
});
const { render, structuredData } = (await import(
    pathToFileURL(resolve(serverDirectory, "entry-server.js")).href
)) as {
    render: () => string;
    structuredData: object;
};
const template = await readFile("dist/index.html", "utf8");
if (
    !template.includes("<!--app-html-->") ||
    !template.includes("<!--structured-data-->")
) {
    throw new Error("The HTML template is missing its prerender placeholders.");
}
const schema = JSON.stringify(structuredData).replaceAll("<", "\\u003c");
let html = template
    .replace("<!--app-html-->", () => render())
    .replace(
        "<!--structured-data-->",
        () => `<script type="application/ld+json">${schema}</script>`,
    );
// Netlify previews must not compete with the production URL in search.
if (process.env.CONTEXT && process.env.CONTEXT !== "production") {
    html = html.replace(
        'content="index, follow, max-image-preview:large"',
        'content="noindex, follow"',
    );
}
await writeFile("dist/index.html", html);
console.log(
    "Prerendered portfolio content and structured data into dist/index.html.",
);
