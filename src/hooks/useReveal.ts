import { useLayoutEffect } from "react";
export const useReveal = () => {
    useLayoutEffect(() => {
        const keyboard = (event: KeyboardEvent) => {
            // Browser/window shortcuts (including Alt+Tab) do not change app input mode.
            if (
                event.altKey ||
                event.ctrlKey ||
                event.metaKey ||
                ["Alt", "Control", "Meta", "Shift"].includes(event.key)
            )
                return;
            document.documentElement.dataset.input = "keyboard";
        };
        const pointer = () => {
            document.documentElement.dataset.input = "pointer";
        };
        let position: { x: number; y: number } | undefined;
        const hover = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") return;
            // Compare coordinates: Safari does not consistently expose movementX/Y.
            const moved =
                !position ||
                position.x !== event.clientX ||
                position.y !== event.clientY;
            position = { x: event.clientX, y: event.clientY };
            if (moved && document.documentElement.dataset.input !== "pointer")
                pointer();
        };
        addEventListener("pointermove", hover, { passive: true });
        addEventListener("keydown", keyboard);
        addEventListener("pointerdown", pointer);
        addEventListener("wheel", pointer, { passive: true });
        const cleanup = () => {
            removeEventListener("pointermove", hover);
            removeEventListener("keydown", keyboard);
            removeEventListener("pointerdown", pointer);
            removeEventListener("wheel", pointer);
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
