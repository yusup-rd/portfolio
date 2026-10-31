import { lazy, Suspense, useState, type ReactNode } from "react";
const DocumentReader = lazy(() => import("./DocumentReader"));
interface DocumentLinkProps {
    src: string;
    title: string;
    children?: ReactNode;
    className?: string;
}
const DocumentLink = ({
    src,
    title,
    children,
    className = "text-link",
}: DocumentLinkProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                className={className}
                onClick={() => setOpen(true)}
            >
                {children ?? title}
            </button>
            {open && (
                <Suspense
                    fallback={
                        <p className="reader-loading" role="status">
                            Opening document reader…
                        </p>
                    }
                >
                    <DocumentReader
                        src={src}
                        title={title}
                        onClose={() => setOpen(false)}
                    />
                </Suspense>
            )}
        </>
    );
};
export default DocumentLink;
