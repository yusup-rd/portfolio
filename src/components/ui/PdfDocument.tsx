import "core-js/actual/promise/with-resolvers";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
    cacheDocumentPreview,
    getCachedDocument,
    loadDocumentFile,
} from "../../utils/documentCache";
import workerUrl from "../../workers/pdf.worker?worker&url";
import DocumentPreview from "./DocumentPreview";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

interface PdfDocumentProps {
    src: string;
    page: number;
    width: number;
    onLoad: (pages: number) => void;
    onError: () => void;
}

const PdfDocument = ({
    src,
    page,
    width,
    onLoad,
    onError,
}: PdfDocumentProps) => {
    const [aspectRatio, setAspectRatio] = useState(2);
    const [file, setFile] = useState<Blob | undefined>(
        () => getCachedDocument(src)?.file,
    );
    const [renderedKey, setRenderedKey] = useState("");
    const canvas = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        let active = true;
        void loadDocumentFile(src)
            .then((loaded) => {
                if (active) setFile(loaded);
            })
            .catch(() => {
                if (active) onError();
            });
        return () => {
            active = false;
        };
    }, [src, onError]);
    // Bound canvas memory even on high-DPR phones and at maximum zoom.
    const devicePixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2,
        Math.sqrt(2_000_000 / (width * width * aspectRatio)),
        4096 / (width * Math.max(1, aspectRatio)),
    );
    const renderKey = `${page}:${width}:${devicePixelRatio}`;
    const rendered = renderedKey === renderKey;
    return (
        <div className="relative mx-auto" style={{ width }}>
            {!rendered && <DocumentPreview src={src} page={page} />}
            <div
                inert={!rendered}
                aria-hidden={!rendered}
                className={
                    rendered
                        ? ""
                        : "pointer-events-none absolute inset-x-0 top-0 opacity-0"
                }
            >
                <Document
                    file={file ?? null}
                    suspense={false}
                    onLoadSuccess={({ numPages }) => onLoad(numPages)}
                    onSourceError={onError}
                    onLoadError={onError}
                    loading={null}
                    noData={null}
                >
                    <Page
                        pageNumber={page}
                        width={width}
                        devicePixelRatio={devicePixelRatio}
                        canvasRef={canvas}
                        onRenderSuccess={() => {
                            setRenderedKey(renderKey);
                            if (page === 1 && canvas.current)
                                cacheDocumentPreview(src, canvas.current);
                        }}
                        onLoadSuccess={({ originalWidth, originalHeight }) =>
                            setAspectRatio(originalHeight / originalWidth)
                        }
                        onLoadError={onError}
                        onRenderError={onError}
                        onRenderTextLayerError={onError}
                        onRenderAnnotationLayerError={onError}
                        loading={null}
                    />
                </Document>
            </div>
        </div>
    );
};

export default PdfDocument;
