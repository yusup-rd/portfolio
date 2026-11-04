import { animate, type AnimationPlaybackControls } from "motion";
import { useLayoutEffect, useRef } from "react";
import { motionTiming } from "../utils/motion";

// Height and scroll share one clock, so shrinking the document cannot race a
// separate browser smooth scroll. Each update starts at the current height.
export const useProjectGalleryMotion = (key: string, instant: boolean) => {
    const viewport = useRef<HTMLDivElement>(null);
    const content = useRef<HTMLDivElement>(null);
    const scrollTarget = useRef<number | null>(null);

    useLayoutEffect(() => {
        const outer = viewport.current;
        const inner = content.current;
        if (!outer || !inner) return;
        let animation: AnimationPlaybackControls | undefined;
        let targetHeight = -1;
        let restoreAnchor: (() => void) | undefined;
        const cancelScroll = () => {
            scrollTarget.current = null;
        };
        const measure = () => {
            const nextHeight = inner.getBoundingClientRect().height;
            if (Math.abs(nextHeight - targetHeight) < 0.5) return;
            targetHeight = nextHeight;
            animation?.stop();
            const startHeight = outer.getBoundingClientRect().height;
            const startScroll = window.scrollY;
            const destination = scrollTarget.current;
            const root = document.documentElement;
            if (!restoreAnchor) {
                const previous = root.style.overflowAnchor;
                root.style.overflowAnchor = "none";
                restoreAnchor = () => {
                    root.style.overflowAnchor = previous;
                };
            }
            const update = (progress: number) => {
                outer.style.height = `${startHeight + (nextHeight - startHeight) * progress}px`;
                if (destination !== null && scrollTarget.current !== null) {
                    window.scrollTo({
                        top:
                            startScroll +
                            (destination - startScroll) * progress,
                        behavior: "instant",
                    });
                }
            };
            const complete = () => {
                scrollTarget.current = null;
                restoreAnchor?.();
                restoreAnchor = undefined;
            };
            if (instant || !outer.style.height) {
                update(1);
                complete();
                return;
            }
            animation = animate(0, 1, {
                duration: motionTiming.spring.duration,
                ease: motionTiming.ease,
                onUpdate: update,
                onComplete: complete,
            });
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(inner);
        // A deliberate new gesture takes ownership of scrolling immediately.
        window.addEventListener("wheel", cancelScroll, { passive: true });
        window.addEventListener("touchstart", cancelScroll, { passive: true });
        window.addEventListener("keydown", cancelScroll);
        return () => {
            animation?.stop();
            observer.disconnect();
            restoreAnchor?.();
            window.removeEventListener("wheel", cancelScroll);
            window.removeEventListener("touchstart", cancelScroll);
            window.removeEventListener("keydown", cancelScroll);
        };
    }, [key, instant]);

    const restoreScroll = (position: number | null) => {
        scrollTarget.current = position;
    };
    return { viewport, content, restoreScroll };
};
