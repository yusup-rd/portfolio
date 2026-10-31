interface SectionHeadingProps {
    number: string;
    eyebrow: string;
    title: string;
    description?: string;
}
const SectionHeading = ({
    number,
    eyebrow,
    title,
    description,
}: SectionHeadingProps) => {
    return (
        <header
            className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
            data-reveal
        >
            <div className="flex flex-col gap-4">
                <p className="eyebrow">
                    <span className="text-primary">{number} /</span> {eyebrow}
                </p>
                <h2 className="text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
                    {title}
                </h2>
            </div>
            {description && (
                <p className="max-w-88 text-base leading-relaxed text-text-secondary">
                    {description}
                </p>
            )}
        </header>
    );
};
export default SectionHeading;
