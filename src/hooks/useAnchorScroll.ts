import { useEffect } from "react";
// Header links, hero/footer anchors, direct hashes, and history share one offset.
export const useAnchorScroll = () => {
    useEffect(() => {
        const header = document.querySelector<HTMLElement>(".site-nav");
        const bar = header?.firstElementChild;
        if (!header || !bar) return;
        const height = () =>
            bar.getBoundingClientRect().height +
            parseFloat(getComputedStyle(header).borderBottomWidth);
        const update = () =>
            document.documentElement.style.setProperty(
                "--header-height",
                height() + "px",
            );
        const observer = new ResizeObserver(update);
        observer.observe(bar);
        update();
        let frame = 0;
        const scroll = (
            hash: string,
            instant: boolean,
            focus: boolean,
            waitForMenu = false,
        ) => {
            let target: HTMLElement | null;
            try {
                target = document.getElementById(
                    decodeURIComponent(hash.slice(1)),
                );
            } catch {
                return;
            }
            if (!target) return;
            cancelAnimationFrame(frame);
            const perform = () => {
                if (
                    waitForMenu &&
                    header.getBoundingClientRect().height > height() + 0.5
                ) {
                    frame = requestAnimationFrame(perform);
                    return;
                }
                if (focus) {
                    if (!target.hasAttribute("tabindex")) {
                        target.setAttribute("tabindex", "-1");
                        target.addEventListener(
                            "blur",
                            () => target.removeAttribute("tabindex"),
                            { once: true },
                        );
                    }
                    target.focus({ preventScroll: true });
                }
                window.scrollTo({
                    top: Math.max(
                        0,
                        target.getBoundingClientRect().top + scrollY - height(),
                    ),
                    behavior: instant ? "instant" : "smooth",
                });
            };
            frame = requestAnimationFrame(perform);
        };
        const click = (event: MouseEvent) => {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            )
                return;
            const anchor =
                event.target instanceof Element
                    ? event.target.closest<HTMLAnchorElement>("a[href]")
                    : null;
            if (!anchor || anchor.target || anchor.hasAttribute("download"))
                return;
            const url = new URL(anchor.href);
            if (
                url.origin !== location.origin ||
                url.pathname !== location.pathname ||
                url.search !== location.search ||
                !url.hash
            )
                return;
            if (!document.getElementById(decodeURIComponent(url.hash.slice(1))))
                return;
            event.preventDefault();
            if (location.hash !== url.hash)
                history.pushState(null, "", url.hash);
            scroll(
                url.hash,
                event.detail === 0 ||
                    matchMedia("(prefers-reduced-motion: reduce)").matches,
                true,
                Boolean(anchor.closest("#mobile-navigation")),
            );
        };
        const historyScroll = () => {
            if (location.hash) scroll(location.hash, true, false);
        };
        document.addEventListener("click", click);
        window.addEventListener("hashchange", historyScroll);
        window.addEventListener("popstate", historyScroll);
        historyScroll();
        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
            document.removeEventListener("click", click);
            window.removeEventListener("hashchange", historyScroll);
            window.removeEventListener("popstate", historyScroll);
        };
    }, []);
};
