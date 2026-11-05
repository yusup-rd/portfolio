import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import template from "../../index.html?raw";
import { mockMedia } from "../helpers/media";

const darkQuery = "(prefers-color-scheme: dark)";
const palette = document.createElement("style");
// jsdom does not load the app's Tailwind stylesheet.
palette.textContent = `
    :root { --page: #fafaf7; }
    :root[data-theme="dark"] { --page: #0d0e11; }
`;

const expectBrowserTheme = (theme: "light" | "dark") => {
    expect(document.documentElement).toHaveAttribute("data-theme", theme);
    expect(document.documentElement.style.colorScheme).toBe(theme);
    expect(document.querySelector('meta[name="color-scheme"]')).toHaveAttribute(
        "content",
        theme,
    );
    const colors = document.querySelectorAll('meta[name="theme-color"]');
    expect(colors).toHaveLength(1);
    expect(colors[0]).not.toHaveAttribute("media");
    expect(colors[0]).toHaveAttribute(
        "content",
        theme === "dark" ? "#0d0e11" : "#fafaf7",
    );
};

beforeEach(() => {
    vi.resetModules();
    // Use the shipped metadata so stale OS media queries cannot slip through.
    const head = new DOMParser().parseFromString(template, "text/html").head;
    document.head.append(
        palette,
        ...head.querySelectorAll(
            'meta[name="theme-color"], meta[name="color-scheme"]',
        ),
    );
});

afterEach(() => {
    palette.remove();
    document.head
        .querySelectorAll('meta[name="theme-color"], meta[name="color-scheme"]')
        .forEach((meta) => meta.remove());
});

describe("theme preference", () => {
    it("follows live OS changes until the visitor explicitly chooses", async () => {
        const setMedia = mockMedia();
        const { useTheme } = await import("../../src/hooks/useTheme");
        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe("light");
        expectBrowserTheme("light");
        act(() => setMedia(darkQuery, true));
        expect(result.current.theme).toBe("dark");
        expectBrowserTheme("dark");
        expect(document.documentElement).toHaveAttribute("data-theme", "dark");
        act(() => result.current.toggleTheme());
        expect(localStorage.getItem("portfolio-theme")).toBe("light");
        act(() => {
            setMedia(darkQuery, false);
            setMedia(darkQuery, true);
        });
        expect(result.current.theme).toBe("light");
        expect(document.documentElement.style.colorScheme).toBe("light");
        expectBrowserTheme("light");
    });

    it("loads a saved preference ahead of the OS preference", async () => {
        mockMedia({ [darkQuery]: true });
        localStorage.setItem("portfolio-theme", "light");
        const { useTheme } = await import("../../src/hooks/useTheme");
        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe("light");
        expectBrowserTheme("light");
    });

    it("synchronizes changes and preference removal from another tab", async () => {
        const { useTheme } = await import("../../src/hooks/useTheme");
        const { result } = renderHook(() => useTheme());
        act(() => {
            localStorage.setItem("portfolio-theme", "dark");
            window.dispatchEvent(
                new StorageEvent("storage", {
                    key: "portfolio-theme",
                    newValue: "dark",
                }),
            );
        });
        expect(result.current.theme).toBe("dark");
        expectBrowserTheme("dark");
        act(() => {
            localStorage.removeItem("portfolio-theme");
            window.dispatchEvent(
                new StorageEvent("storage", {
                    key: "portfolio-theme",
                    newValue: null,
                }),
            );
        });
        expect(result.current.theme).toBe("light");
        expectBrowserTheme("light");
    });

    it("ignores invalid saved values and still works when storage is blocked", async () => {
        mockMedia({ [darkQuery]: true });
        localStorage.setItem("portfolio-theme", "invalid");
        const { useTheme } = await import("../../src/hooks/useTheme");
        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe("dark");
        expectBrowserTheme("dark");
        vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
            throw new Error("Storage blocked");
        });
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new Error("Storage blocked");
        });
        act(() => result.current.toggleTheme());
        expect(result.current.theme).toBe("light");
        expect(document.documentElement).toHaveAttribute("data-theme", "light");
        expectBrowserTheme("light");
    });

    it.each([
        { saved: "dark", osDark: false, expected: "dark" },
        { saved: "light", osDark: true, expected: "light" },
        { saved: "invalid", osDark: true, expected: "dark" },
        { saved: null, osDark: false, expected: "light" },
    ] as const)(
        "sets browser chrome before React loads: $saved / OS dark=$osDark",
        ({ saved, osDark, expected }) => {
            mockMedia({ [darkQuery]: osDark });
            if (saved) localStorage.setItem("portfolio-theme", saved);
            const script = new DOMParser()
                .parseFromString(template, "text/html")
                .querySelector("script:not([src])");
            // Execute the shipped bootstrap rather than duplicating its logic in the test.
            window.eval(script?.textContent ?? "");
            expectBrowserTheme(expected);
        },
    );

    it("sets browser chrome before React loads when storage is blocked", () => {
        mockMedia({ [darkQuery]: true });
        vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
            throw new Error("Storage blocked");
        });
        const script = new DOMParser()
            .parseFromString(template, "text/html")
            .querySelector("script:not([src])");
        window.eval(script?.textContent ?? "");
        expectBrowserTheme("dark");
    });
});
