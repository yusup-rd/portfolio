// Adapted from React Bits Rubber Segment by David Haz. See THIRD_PARTY_NOTICES.md.
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { motionTiming } from "../../utils/motion";
interface RubberSegmentItem {
    value: string;
    label: string;
    compactLabel?: string;
}
interface RubberSegmentProps {
    items: readonly RubberSegmentItem[];
    value: string;
    onChange: (value: string) => void;
    label: string;
}
const itemClass =
    "flex min-h-11 min-w-11 items-center justify-center whitespace-nowrap rounded-xl px-2 text-xs font-medium sm:px-4 sm:text-sm";
const RubberSegment = ({
    items,
    value,
    onChange,
    label,
}: RubberSegmentProps) => {
    const track = useRef<HTMLDivElement>(null);
    const highlight = useRef<HTMLDivElement>(null);
    const buttons = useRef(new Map<string, HTMLButtonElement>());
    const selected = useRef(value);
    const slots = useRef(new Map<string, { left: number; right: number }>());
    const drag = useRef<{
        id: number;
        x: number;
        y: number;
        left: number;
        width: number;
        live: boolean;
    } | null>(null);
    const suppressClick = useRef(false);
    const reduced = useReducedMotion();
    const left = useMotionValue(0);
    const right = useMotionValue(0);
    const width = useMotionValue(0);
    const syncClip = useCallback(() => {
        if (!highlight.current) return;
        highlight.current.style.clipPath =
            width.get() > 0
                ? `inset(0 ${Math.max(0, width.get() - right.get())}px 0 ${Math.max(0, left.get())}px round 12px)`
                : "inset(0 100% 0 0 round 12px)";
    }, [width, right, left]);
    useMotionValueEvent(left, "change", syncClip);
    useMotionValueEvent(right, "change", syncClip);
    useMotionValueEvent(width, "change", syncClip);
    const move = useCallback(
        (next: string, instant: boolean) => {
            const slot = slots.current.get(next);
            if (!slot) return;
            left.stop();
            right.stop();
            if (instant) {
                left.jump(slot.left);
                right.jump(slot.right);
                // Apply the measured mask synchronously, including before the first paint.
                syncClip();
                return;
            }
            const forward =
                (slot.left + slot.right) / 2 > (left.get() + right.get()) / 2;
            const delay = motionTiming.fade / 4;
            const transition = {
                ...motionTiming.spring,
                duration: motionTiming.spring.duration - delay,
            };
            // The leading edge arrives first; the trailing edge follows without a bounce.
            animate(left, slot.left, {
                ...transition,
                delay: forward ? delay : 0,
            });
            animate(right, slot.right, {
                ...transition,
                delay: forward ? 0 : delay,
            });
        },
        [left, right, syncClip],
    );
    const measure = useCallback(() => {
        const element = track.current;
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const inset =
            parseFloat(getComputedStyle(element).paddingLeft) +
            element.clientLeft;
        width.jump(rect.width - inset * 2);
        for (const [key, button] of buttons.current) {
            const item = button.getBoundingClientRect();
            slots.current.set(key, {
                left: item.left - rect.left - inset,
                right: item.right - rect.left - inset,
            });
        }
        move(selected.current, true);
    }, [move, width]);
    useLayoutEffect(() => {
        const observer = new ResizeObserver(measure);
        if (track.current) observer.observe(track.current);
        for (const button of buttons.current.values()) observer.observe(button);
        measure();
        let mounted = true;
        void document.fonts.ready.then(() => {
            if (mounted) measure();
        });
        return () => {
            mounted = false;
            observer.disconnect();
        };
    }, [items, measure]);
    useLayoutEffect(() => {
        if (selected.current !== value || reduced) {
            selected.current = value;
            move(value, true);
        }
    }, [value, reduced, move]);
    useEffect(
        () => () => {
            left.stop();
            right.stop();
        },
        [left, right],
    );
    const select = (next: string, instant: boolean) => {
        selected.current = next;
        move(next, instant || reduced);
        if (next !== value) onChange(next);
    };
    const labels = (item: RubberSegmentItem) =>
        item.compactLabel ? (
            <>
                <span className="sm:hidden">{item.compactLabel}</span>
                <span className="hidden sm:inline">{item.label}</span>
            </>
        ) : (
            item.label
        );
    return (
        <div
            ref={track}
            role="radiogroup"
            aria-label={label}
            className="rubber-segment relative inline-grid w-full touch-pan-y touch-pinch-zoom auto-cols-auto grid-flow-col rounded-2xl border border-border bg-bg p-0.75 text-text-secondary select-none has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-primary sm:w-auto"
            onPointerMove={(event) => {
                const held = drag.current;
                if (!held || held.id !== event.pointerId) return;
                const dx = event.clientX - held.x;
                if (!held.live) {
                    if (Math.abs(event.clientY - held.y) > Math.abs(dx)) {
                        drag.current = null;
                        return;
                    }
                    if (Math.abs(dx) < 6) return;
                    held.live = true;
                    suppressClick.current = true;
                    event.currentTarget.setPointerCapture(event.pointerId);
                    left.stop();
                    right.stop();
                }
                const position = Math.min(
                    width.get() - held.width,
                    Math.max(0, held.left + dx),
                );
                left.set(position);
                right.set(position + held.width);
            }}
            onPointerUp={(event) => {
                const held = drag.current;
                if (!held || held.id !== event.pointerId) return;
                drag.current = null;
                if (!held.live) return;
                const center = (left.get() + right.get()) / 2;
                const nearest = [...slots.current].sort(
                    (a, b) =>
                        Math.abs((a[1].left + a[1].right) / 2 - center) -
                        Math.abs((b[1].left + b[1].right) / 2 - center),
                )[0];
                if (nearest) {
                    select(nearest[0], reduced);
                    buttons.current
                        .get(nearest[0])
                        ?.focus({ preventScroll: true });
                }
            }}
            onLostPointerCapture={() => {
                if (drag.current) {
                    drag.current = null;
                    move(selected.current, reduced);
                }
            }}
            onPointerCancel={() => {
                drag.current = null;
                suppressClick.current = false;
                move(selected.current, reduced);
            }}
        >
            {items.map((item, index) => (
                <button
                    key={item.value}
                    type="button"
                    role="radio"
                    aria-label={item.label}
                    aria-checked={value === item.value}
                    tabIndex={value === item.value ? 0 : -1}
                    ref={(element) => {
                        if (element) buttons.current.set(item.value, element);
                        else buttons.current.delete(item.value);
                    }}
                    className={
                        itemClass +
                        " transition-colors duration-150 ease-out outline-none hover:text-text-primary motion-reduce:transition-none"
                    }
                    onPointerDown={(event) => {
                        suppressClick.current = false;
                        if (
                            !event.isPrimary ||
                            event.button !== 0 ||
                            item.value !== value
                        )
                            return;
                        drag.current = {
                            id: event.pointerId,
                            x: event.clientX,
                            y: event.clientY,
                            left: left.get(),
                            width: right.get() - left.get(),
                            live: false,
                        };
                    }}
                    onClick={(event) => {
                        if (suppressClick.current && event.detail !== 0) {
                            suppressClick.current = false;
                            return;
                        }
                        suppressClick.current = false;
                        select(item.value, event.detail === 0);
                    }}
                    onKeyDown={(event) => {
                        let next: number;
                        if (
                            event.key === "ArrowRight" ||
                            event.key === "ArrowDown"
                        )
                            next = (index + 1) % items.length;
                        else if (
                            event.key === "ArrowLeft" ||
                            event.key === "ArrowUp"
                        )
                            next = (index - 1 + items.length) % items.length;
                        else if (event.key === "Home") next = 0;
                        else if (event.key === "End") next = items.length - 1;
                        else return;
                        event.preventDefault();
                        const target = items[next];
                        if (target) {
                            select(target.value, true);
                            buttons.current.get(target.value)?.focus();
                        }
                    }}
                >
                    {labels(item)}
                </button>
            ))}
            <div
                ref={highlight}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0.75 grid auto-cols-auto grid-flow-col bg-primary text-(--button-ink)"
                style={{ clipPath: "inset(0 100% 0 0 round 12px)" }}
            >
                {items.map((item) => (
                    <span key={item.value} className={itemClass}>
                        {labels(item)}
                    </span>
                ))}
            </div>
        </div>
    );
};
export default RubberSegment;
