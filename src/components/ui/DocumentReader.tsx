import { useEffect, useRef, useState } from "react";
import {
    FiChevronLeft,
    FiChevronRight,
    FiDownload,
    FiFileText,
    FiMinus,
    FiPlus,
    FiX,
} from "react-icons/fi";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import AnimatedDialog from "./AnimatedDialog";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();
interface DocumentReaderProps {
    src: string;
    title: string;
    onClose: () => void;
}
const DocumentReader = ({ src, title, onClose }: DocumentReaderProps) => {
    const [pages, setPages] = useState(0);
    const [page, setPage] = useState(1);
    const [zoom, setZoom] = useState(1);
    const [width, setWidth] = useState(600);
    const [failed, setFailed] = useState(false);
    const [body, setBody] = useState<HTMLDivElement | null>(null);
    const pageStatus = useRef<HTMLParagraphElement>(null);
    const isPdf = /\.pdf(?:$|[?#])/i.test(src);
    useEffect(() => {
        if (!body) return;
        const observer = new ResizeObserver(([entry]) => {
            if (entry) setWidth(Math.max(200, entry.contentRect.width - 32));
        });
        observer.observe(body);
        return () => observer.disconnect();
    }, [body]);
    const changePage = (next: number) => {
        setPage(next);
        if (next === 1 || next === pages)
            pageStatus.current?.focus({ preventScroll: true });
        body?.scrollTo({ top: 0 });
    };
    return (
        <AnimatedDialog labelledBy="document-reader-title" onClose={onClose}>
            {(close, dialogProps) => (
                <section
                    {...dialogProps}
                    className="surface project-dialog flex h-[92dvh] w-full max-w-280 flex-col overflow-hidden"
                    role="dialog"
                    aria-modal="true"
                    tabIndex={-1}
                >
                    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
                        <h2
                            id="document-reader-title"
                            className="flex items-center gap-2 text-base font-semibold"
                        >
                            <FiFileText aria-hidden="true" />
                            {title}
                        </h2>
                        <div className="flex items-center gap-2">
                            <a
                                className="button button-secondary"
                                href={src}
                                download
                            >
                                <FiDownload aria-hidden="true" />
                                Download
                            </a>
                            <button
                                className="icon-button"
                                type="button"
                                aria-label="Close document reader"
                                onClick={close}
                            >
                                <FiX />
                            </button>
                        </div>
                    </header>
                    {isPdf && (
                        <div
                            className={
                                "flex flex-wrap items-center gap-3 border-b border-border px-4 py-2 " +
                                (pages > 1 ? "justify-between" : "justify-end")
                            }
                        >
                            {pages > 1 && (
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="icon-button"
                                        aria-label="Previous page"
                                        disabled={page <= 1}
                                        onClick={() => changePage(page - 1)}
                                    >
                                        <FiChevronLeft aria-hidden="true" />
                                    </button>
                                    <p
                                        ref={pageStatus}
                                        tabIndex={-1}
                                        role="status"
                                        className="text-sm"
                                    >
                                        Page {page} of {pages}
                                    </p>
                                    <button
                                        type="button"
                                        className="icon-button"
                                        aria-label="Next page"
                                        disabled={!pages || page >= pages}
                                        onClick={() => changePage(page + 1)}
                                    >
                                        <FiChevronRight aria-hidden="true" />
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <button
                                    className="icon-button"
                                    type="button"
                                    aria-label="Zoom out"
                                    disabled={zoom <= 0.75}
                                    onClick={() =>
                                        setZoom((z) => Math.max(0.75, z - 0.25))
                                    }
                                >
                                    <FiMinus />
                                </button>
                                <span className="text-sm tabular-nums">
                                    {Math.round(zoom * 100)}%
                                </span>
                                <button
                                    className="icon-button"
                                    type="button"
                                    aria-label="Zoom in"
                                    disabled={zoom >= 4}
                                    onClick={() =>
                                        setZoom((z) => Math.min(4, z + 0.25))
                                    }
                                >
                                    <FiPlus />
                                </button>
                            </div>
                        </div>
                    )}
                    <div
                        ref={setBody}
                        className="document-pages min-h-0 flex-1 overflow-auto bg-bg-light p-4"
                    >
                        {failed ? (
                            <p role="alert">
                                This document could not be displayed. You can
                                still use the download link.
                            </p>
                        ) : isPdf ? (
                            <Document
                                file={src}
                                onLoadSuccess={({ numPages }) => {
                                    setPages(numPages);
                                    setFailed(false);
                                }}
                                onLoadError={() => setFailed(true)}
                                loading={<p role="status">Loading document…</p>}
                            >
                                <Page
                                    pageNumber={page}
                                    width={Math.min(width, 1000) * zoom}
                                    onRenderError={() => setFailed(true)}
                                    loading={
                                        <p role="status">Rendering page…</p>
                                    }
                                />
                            </Document>
                        ) : (
                            <img
                                src={src}
                                alt={title}
                                className="h-auto w-full object-contain"
                                onError={() => setFailed(true)}
                            />
                        )}
                    </div>
                </section>
            )}
        </AnimatedDialog>
    );
};
export default DocumentReader;
