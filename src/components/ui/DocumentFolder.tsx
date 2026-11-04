import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { PortfolioDocument } from "../../types/portfolio";
import Folder, { type FolderEntry } from "../Folder";
import DocumentList from "./DocumentList";
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

// Match Tailwind's sm breakpoint; desktop keeps the upstream paper size.
const mobileQuery = "(width < 40rem)";
const subscribeMobile = (notify: () => void) => {
    const media = matchMedia(mobileQuery);
    media.addEventListener("change", notify);
    return () => media.removeEventListener("change", notify);
};
const getMobile = () => matchMedia(mobileQuery).matches;

const DocumentFolder = ({ documents }: DocumentFolderProps) => {
    const stage = useRef<HTMLDivElement>(null);
    const keyboardInput = useRef(false);
    const [width, setWidth] = useState(300);
    const [open, setOpen] = useState(false);
    const [instant, setInstant] = useState(false);
    const reduced = useReducedMotion();
    const [selected, setSelected] = useState<PortfolioDocument | null>(null);
    const theme = useSyncExternalStore<"dark" | "light">(
        subscribeTheme,
        getTheme,
        () => "light",
    );
    const mobile = useSyncExternalStore(
        subscribeMobile,
        getMobile,
        () => false,
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
        if (item) {
            stage.current
                ?.querySelector<HTMLElement>(`[data-folder-item="${index}"]`)
                ?.focus({ preventScroll: true });
            setSelected(item);
        }
    };
    return (
        <section
            aria-labelledby={labelId}
            className="relative z-10 flex min-w-0 flex-col gap-3 border-t border-border pt-3"
            onKeyDownCapture={() => {
                keyboardInput.current = true;
            }}
            onPointerDownCapture={() => {
                keyboardInput.current = false;
            }}
        >
            <DocumentList documents={documents} labelId={labelId} />
            <div
                ref={stage}
                className="relative flex h-80 w-full items-center justify-center sm:h-88"
            >
                <Folder
                    label="UNITEN"
                    variant="matte"
                    mode="flap"
                    layout="spread"
                    openItemScale={mobile ? 1.5 : 1}
                    paperResolution={2}
                    theme={theme}
                    color={color}
                    items={items}
                    size={Math.min(
                        1.1,
                        Math.max(0.3, (width - 24) / (224 * 2.3)),
                    )}
                    open={open}
                    onOpenChange={(next) => {
                        setInstant(keyboardInput.current);
                        setOpen(next);
                    }}
                    onItemClick={select}
                    peek
                    intro
                    draggable
                    returnBounds={stage}
                    zoomOnClick={false}
                    closeOnOutsideClick={!selected}
                />
            </div>
            <div className="grid text-center text-xs text-text-secondary">
                <p
                    aria-hidden={open}
                    className={`${open ? "opacity-0" : "opacity-100"} col-start-1 row-start-1 transition-opacity duration-200 ease-out`}
                    style={{
                        transitionDuration:
                            instant || reduced ? "0s" : undefined,
                    }}
                >
                    Open the folder to explore certificates and records.
                </p>
                <p
                    aria-hidden={!open}
                    className={`${open ? "opacity-100" : "opacity-0"} col-start-1 row-start-1 transition-opacity duration-200 ease-out`}
                    style={{
                        transitionDuration:
                            instant || reduced ? "0s" : undefined,
                    }}
                >
                    Choose a document to read. Drag to explore.
                </p>
            </div>
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
