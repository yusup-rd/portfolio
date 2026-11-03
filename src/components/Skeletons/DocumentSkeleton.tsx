interface DocumentSkeletonProps {
    aspectRatio?: number;
}

const DocumentSkeleton = ({ aspectRatio = 4 / 3 }: DocumentSkeletonProps) => {
    return (
        <div role="status" aria-label="Loading document" className="w-full">
            <span className="sr-only">Loading document</span>
            <div
                aria-hidden="true"
                style={{ aspectRatio }}
                className="flex w-full flex-col gap-5 overflow-hidden bg-card p-6 motion-safe:animate-pulse sm:p-10"
            >
                <div className="h-5 w-2/3 shrink-0 rounded bg-border/60" />
                <div className="h-3 w-1/3 shrink-0 rounded bg-border/40" />
                <div className="flex flex-col gap-3">
                    <div className="h-2 rounded bg-border/40" />
                    <div className="h-2 w-5/6 rounded bg-border/40" />
                    <div className="h-2 w-3/4 rounded bg-border/40" />
                </div>
                <div className="min-h-8 flex-1 rounded bg-bg-light" />
            </div>
        </div>
    );
};

export default DocumentSkeleton;
