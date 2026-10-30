import type { Education } from "../../types/portfolio";

interface EducationCardProps {
    education: Education;
}

const EducationCard = ({ education }: EducationCardProps) => {
    return (
        <div className="group relative flex w-162.5 max-w-[calc(100dvw-4rem)] flex-col justify-between gap-3 overflow-hidden rounded-xl border-[0.1px] border-border2 px-4 pt-3 pb-5.5 shadow-[0_4px_24px_rgba(23,92,230,0.15)] transition-all duration-300 ease-in-out hover:-translate-y-1.25 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] max-md:w-75 max-md:gap-2">
            <div className="flex w-full gap-3">
                <img
                    className="size-12.5 shrink-0 rounded-xl bg-white object-contain max-md:size-10"
                    src={education.img}
                ></img>
                <div className="flex w-full flex-col">
                    <div className="text-lg font-semibold text-text-primary/60 max-md:text-sm">
                        {education.school}
                    </div>
                    <div className="text-sm font-medium text-text-secondary/60 max-md:text-xs">
                        {education.degree}
                    </div>
                    <div className="text-xs font-normal text-text-secondary/[50.2%] max-md:text-[10px]">
                        {education.date}
                    </div>
                </div>
            </div>
            <div className="text-sm font-medium text-text-secondary/60 max-md:text-xs">
                Grade: {education.grade}
            </div>
            <div className="w-full text-sm font-normal text-text-primary/60 max-md:text-xs">
                <span className="line-clamp-4 max-w-full text-ellipsis group-hover:line-clamp-none">
                    {education.desc}
                </span>
            </div>
            {education.doc && (
                <a
                    href={education.doc}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        className="hidden h-17.5 w-fit rounded-xl bg-black object-contain group-hover:flex hover:cursor-pointer hover:opacity-80"
                        src={education.doc}
                    />
                </a>
            )}
        </div>
    );
};

export default EducationCard;
