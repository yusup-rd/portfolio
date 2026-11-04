import { useId, useState } from "react";
import { FiArrowUpRight, FiChevronDown, FiFileText } from "react-icons/fi";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { PortfolioDocument } from "../../types/portfolio";
import AnimatedHeight from "./AnimatedHeight";
import DocumentLink from "./DocumentLink";

interface DocumentListProps {
    documents: PortfolioDocument[];
    labelId?: string;
}

const DocumentList = ({ documents, labelId }: DocumentListProps) => {
    const [open, setOpen] = useState(false);
    const [instant, setInstant] = useState(false);
    const reduced = useReducedMotion();
    const id = useId();
    return (
        <div className="min-w-0">
            <button
                id={labelId}
                type="button"
                aria-expanded={open}
                aria-controls={id}
                className="pressable flex min-h-11 w-full items-center justify-between gap-3 text-left text-sm font-medium transition-transform duration-150 ease-out"
                onClick={(event) => {
                    setInstant(event.detail === 0);
                    setOpen(!open);
                }}
            >
                <span className="flex items-center gap-2">
                    <FiFileText className="shrink-0" aria-hidden="true" />
                    University documents
                </span>
                <span className="flex shrink-0 items-center gap-2 text-text-secondary">
                    <span className="text-xs">
                        {documents.length} documents
                    </span>
                    <FiChevronDown
                        aria-hidden="true"
                        className={`${open ? "rotate-180" : "rotate-0"} transition-transform duration-200 ease-out`}
                        style={{
                            transitionDuration:
                                instant || reduced ? "0s" : undefined,
                        }}
                    />
                </span>
            </button>
            <AnimatedHeight id={id} open={open} instant={instant}>
                <ul className="flex flex-col gap-2 pt-3">
                    {documents.map((document) => (
                        <li key={document.src}>
                            <DocumentLink
                                src={document.src}
                                title={document.title}
                                className="pressable flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm transition-colors duration-150 hover:bg-bg-light"
                            >
                                <span>{document.title}</span>
                                <FiArrowUpRight
                                    className="shrink-0 text-text-secondary"
                                    aria-hidden="true"
                                />
                            </DocumentLink>
                        </li>
                    ))}
                </ul>
            </AnimatedHeight>
        </div>
    );
};

export default DocumentList;
