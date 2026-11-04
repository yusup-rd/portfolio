import { vi } from "vitest";

// EventTarget gives subscriptions real add/remove behavior, including cleanup.
export const mockMedia = (initial: Record<string, boolean> = {}) => {
    const queries = new Map<string, MediaQueryList>();
    vi.stubGlobal("matchMedia", (query: string): MediaQueryList => {
        let media = queries.get(query);
        if (!media) {
            media = Object.assign(new EventTarget(), {
                matches: initial[query] ?? false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
            });
            queries.set(query, media);
        }
        return media;
    });
    return (query: string, matches: boolean) => {
        const media = window.matchMedia(query);
        Object.defineProperty(media, "matches", {
            value: matches,
            configurable: true,
        });
        media.dispatchEvent(new Event("change"));
    };
};
