import { FiArrowUpRight } from "react-icons/fi";
import type { Project, ProjectModalControls } from "../../types/portfolio";
interface ProjectCardProps extends ProjectModalControls {
    project: Project;
}
const ProjectCard = ({ project, setOpenModal }: ProjectCardProps) => {
    return (
        <button
            type="button"
            onClick={() => setOpenModal({ state: true, project })}
            className="project-card group flex w-full flex-col gap-5 text-left"
        >
            <div className="project-image">
                {project.image ? (
                    <img
                        src={project.image}
                        alt={project.title + " application preview"}
                        loading="lazy"
                        className={
                            project.imageFit === "contain"
                                ? "size-full object-contain p-3"
                                : "size-full object-cover"
                        }
                    />
                ) : (
                    <div className="flex size-full items-center justify-center p-8 text-center text-2xl font-semibold">
                        {project.title}
                    </div>
                )}
                <span className="project-open" aria-hidden="true">
                    <FiArrowUpRight />
                </span>
            </div>
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <p className="eyebrow text-primary">
                        {project.category.replaceAll("-", " ")} / {project.date}
                    </p>
                    <h3 className="text-2xl font-semibold tracking-tight">
                        {project.title}
                    </h3>
                </div>
                <span className="text-text-secondary" aria-hidden="true">
                    ↗
                </span>
            </div>
            <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary">
                {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 4).map((tag) => (
                    <span className="tag" key={tag}>
                        {tag}
                    </span>
                ))}
            </div>
        </button>
    );
};
export default ProjectCard;
