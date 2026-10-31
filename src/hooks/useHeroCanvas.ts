import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";
import type { Theme } from "./useTheme";
interface HeroRenderer {
    resize: (width: number, height: number, ratio: number) => void;
    draw: (
        time: number,
        intro: number,
        pointer: [number, number],
        presence: number,
    ) => void;
    dispose: () => void;
}
export const useHeroCanvas = (
    create: (host: HTMLDivElement) => HeroRenderer | null,
    theme: Theme,
) => {
    const host = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    useEffect(() => {
        const element = host.current;
        if (!element) return;
        const renderer = create(element);
        if (!renderer) return;
        let frame = 0,
            last = 0,
            elapsed = 0,
            entrance = 0,
            visible = true,
            presence = 0,
            targetPresence = 0;
        let active = document.documentElement.dataset.theme === theme;
        const pointer: [number, number] = [0, 0],
            target: [number, number] = [0, 0];
        const draw = () =>
            renderer.draw(
                reduced ? 0 : elapsed,
                reduced ? 1 : Math.min(1, entrance / 1.4),
                pointer,
                reduced ? 0 : presence,
            );
        const running = () => active && visible && !document.hidden && !reduced;
        const tick = (now: number) => {
            frame = 0;
            if (!running()) return;
            if (!last || now - last >= 1000 / 30) {
                const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 30;
                presence +=
                    (targetPresence - presence) * (1 - Math.exp(-dt / 0.25));
                elapsed += dt;
                entrance += dt;
                for (const axis of [0, 1] as const)
                    pointer[axis] +=
                        (target[axis] - pointer[axis]) *
                        (1 - Math.exp(-dt / 0.35));
                last = now;
                draw();
            }
            frame = requestAnimationFrame(tick);
        };
        const wake = () => {
            if (running() && !frame) {
                last = 0;
                frame = requestAnimationFrame(tick);
            } else if (!running()) {
                cancelAnimationFrame(frame);
                frame = 0;
            }
        };
        const resize = () => {
            const { width, height } = element.getBoundingClientRect();
            renderer.resize(
                width,
                height,
                Math.min(devicePixelRatio || 1, 1.5),
            );
            draw();
            wake();
        };
        const changeTheme = () => {
            const next = document.documentElement.dataset.theme === theme;
            if (next && !active) {
                entrance = 0;
                pointer[0] = 0;
                pointer[1] = 0;
            }
            active = next;
            if (active) draw();
            wake();
        };
        const move = (event: PointerEvent) => {
            if (event.pointerType !== "mouse" || reduced) return;
            targetPresence = 1;
            const rect = element.getBoundingClientRect();
            target[0] = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            target[1] = 1 - ((event.clientY - rect.top) / rect.height) * 2;
        };
        const leave = () => {
            targetPresence = 0;
            target[0] = 0;
            target[1] = 0;
        };
        const hero = element.closest("section");
        hero?.addEventListener("pointermove", move, { passive: true });
        hero?.addEventListener("pointerleave", leave);
        const size = new ResizeObserver(resize);
        size.observe(element);
        const intersection = new IntersectionObserver(([entry]) => {
            visible = Boolean(entry?.isIntersecting);
            wake();
        });
        intersection.observe(element);
        const palette = new MutationObserver(changeTheme);
        palette.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });
        document.addEventListener("visibilitychange", wake);
        window.addEventListener("resize", resize);
        resize();
        return () => {
            cancelAnimationFrame(frame);
            size.disconnect();
            intersection.disconnect();
            palette.disconnect();
            hero?.removeEventListener("pointermove", move);
            hero?.removeEventListener("pointerleave", leave);
            document.removeEventListener("visibilitychange", wake);
            window.removeEventListener("resize", resize);
            renderer.dispose();
        };
    }, [create, theme, reduced]);
    return host;
};
