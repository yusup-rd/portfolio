// @vitest-environment node
import { describe, expect, it } from "vitest";
import { projects } from "../../src/data/constants";
import { render, structuredData } from "../../src/entry-server";

describe("build-time rendering", () => {
    it("renders primary content and the complete project collection without browser APIs", () => {
        // A Node environment catches accidental window/document access during SSR.
        const html = render();
        expect(html).toContain("Thoughtful interfaces.");
        expect(html).toContain("Universiti Tenaga Nasional");
        expect(html).toContain("/docs/university/uniten-bachelor-degree.jpg");
        for (const project of projects) expect(html).toContain(project.title);
        expect(structuredData["@graph"]).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "@type": "ProfilePage",
                    url: "https://yusuprd.com/",
                }),
            ]),
        );
    });

    it("keeps the unpositioned folder hidden in HTML before hydration", () => {
        // Regression: a visible server-rendered folder flashed blue before its intro.
        const root = render().match(/<div[^>]*data-mode="flap"[^>]*>/)?.[0];
        expect(root).toBeDefined();
        expect(root).toMatch(/opacity:0(?:;|")/);
    });
});
