import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { mockMedia } from "./helpers/media";

beforeEach(() => {
    if (typeof window === "undefined") return;
    localStorage.clear();
    delete document.documentElement.dataset.theme;
    document.documentElement.dataset.input = "keyboard";
    mockMedia({ "(prefers-reduced-motion: reduce)": true });
    // jsdom has no layout engine. Supply a stable viewport to consumers;
    // these tests assert behavior, not dimensions or animation smoothness.
    vi.stubGlobal(
        "ResizeObserver",
        class implements ResizeObserver {
            private callback: ResizeObserverCallback;
            constructor(callback: ResizeObserverCallback) {
                this.callback = callback;
            }
            observe(target: Element) {
                const size = [{ inlineSize: 800, blockSize: 600 }];
                this.callback(
                    [
                        {
                            target,
                            contentRect: new DOMRectReadOnly(0, 0, 800, 600),
                            borderBoxSize: size,
                            contentBoxSize: size,
                            devicePixelContentBoxSize: size,
                        },
                    ],
                    this,
                );
            }
            unobserve() {}
            disconnect() {}
        },
    );
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
        configurable: true,
        value: vi.fn(),
    });
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
        configurable: true,
        value: vi.fn(),
    });
    Object.defineProperty(document, "fonts", {
        configurable: true,
        value: { ready: Promise.resolve() },
    });
});

afterEach(() => {
    cleanup();
});
