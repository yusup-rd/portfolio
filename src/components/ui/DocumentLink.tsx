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
            <a
                href={src}
                aria-haspopup="dialog"
                className={className}
                onClick={(event) => {
                    // Let search engines follow the URL and preserve new-tab actions.
                    if (
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey
                    )
                        return;
                    event.preventDefault();
                    event.currentTarget.focus({ preventScroll: true });
                    setOpen(true);
                }}
            >
                {children ?? title}
            </a>
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
