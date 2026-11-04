import { domAnimation, LazyMotion, m } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { motionTiming } from "../../utils/motion";
interface AnimatedHeightProps {
    open: boolean;
    children: ReactNode;
    instant?: boolean;
    id?: string;
    className?: string;
}
const AnimatedHeight = ({
    open,
    children,
    instant = false,
    id,
    className = "",
}: AnimatedHeightProps) => {
    const content = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);
    const reduced = useReducedMotion();
    useEffect(() => {
        const element = content.current;
        if (!element) return;
        let frame = 0;
        const observer = new ResizeObserver(([entry]) => {
            if (!entry) return;
            // Measure layout height, not the dialog entrance's transformed size.
            const nextHeight = entry.borderBoxSize?.[0]?.blockSize;
            // Resize the animated parent in the next frame to avoid observer loops.
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                // Older browsers need a layout read; keep it outside observer delivery.
                setHeight(nextHeight ?? element.offsetHeight);
            });
        });
        observer.observe(element);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    }, []);
    return (
        <LazyMotion features={domAnimation}>
            <m.div
                id={id}
                initial={false}
                animate={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
                transition={{
                    height: {
                        ...motionTiming.spring,
                        duration:
                            reduced || instant
                                ? 0
                                : motionTiming.spring.duration,
                    },
                    opacity: {
                        duration: reduced || instant ? 0 : motionTiming.fade,
                    },
                }}
                className={"overflow-hidden " + className}
                aria-hidden={!open}
                inert={!open}
            >
                <div ref={content}>{children}</div>
            </m.div>
        </LazyMotion>
    );
};
export default AnimatedHeight;
