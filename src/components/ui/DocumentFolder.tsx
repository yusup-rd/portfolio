import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";
import { FiFileText } from "react-icons/fi";
import type { PortfolioDocument } from "../../types/portfolio";
import Folder, { type FolderEntry } from "../Folder";
import DocumentReader from "./DocumentReader";

interface DocumentFolderProps {
    documents: PortfolioDocument[];
}

const subscribeTheme = (notify: () => void) => {
    const observer = new MutationObserver(notify);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
};
const getTheme = (): "dark" | "light" =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light";

const DocumentFolder = ({ documents }: DocumentFolderProps) => {
    const stage = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(300);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<PortfolioDocument | null>(null);
    const theme = useSyncExternalStore<"dark" | "light">(
        subscribeTheme,
        getTheme,
        () => "light",
    );
    const labelId = useId();
    const color = getComputedStyle(document.documentElement)
        .getPropertyValue("--folder-front")
        .trim();
    const items = useMemo(
        () =>
            documents.map((item) => ({
                title: item.title,
            })),
        [documents],
    );
    useEffect(() => {
        const element = stage.current;
        if (!element) return;
        const observer = new ResizeObserver(([entry]) => {
            if (entry) setWidth(entry.contentRect.width);
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);
    const select = (_item: FolderEntry, index: number) => {
        const item = documents[index];
        if (item) setSelected(item);
    };
    return (
        <section
            aria-labelledby={labelId}
            className="relative z-10 flex min-w-0 flex-col gap-3 border-t border-border pt-5"
        >
            <div className="flex items-center justify-between gap-3">
                <p
                    id={labelId}
                    className="flex items-center gap-2 text-sm font-medium"
                >
                    <FiFileText aria-hidden="true" />
                    University documents
                </p>
                <span className="text-xs text-text-secondary">
                    {documents.length} documents
                </span>
            </div>
            <div
                ref={stage}
                className="relative flex h-80 w-full items-center justify-center sm:h-88"
            >
                <Folder
                    label="UNITEN"
                    variant="matte"
                    mode="flap"
                    layout="spread"
                    theme={theme}
                    color={color}
                    items={items}
                    size={Math.min(
                        1.1,
                        Math.max(0.3, (width - 24) / (224 * 2.3)),
                    )}
                    open={open}
                    onOpenChange={setOpen}
                    onItemClick={select}
                    peek
                    intro
                    draggable
                    returnBounds={stage}
                    zoomOnClick={false}
                    closeOnOutsideClick={!selected}
                />
            </div>
            <p className="text-center text-xs text-text-secondary">
                {open
                    ? "Choose a document to read. Drag to explore."
                    : "Open the folder to explore certificates and records."}
            </p>
            {selected && (
                <DocumentReader
                    src={selected.src}
                    title={selected.title}
                    onClose={() => setSelected(null)}
                />
            )}
        </section>
    );
};

export default DocumentFolder;
