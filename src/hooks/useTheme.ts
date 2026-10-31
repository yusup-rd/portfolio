import { useLayoutEffect, useState } from "react";
export type Theme = "light" | "dark";
const savedTheme = (): Theme | null => {
    try {
        const value = localStorage.getItem("portfolio-theme");
        return value === "light" || value === "dark" ? value : null;
    } catch {
        return null;
    }
};
export const useTheme = () => {
    const [preference, setPreference] = useState<Theme | null>(savedTheme);
    const [system, setSystem] = useState<Theme>(() =>
        matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    );
    const theme = preference ?? system;
    useLayoutEffect(() => {
        const media = matchMedia("(prefers-color-scheme: dark)");
        const update = () => setSystem(media.matches ? "dark" : "light");
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);
    useLayoutEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
    }, [theme]);
    const toggleTheme = () => {
        const next = theme === "dark" ? "light" : "dark";
        setPreference(next);
        try {
            localStorage.setItem("portfolio-theme", next);
        } catch {
            /* Storage is optional. */
        }
    };
    return { theme, toggleTheme };
};
