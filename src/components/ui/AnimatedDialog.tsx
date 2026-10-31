import { Fade, Modal } from "@mui/material";
import { useState, type AriaAttributes, type ReactNode } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { motionTiming } from "../../utils/motion";
interface AnimatedDialogProps {
    labelledBy: string;
    describedBy?: string;
    onClose: () => void;
    children: (
        close: () => void,
        dialogProps: Pick<
            AriaAttributes,
            "aria-labelledby" | "aria-describedby"
        >,
    ) => ReactNode;
}
const AnimatedDialog = ({
    labelledBy,
    describedBy,
    onClose,
    children,
}: AnimatedDialogProps) => {
    const [open, setOpen] = useState(true);
    const [instant, setInstant] = useState(
        document.documentElement.dataset.input === "keyboard",
    );
    const reduced = useReducedMotion();
    const close = (
        keyboard = document.documentElement.dataset.input === "keyboard",
    ) => {
        setInstant(keyboard);
        setOpen(false);
    };
    return (
        <Modal
            open={open}
            onClose={(_, reason) => close(reason === "escapeKeyDown")}
            closeAfterTransition
        >
            <Fade
                in={open}
                timeout={reduced || instant ? 0 : motionTiming.dialog * 1000}
                easing={"cubic-bezier(" + motionTiming.ease.join(",") + ")"}
                onExited={onClose}
            >
                <div
                    className="dialog-position"
                    data-state={open ? "open" : "closed"}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) close(false);
                    }}
                >
                    {children(() => close(), {
                        "aria-labelledby": labelledBy,
                        "aria-describedby": describedBy,
                    })}
                </div>
            </Fade>
        </Modal>
    );
};
export default AnimatedDialog;
