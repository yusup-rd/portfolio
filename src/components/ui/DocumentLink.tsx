import { useState, type ReactNode } from "react";
import DocumentReader from "./DocumentReader";
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
                aria-haspopup="dialog"
                className={className}
                onClick={(event) => {
                    event.currentTarget.focus({ preventScroll: true });
                    setOpen(true);
                }}
            >
                {children ?? title}
            </button>
            {open && (
                <DocumentReader
                    src={src}
                    title={title}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
};
export default DocumentLink;
