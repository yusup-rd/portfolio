import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockMedia } from "../helpers/media";

const darkQuery = "(prefers-color-scheme: dark)";

beforeEach(() => {
    vi.resetModules();
});

describe("theme preference", () => {
    it("follows live OS changes until the visitor explicitly chooses", async () => {
        const setMedia = mockMedia();
        const { useTheme } = await import("../../src/hooks/useTheme");
        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe("light");
        act(() => setMedia(darkQuery, true));
        expect(result.current.theme).toBe("dark");
        expect(document.documentElement).toHaveAttribute("data-theme", "dark");
        act(() => result.current.toggleTheme());
        expect(localStorage.getItem("portfolio-theme")).toBe("light");
        act(() => {
            setMedia(darkQuery, false);
            setMedia(darkQuery, true);
        });
        expect(result.current.theme).toBe("light");
        expect(document.documentElement.style.colorScheme).toBe("light");
    });

    it("loads a saved preference ahead of the OS preference", async () => {
        mockMedia({ [darkQuery]: true });
        localStorage.setItem("portfolio-theme", "light");
        const { useTheme } = await import("../../src/hooks/useTheme");
        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe("light");
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
    });

    it("ignores invalid saved values and still works when storage is blocked", async () => {
        mockMedia({ [darkQuery]: true });
        localStorage.setItem("portfolio-theme", "invalid");
        const { useTheme } = await import("../../src/hooks/useTheme");
        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe("dark");
        vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
            throw new Error("Storage blocked");
        });
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new Error("Storage blocked");
        });
        act(() => result.current.toggleTheme());
        expect(result.current.theme).toBe("light");
        expect(document.documentElement).toHaveAttribute("data-theme", "light");
    });
});
