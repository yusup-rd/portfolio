import { useLayoutEffect, useSyncExternalStore } from "react";
export type Theme = "light" | "dark";
let memoryPreference: Theme | null = null;
const savedTheme = (): Theme | null => {
    if (memoryPreference) return memoryPreference;
    try {
        const value = localStorage.getItem("portfolio-theme");
        return value === "light" || value === "dark" ? value : null;
    } catch {
        return memoryPreference;
    }
};
const getTheme = (): Theme =>
    savedTheme() ??
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
const subscribe = (notify: () => void) => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const storage = (event: StorageEvent) => {
        if (event.key !== null && event.key !== "portfolio-theme") return;
        memoryPreference = null;
        notify();
    };
    media.addEventListener("change", notify);
    addEventListener("storage", storage);
    addEventListener("portfolio-theme-change", notify);
    return () => {
        media.removeEventListener("change", notify);
        removeEventListener("storage", storage);
        removeEventListener("portfolio-theme-change", notify);
    };
};
export const useTheme = () => {
    // The server and first hydration pass agree; the head script paints the
    // actual preference before React loads, without a light/dark flash.
    const theme = useSyncExternalStore<Theme>(
        subscribe,
        getTheme,
        () => "light",
    );
    useLayoutEffect(() => {
        const current = getTheme();
        document.documentElement.dataset.theme = current;
        document.documentElement.style.colorScheme = current;
        document
            .querySelector('meta[name="color-scheme"]')
            ?.setAttribute("content", current);
        // Browser chrome follows the selected page theme, independently of the OS.
        // Read the token rather than duplicating the CSS palette at runtime.
        document
            .querySelector('meta[name="theme-color"]')
            ?.setAttribute(
                "content",
                getComputedStyle(document.documentElement)
                    .getPropertyValue("--page")
                    .trim(),
            );
    }, [theme]);
    const toggleTheme = () => {
        const next = theme === "dark" ? "light" : "dark";
        memoryPreference = next;
        try {
            localStorage.setItem("portfolio-theme", next);
        } catch {
            /* Storage is optional. */
        }
        dispatchEvent(new Event("portfolio-theme-change"));
    };
    return { theme, toggleTheme };
};
