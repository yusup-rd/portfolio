import { useId } from "react";
import GlideSelect from "./GlideSelect";
interface SortSelectProps {
    value: string;
    onChange: (value: string) => void;
}
const options = [
    { value: "recent", label: "Most recent" },
    { value: "title", label: "Title" },
];
const SortSelect = ({ value, onChange }: SortSelectProps) => {
    const labelId = useId();
    return (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span id={labelId}>Sort by</span>
            <GlideSelect
                options={options}
                value={value}
                onChange={onChange}
                labelledBy={labelId}
            />
        </div>
    );
};
export default SortSelect;
