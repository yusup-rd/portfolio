import * as Dialog from "@radix-ui/react-dialog";
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
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
    const duration = reduced || instant ? 0.01 : motionTiming.dialog * 1000;
    const notified = useRef(false);
    const fallback = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    );
    const notify = useRef(onClose);
    useLayoutEffect(() => {
        notify.current = onClose;
    }, [onClose]);
    const finishClose = useCallback(() => {
        if (notified.current) return;
        notified.current = true;
        clearTimeout(fallback.current);
        notify.current();
    }, []);
    useEffect(() => {
        if (open) {
            notified.current = false;
            return;
        }
        fallback.current = setTimeout(finishClose, duration + 80);
        return () => clearTimeout(fallback.current);
    }, [open, duration, finishClose]);
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
                            "--dialog-duration": `${duration}ms`,
                        } as CSSProperties
                    }
                    onAnimationEnd={(event) => {
                        if (event.target === event.currentTarget && !open)
                            finishClose();
                    }}
                >
                    {children(() => close(), {
                        asChild: true,
                        onEscapeKeyDown: (event) => {
                            // Prevent Radix's second dismiss callback from overriding keyboard timing.
                            event.preventDefault();
                            close(true);
                        },
                        onPointerDownOutside: (event) => {
                            event.preventDefault();
                            const pointer = event.detail.originalEvent;
                            // Preserve Radix's context-menu behavior outside the panel.
                            if (
                                pointer.button === 2 ||
                                (pointer.button === 0 && pointer.ctrlKey)
                            )
                                return;
                            close(false);
                        },
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
