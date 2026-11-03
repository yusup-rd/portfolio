import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
    FiChevronLeft,
    FiChevronRight,
    FiDownload,
    FiExternalLink,
    FiFileText,
    FiMinus,
    FiPlus,
    FiX,
} from "react-icons/fi";
import {
    cacheImageDimensions,
    getCachedDocument,
} from "../../utils/documentCache";
import AnimatedDialog from "./AnimatedDialog";
import AnimatedHeight from "./AnimatedHeight";
import DocumentPreview from "./DocumentPreview";
const PdfDocument = lazy(() => import("./PdfDocument"));
interface DocumentReaderProps {
    src: string;
    title: string;
    onClose: () => void;
}
const DocumentReader = ({ src, title, onClose }: DocumentReaderProps) => {
    const [pages, setPages] = useState(0);
    const [page, setPage] = useState(1);
    const [zoom, setZoom] = useState(1);
    const [width, setWidth] = useState(0);
    const [failed, setFailed] = useState(false);
    const [imageReady, setImageReady] = useState(
        () => !!getCachedDocument(src)?.aspectRatio,
    );
    const [body, setBody] = useState<HTMLDivElement | null>(null);
    const pageStatus = useRef<HTMLParagraphElement>(null);
    const isPdf = /\.pdf(?:$|[?#])/i.test(src);
    const handleError = useCallback(() => setFailed(true), []);
    const unavailable = (
        <p role="alert">
            This preview is unavailable. Open the original document or download
            a copy using the controls above.
        </p>
    );
    useEffect(() => {
        if (!body) return;
        const observer = new ResizeObserver(([entry]) => {
            // contentRect already excludes the reader body's padding.
            if (entry) setWidth(entry.contentRect.width);
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
                <AnimatedHeight
                    open
                    instant={
                        document.documentElement.dataset.input === "keyboard"
                    }
                    className="w-full max-w-240"
                >
                    <section
                        {...dialogProps}
                        className="surface project-dialog flex max-h-[92dvh] w-full flex-col overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        tabIndex={-1}
                    >
                        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
                            <h2
                                id="document-reader-title"
                                className="flex items-center gap-2 text-base font-semibold"
                            >
                                <FiFileText aria-hidden="true" />
                                {title}
                            </h2>
                            <div className="ml-auto flex items-center gap-2">
                                <a
                                    className="icon-button"
                                    href={src}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Open original document in a new tab"
                                >
                                    <FiExternalLink aria-hidden="true" />
                                </a>
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
                                    "flex shrink-0 flex-wrap items-center gap-3 border-b border-border px-4 py-2 " +
                                    (pages > 1
                                        ? "justify-between"
                                        : "justify-end")
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
                                            setZoom((z) =>
                                                Math.max(0.75, z - 0.25),
                                            )
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
                                            setZoom((z) =>
                                                Math.min(4, z + 0.25),
                                            )
                                        }
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                            </div>
                        )}
                        <div
                            ref={setBody}
                            className="document-pages min-h-0 overflow-auto bg-bg-light p-4"
                        >
                            <ErrorBoundary fallback={unavailable}>
                                {failed ? (
                                    unavailable
                                ) : isPdf ? (
                                    <Suspense
                                        fallback={<DocumentPreview src={src} />}
                                    >
                                        {width > 0 ? (
                                            <PdfDocument
                                                src={src}
                                                page={page}
                                                width={width * zoom}
                                                onLoad={setPages}
                                                onError={handleError}
                                            />
                                        ) : (
                                            <DocumentPreview src={src} />
                                        )}
                                    </Suspense>
                                ) : (
                                    <div
                                        className="relative"
                                        style={{
                                            aspectRatio:
                                                getCachedDocument(src)
                                                    ?.aspectRatio,
                                        }}
                                    >
                                        {!imageReady && (
                                            <DocumentPreview src={src} />
                                        )}
                                        <img
                                            src={src}
                                            alt={title}
                                            className={
                                                imageReady
                                                    ? "h-auto w-full object-contain"
                                                    : "absolute inset-0 h-auto w-full object-contain opacity-0"
                                            }
                                            onLoad={(event) => {
                                                const image =
                                                    event.currentTarget;
                                                cacheImageDimensions(
                                                    src,
                                                    image.naturalWidth,
                                                    image.naturalHeight,
                                                );
                                                setImageReady(true);
                                            }}
                                            onError={handleError}
                                        />
                                    </div>
                                )}
                            </ErrorBoundary>
                        </div>
                    </section>
                </AnimatedHeight>
            )}
        </AnimatedDialog>
    );
};
export default DocumentReader;
