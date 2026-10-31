import * as Select from "@radix-ui/react-select";
import { useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
interface SortSelectProps {
    value: string;
    onChange: (value: string) => void;
}
const options = [
    { value: "recent", label: "Most recent" },
    { value: "title", label: "Title" },
];
const SortSelect = ({ value, onChange }: SortSelectProps) => {
    const [native] = useState(() =>
        /Mac|iPhone|iPad|iPod/i.test(
            navigator.platform + " " + navigator.userAgent,
        ),
    );
    return (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span id="sort-label">Sort by</span>
            {native ? (
                <select
                    aria-labelledby="sort-label"
                    className="rounded-lg border border-border bg-card p-3 text-text-primary"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {options.map((option) => (
                        <option value={option.value} key={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <Select.Root value={value} onValueChange={onChange}>
                    <Select.Trigger
                        aria-labelledby="sort-label"
                        className="button button-secondary min-w-40 justify-between"
                    >
                        <Select.Value />
                        <Select.Icon>
                            <FiChevronDown />
                        </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                        <Select.Content
                            position="popper"
                            sideOffset={8}
                            className="sort-menu z-50 min-w-44 rounded-2xl border border-border bg-card p-1.75 shadow-xl"
                        >
                            <Select.Viewport>
                                {options.map((option) => (
                                    <Select.Item
                                        value={option.value}
                                        key={option.value}
                                        className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-lg px-3 text-sm text-text-primary outline-none data-highlighted:bg-bg-light"
                                    >
                                        <Select.ItemText>
                                            {option.label}
                                        </Select.ItemText>
                                        <Select.ItemIndicator>
                                            <FiCheck />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                ))}
                            </Select.Viewport>
                        </Select.Content>
                    </Select.Portal>
                </Select.Root>
            )}
        </div>
    );
};
export default SortSelect;
