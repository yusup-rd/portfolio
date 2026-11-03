import * as Dialog from "@radix-ui/react-dialog";
import {
    useState,
    type ComponentPropsWithoutRef,
    type CSSProperties,
    type ReactNode,
} from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { motionTiming } from "../../utils/motion";
interface AnimatedDialogProps {
    onClose: () => void;
    children: (
        close: () => void,
        dialogProps: ComponentPropsWithoutRef<typeof Dialog.Content>,
    ) => ReactNode;
}
const AnimatedDialog = ({ onClose, children }: AnimatedDialogProps) => {
    const [open, setOpen] = useState(true);
    const [instant, setInstant] = useState(
        document.documentElement.dataset.input === "keyboard",
    );
    const [opener] = useState(() => document.activeElement);
    const reduced = useReducedMotion();
    const close = (
        keyboard = document.documentElement.dataset.input === "keyboard",
    ) => {
        setInstant(keyboard);
        setOpen(false);
    };
    return (
        <Dialog.Root
            open={open}
            onOpenChange={(next) => {
                if (!next) close();
            }}
        >
            <Dialog.Portal>
                <Dialog.Overlay
                    className="dialog-position"
                    style={
                        {
                            "--dialog-duration": `${reduced || instant ? 0.01 : motionTiming.dialog * 1000}ms`,
                        } as CSSProperties
                    }
                    onAnimationEnd={(event) => {
                        if (event.target === event.currentTarget && !open)
                            onClose();
                    }}
                >
                    {children(() => close(), {
                        asChild: true,
                        onEscapeKeyDown: () => close(true),
                        onCloseAutoFocus: (event) => {
                            event.preventDefault();
                            if (
                                opener instanceof HTMLElement &&
                                opener.isConnected
                            )
                                opener.focus({ preventScroll: true });
                        },
                    })}
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
export default AnimatedDialog;
