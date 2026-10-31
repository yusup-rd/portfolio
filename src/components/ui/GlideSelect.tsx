// Adapted from React Bits Glide Select by David Haz. See THIRD_PARTY_NOTICES.md.
import * as Select from "@radix-ui/react-select";
import { useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { useReducedMotion } from "../../hooks/useReducedMotion";
interface GlideSelectOption {
    value: string;
    label: string;
}
interface GlideSelectProps {
    options: readonly GlideSelectOption[];
    value: string;
    onChange: (value: string) => void;
    labelledBy: string;
}
const GlideSelect = ({
    options,
    value,
    onChange,
    labelledBy,
}: GlideSelectProps) => {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(value);
    const [keyboard, setKeyboard] = useState(false);
    const reduced = useReducedMotion();
    const instant = keyboard || reduced;
    const index = Math.max(
        0,
        options.findIndex((option) => option.value === active),
    );
    return (
        <Select.Root
            value={value}
            onValueChange={onChange}
            open={open}
            onOpenChange={(next) => {
                if (next) setActive(value);
                setOpen(next);
            }}
        >
            <Select.Trigger
                aria-labelledby={labelledBy}
                data-instant={instant}
                className="glide-select-trigger group flex min-h-11 min-w-40 items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-text-primary outline-offset-4"
                onPointerDown={() => setKeyboard(false)}
                onKeyDown={() => setKeyboard(true)}
            >
                <Select.Value>
                    <span
                        key={value}
                        className="glide-select-value"
                        data-instant={instant}
                    >
                        {
                            options.find((option) => option.value === value)
                                ?.label
                        }
                    </span>
                </Select.Value>
                <Select.Icon>
                    <FiChevronDown
                        aria-hidden="true"
                        className="transition-transform duration-200 ease-out group-data-[state=open]:rotate-180 motion-reduce:transition-none"
                    />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content
                    // Keyboard/reduced-motion closes must bypass a pending animated exit.
                    key={!open && instant ? "closed-instantly" : "animated"}
                    position="popper"
                    sideOffset={8}
                    align="start"
                    collisionPadding={12}
                    className="glide-select-menu z-50 min-w-44 rounded-2xl border border-border bg-card p-1.75 text-text-primary shadow-xl"
                    data-instant={instant}
                    onKeyDownCapture={() => setKeyboard(true)}
                    onPointerDownOutside={() => setKeyboard(false)}
                    onPointerMoveCapture={(event) => {
                        if (event.pointerType !== "touch") setKeyboard(false);
                    }}
                >
                    <Select.Viewport className="relative flex max-h-72 flex-col gap-1">
                        <span
                            aria-hidden="true"
                            className="glide-select-highlight pointer-events-none absolute inset-x-0 top-0 h-11 rounded-lg bg-bg-light"
                            data-instant={instant}
                            // h-11 rows + gap-1 = 3rem, preserving rem-based browser scaling.
                            style={{ transform: `translateY(${index * 3}rem)` }}
                        />
                        {options.map((option) => (
                            <Select.Item
                                key={option.value}
                                value={option.value}
                                className="relative flex h-11 shrink-0 cursor-pointer items-center justify-between gap-4 rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors duration-150 ease-out outline-none data-highlighted:text-text-primary data-[state=checked]:text-text-primary motion-reduce:transition-none"
                                onFocus={() => setActive(option.value)}
                                onPointerMove={(event) => {
                                    if (event.pointerType !== "touch")
                                        setActive(option.value);
                                }}
                            >
                                <Select.ItemText>
                                    {option.label}
                                </Select.ItemText>
                                <span
                                    className="flex size-4 items-center justify-center"
                                    aria-hidden="true"
                                >
                                    <Select.ItemIndicator>
                                        <FiCheck />
                                    </Select.ItemIndicator>
                                </span>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
};
export default GlideSelect;
