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
                type="button"
                aria-expanded={open}
                aria-controls={id}
                onClick={(event) => {
                    setInstant(event.detail === 0);
                    setOpen(!open);
                }}
            >
                {open ? "Read less" : label}
                <FiPlus
                    className={open ? "rotate-45" : ""}
                    aria-hidden="true"
                />
            </button>
            <AnimatedHeight id={id} open={open} instant={instant}>
                <div className="flex flex-col gap-4 pt-4">{children}</div>
            </AnimatedHeight>
        </div>
    );
};
export default AnimatedDisclosure;
