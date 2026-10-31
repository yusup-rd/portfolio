import { useEffect, useRef } from "react";
import { FiFileText } from "react-icons/fi";
import type { PortfolioDocument } from "../../types/portfolio";
import AnimatedDisclosure from "./AnimatedDisclosure";
import DocumentLink from "./DocumentLink";
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
    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            if (!track.current || !progress.current) return;
            const r = track.current.getBoundingClientRect();
            const amount = Math.min(
                1,
                Math.max(0, (innerHeight * 0.55 - r.top) / r.height),
            );
            progress.current.style.transform = "scaleY(" + amount + ")";
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        const resize = new ResizeObserver(schedule);
        if (track.current) resize.observe(track.current);
        addEventListener("scroll", schedule, { passive: true });
        addEventListener("resize", schedule);
        update();
        return () => {
            removeEventListener("scroll", schedule);
            removeEventListener("resize", schedule);
            resize.disconnect();
            cancelAnimationFrame(frame);
        };
    }, []);
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
                            <div className="flex flex-wrap gap-4">
                                {entry.documents?.map((document) => (
                                    <DocumentLink
                                        key={document.src}
                                        src={document.src}
                                        title={document.title}
                                    >
                                        <FiFileText aria-hidden="true" />
                                        {document.title}
                                    </DocumentLink>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {entry.tags.map((tag) => (
                                    <span key={tag} className="tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </article>
                    </li>
                ))}
            </ol>
        </div>
    );
};
export default Timeline;
