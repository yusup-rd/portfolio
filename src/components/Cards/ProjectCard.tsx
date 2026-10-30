import type { Project, ProjectModalControls } from "../../types/portfolio";

interface ProjectCardProps extends ProjectModalControls {
    project: Project;
}

const ProjectCard = ({ project, setOpenModal }: ProjectCardProps) => {
    return (
        <div
            className="flex h-122.5 w-82.5 max-w-full cursor-pointer flex-col gap-3.5 overflow-hidden rounded-xl bg-card px-5 py-6.5 shadow-[3px_5px_15px_2px_rgba(0,0,0,0.4)] transition-all duration-500 ease-in-out hover:-translate-y-2.5 hover:shadow-[3px_5px_15px_2px_rgba(0,0,0,0.6)] hover:brightness-110"
            onClick={() => setOpenModal({ state: true, project: project })}
        >
            <img
                className="h-45 w-full rounded-xl bg-white object-cover shadow-[3px_5px_16px_2px_rgba(0,0,0,0.3)]"
                src={project.image}
            />
            <div className="flex w-full flex-wrap items-center gap-2 pt-1">
                {project.tags?.map((tag) => (
                    <span
                        className="rounded-xl bg-primary/[8.24%] px-2 py-0.5 text-xs font-normal text-primary"
                        key={tag}
                    >
                        {tag}
                    </span>
                ))}
            </div>
            <div className="flex w-full flex-col px-0.5">
                <div className="max-w-full truncate text-xl font-semibold text-text-secondary">
                    {project.title}
                </div>
                <div className="pl-0.5 text-xs font-normal text-text-secondary/[50.2%] max-md:text-[10px]">
                    {project.date}
                </div>
                <div className="line-clamp-3 max-w-full pt-2 font-normal text-text-secondary/60">
                    {project.description}
                </div>
            </div>
            <div className="flex items-center pl-2.5">
                {project.members?.map((member, index) => (
                    <img
                        className="-ml-2.5 size-7.5 rounded-full border-[3px] border-card bg-white shadow-[0_0_16px_2px_rgba(0,0,0,0.2)]"
                        key={index}
                        src={member.img}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectCard;
