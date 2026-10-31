import { useEffect } from "react";
export const useReveal = () => {
    useEffect(() => {
        const keyboard = () => {
            document.documentElement.dataset.input = "keyboard";
        };
        const pointer = () => {
            document.documentElement.dataset.input = "pointer";
        };
        addEventListener("keydown", keyboard);
        addEventListener("pointerdown", pointer);
        const cleanup = () => {
            removeEventListener("keydown", keyboard);
            removeEventListener("pointerdown", pointer);
        };
        if (matchMedia("(prefers-reduced-motion: reduce)").matches)
            return cleanup;
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                }),
            { threshold: 0.08 },
        );
        document.querySelectorAll("[data-reveal]").forEach((el) => {
            el.classList.add("reveal-ready");
            observer.observe(el);
        });
        return () => {
            observer.disconnect();
            cleanup();
        };
    }, []);
};
