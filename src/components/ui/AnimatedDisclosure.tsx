import { useId, useState, type ReactNode } from "react";
import { FiPlus } from "react-icons/fi";
import AnimatedHeight from "./AnimatedHeight";
interface AnimatedDisclosureProps {
    children: ReactNode;
    label?: string;
}
const AnimatedDisclosure = ({
    children,
    label = "Read more",
}: AnimatedDisclosureProps) => {
    const [open, setOpen] = useState(false);
    const [instant, setInstant] = useState(false);
    const id = useId();
    return (
        <div className="animated-disclosure">
            <button
                className="disclosure-trigger"
                data-open={open}
                data-instant={instant}
                aria-label={open ? "Read less" : label}
                type="button"
                aria-expanded={open}
                aria-controls={id}
                onClick={(event) => {
                    setInstant(event.detail === 0);
                    setOpen(!open);
                }}
            >
                <span aria-hidden="true">
                    {label === "Read more" ? (
                        <span className="inline-flex items-center gap-1">
                            Read{" "}
                            <span className="relative inline-grid overflow-hidden align-bottom">
                                <span
                                    className="disclosure-word col-start-1 row-start-1"
                                    data-active={!open}
                                >
                                    more
                                </span>
                                <span
                                    className="disclosure-word col-start-1 row-start-1"
                                    data-active={open}
                                >
                                    less
                                </span>
                            </span>
                        </span>
                    ) : open ? (
                        "Read less"
                    ) : (
                        label
                    )}
                </span>
                <FiPlus className="disclosure-icon" aria-hidden="true" />
            </button>
            <AnimatedHeight id={id} open={open} instant={instant}>
                <div className="flex flex-col gap-4 pt-4">{children}</div>
            </AnimatedHeight>
        </div>
    );
};
export default AnimatedDisclosure;
