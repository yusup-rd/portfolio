interface DocumentPreview {
    url: string;
    width: number;
    height: number;
    bytes: number;
}

interface CachedDocument {
    file?: Blob;
    preview?: DocumentPreview;
    aspectRatio?: number;
}

const documents = new Map<string, CachedDocument>();
const pending = new Map<string, Promise<Blob>>();
const maxEntries = 3;
const maxBytes = 8 * 1024 * 1024;

const save = (src: string, entry: CachedDocument) => {
    documents.delete(src);
    documents.set(src, entry);
    const bytes = () =>
        [...documents.values()].reduce(
            (total, value) =>
                total + (value.file?.size ?? 0) + (value.preview?.bytes ?? 0),
            0,
        );
    while (documents.size > maxEntries || bytes() > maxBytes) {
        const oldest = documents.keys().next().value;
        if (!oldest) break;
        const preview = documents.get(oldest)?.preview;
        if (preview) URL.revokeObjectURL(preview.url);
        documents.delete(oldest);
    }
};

export const getCachedDocument = (src: string) => documents.get(src);

export const loadDocumentFile = (src: string): Promise<Blob> => {
    const cached = documents.get(src);
    if (cached?.file) {
        save(src, cached);
        return Promise.resolve(cached.file);
    }
    const existing = pending.get(src);
    if (existing) return existing;
    const request = fetch(src)
        .then(async (response) => {
            if (!response.ok)
                throw new Error(`Document request failed: ${response.status}`);
            const file = await response.blob();
            if (file.size <= maxBytes)
                save(src, { ...documents.get(src), file });
            return file;
        })
        .finally(() => pending.delete(src));
    pending.set(src, request);
    return request;
};

export const cacheImageDimensions = (
    src: string,
    width: number,
    height: number,
) => {
    save(src, { ...documents.get(src), aspectRatio: width / height });
};

export const cacheDocumentPreview = (
    src: string,
    canvas: HTMLCanvasElement,
) => {
    const { width, height } = canvas;
    if (!width || !height || documents.get(src)?.preview) return;
    try {
        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                const previous = documents.get(src);
                if (previous?.preview)
                    URL.revokeObjectURL(previous.preview.url);
                save(src, {
                    ...previous,
                    aspectRatio: width / height,
                    preview: {
                        url: URL.createObjectURL(blob),
                        width,
                        height,
                        bytes: blob.size,
                    },
                });
            },
            "image/jpeg",
            0.85,
        );
    } catch {
        // A preview cache must never interrupt a successfully rendered document.
    }
};
