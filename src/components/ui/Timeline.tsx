import { useMotionValueEvent, useSpring } from "motion/react";
import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { PortfolioDocument } from "../../types/portfolio";
import { motionTiming } from "../../utils/motion";
import AnimatedDisclosure from "./AnimatedDisclosure";
import DocumentFolder from "./DocumentFolder";
interface TimelineEntry {
    id: number;
    title: string;
    organization: string;
    date: string;
    description: string;
    tags: string[];
    documents?: PortfolioDocument[];
}
interface TimelineProps {
    entries: TimelineEntry[];
    label: string;
}
const Timeline = ({ entries, label }: TimelineProps) => {
    const track = useRef<HTMLDivElement>(null);
    const progress = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const smoothProgress = useSpring(0, {
        visualDuration: motionTiming.fade,
        bounce: motionTiming.spring.bounce,
        restDelta: 0.0001,
        restSpeed: 0.001,
    });
    useMotionValueEvent(smoothProgress, "change", (amount) => {
        if (progress.current)
            progress.current.style.transform = `scaleY(${Math.min(1, Math.max(0, amount))})`;
    });
    useLayoutEffect(() => {
        const element = track.current;
        const line = progress.current;
        if (!element || !line) return;
        let frame = 0;
        let initialized = false;
        const update = () => {
            frame = 0;
            const rect = element.getBoundingClientRect();
            const amount = reduced
                ? 1
                : Math.min(
                      1,
                      Math.max(
                          0,
                          (innerHeight * 0.55 - rect.top) /
                              Math.max(1, rect.height),
                      ),
                  );
            if (
                !initialized ||
                reduced ||
                document.documentElement.dataset.input === "keyboard"
            ) {
                smoothProgress.jump(amount);
                line.style.transform = `scaleY(${amount})`;
            } else {
                smoothProgress.set(amount);
            }
            initialized = true;
        };
        const schedule = () => {
            if (!frame && !document.hidden)
                frame = requestAnimationFrame(update);
        };
        const visibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(frame);
                frame = 0;
                smoothProgress.stop();
            } else {
                initialized = false;
                schedule();
            }
        };
        const resize = new ResizeObserver(schedule);
        resize.observe(element);
        // Content above a timeline can move its start without resizing the track itself.
        resize.observe(document.body);
        document.addEventListener("visibilitychange", visibility);
        addEventListener("scroll", schedule, { passive: true });
        addEventListener("resize", schedule);
        update();
        return () => {
            removeEventListener("scroll", schedule);
            removeEventListener("resize", schedule);
            document.removeEventListener("visibilitychange", visibility);
            resize.disconnect();
            cancelAnimationFrame(frame);
            smoothProgress.stop();
        };
    }, [reduced, smoothProgress]);
    return (
        <div ref={track} className="relative">
            <div
                aria-hidden="true"
                className="absolute top-0 bottom-0 left-2 w-px bg-border"
            >
                <div
                    ref={progress}
                    className="timeline-progress size-full origin-top bg-primary"
                />
            </div>
            <ol aria-label={label} className="flex flex-col gap-10">
                {entries.map((entry, index) => (
                    <li
                        key={entry.id}
                        className="relative grid gap-5 pl-10 md:grid-cols-[0.65fr_1.35fr] md:gap-12 md:pl-14"
                    >
                        <span className="timeline-node" aria-hidden="true" />
                        <div className="flex flex-col gap-2">
                            <p className="eyebrow text-primary">{entry.date}</p>
                            <p className="text-sm text-text-secondary">
                                {entry.organization}
                            </p>
                        </div>
                        <article className="flex flex-col gap-4 border-b border-border pb-10">
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                                    {entry.title}
                                </h3>
                                <span className="font-mono text-xs text-text-secondary">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                            </div>
                            <p className="text-base leading-relaxed text-text-secondary">
                                {entry.description.split(/(?<=[.!?])\s/)[0]}
                            </p>
                            {entry.description.split(/(?<=[.!?])\s/).length >
                                1 && (
                                <AnimatedDisclosure>
                                    <p className="text-sm leading-relaxed text-text-secondary">
                                        {entry.description
                                            .split(/(?<=[.!?])\s/)
                                            .slice(1)
                                            .join(" ")}
                                    </p>
                                </AnimatedDisclosure>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {entry.tags.map((tag) => (
                                    <span key={tag} className="tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            {!!entry.documents?.length && (
                                <DocumentFolder documents={entry.documents} />
                            )}
                        </article>
                    </li>
                ))}
            </ol>
        </div>
    );
};
export default Timeline;
