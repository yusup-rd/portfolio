import { FiArrowUpRight, FiGithub, FiX } from "react-icons/fi";
import type {
    ProjectModalControls,
    ProjectModalState,
} from "../../types/portfolio";
import AnimatedDialog from "../ui/AnimatedDialog";
import ImageCarousel from "../ui/ImageCarousel";
interface ProjectDetailProps extends ProjectModalControls {
    openModal: Extract<ProjectModalState, { state: true }>;
}
const ProjectDetail = ({ openModal, setOpenModal }: ProjectDetailProps) => {
    const project = openModal.project;
    return (
        <AnimatedDialog
            labelledBy="project-title"
            describedBy="project-description"
            onClose={() => setOpenModal({ state: false, project: null })}
        >
            {(close, dialogProps) => (
                <div
                    {...dialogProps}
                    className="project-dialog surface relative flex max-h-[90dvh] w-full max-w-220 flex-col overflow-hidden outline-none"
                    role="dialog"
                    aria-modal="true"
                    tabIndex={-1}
                >
                    <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
                        <p className="eyebrow">
                            Project overview / {project.date}
                        </p>
                        <button
                            className="icon-button"
                            aria-label="Close project"
                            onClick={close}
                        >
                            <FiX />
                        </button>
                    </div>
                    <div className="flex flex-col gap-7 overflow-y-auto p-6 sm:p-8">
                        <ImageCarousel
                            images={[
                                ...new Set(
                                    [
                                        project.image,
                                        ...(project.screenshots ?? []),
                                    ].filter(Boolean),
                                ),
                            ]}
                            title={project.title}
                        />
                        <div className="flex flex-col gap-4">
                            <p className="eyebrow text-primary">
                                {project.category.replaceAll("-", " ")}
                            </p>
                            <h2
                                id="project-title"
                                className="text-3xl font-semibold tracking-tight sm:text-4xl"
                            >
                                {project.title}
                            </h2>
                            <p
                                id="project-description"
                                className="text-base leading-relaxed text-text-secondary"
                            >
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span key={tag} className="tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <a
                                className="button button-primary"
                                href={project.github}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FiGithub aria-hidden="true" />
                                View source
                            </a>
                            {project.webapp ? (
                                <a
                                    className="button button-secondary"
                                    href={project.webapp}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Visit project
                                    <FiArrowUpRight aria-hidden="true" />
                                </a>
                            ) : (
                                <span className="inline-flex items-center px-3 text-sm text-text-secondary">
                                    Live preview unavailable
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AnimatedDialog>
    );
};
export default ProjectDetail;
