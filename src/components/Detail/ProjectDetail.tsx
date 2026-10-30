import CloseRounded from "@mui/icons-material/CloseRounded";
import GitHub from "@mui/icons-material/GitHub";
import LinkedIn from "@mui/icons-material/LinkedIn";
import { Modal } from "@mui/material";
import type {
    ProjectModalControls,
    ProjectModalState,
} from "../../types/portfolio";

interface ProjectDetailProps extends ProjectModalControls {
    openModal: Extract<ProjectModalState, { state: true }>;
}

const ProjectDetail = ({ openModal, setOpenModal }: ProjectDetailProps) => {
    const project = openModal?.project;
    const isWebAppLinkEmpty = !project?.webapp;
    return (
        <Modal
            open={true}
            onClose={() => setOpenModal({ state: false, project: null })}
        >
            <div className="absolute top-0 left-0 flex size-full items-center justify-center overflow-y-auto bg-[#000000a7] px-3 py-4 transition-all duration-500 ease-[ease] outline-none">
                <div className="relative m-auto flex max-h-[90dvh] w-full max-w-200 flex-col gap-2 overflow-hidden rounded-2xl bg-card px-5 pt-11 pb-5 text-text-primary shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
                    <CloseRounded
                        className="absolute! top-2.5! right-5! cursor-pointer"
                        onClick={() =>
                            setOpenModal({ state: false, project: null })
                        }
                    />
                    <div className="flex max-h-[42dvh] min-h-0 w-full flex-none items-center justify-center overflow-hidden rounded-xl bg-bg-light">
                        <img
                            className="block h-auto max-h-[42dvh] w-auto max-w-full rounded-xl object-contain shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                            src={project?.image}
                            alt={project?.title}
                        />
                    </div>
                    <div className="project-detail-scroll min-h-0 flex-auto overflow-y-auto pr-1">
                        <div className="px-1.5 pt-2 text-3xl font-semibold text-text-primary max-sm:pt-1.5 max-sm:text-2xl">
                            {project?.title}
                        </div>
                        <div className="px-1.5 py-0.5 text-base font-normal text-text-secondary max-md:text-xs">
                            {project.date}
                        </div>
                        <div className="flex flex-wrap gap-2 px-1 py-3 max-sm:py-2">
                            {project?.tags.map((tag, index) => (
                                <div
                                    className="rounded-lg bg-primary/[12.55%] px-2 py-1 text-sm font-normal text-primary max-sm:text-xs"
                                    key={index}
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>
                        <div className="px-1.5 py-2 text-base font-normal text-text-primary max-sm:py-1.5 max-sm:text-sm">
                            {project?.description}
                        </div>
                        {project.members && (
                            <>
                                <div className="px-1.5 py-2 text-xl font-semibold text-text-primary max-sm:text-base">
                                    Members
                                </div>
                                <div className="flex flex-col flex-wrap gap-1.5 px-1.5 py-3 max-sm:py-1">
                                    {project?.members.map((member, index) => (
                                        <div
                                            className="flex items-center gap-3 pb-1"
                                            key={index}
                                        >
                                            <img
                                                className="size-12.5 rounded-full object-cover shadow-[0_0_10px_rgba(0,0,0,0.3)] max-sm:size-8"
                                                src={member.img}
                                            />
                                            <div className="w-50 text-base font-medium text-text-primary max-sm:text-sm">
                                                {member.name}
                                            </div>
                                            <a
                                                href={member.github}
                                                target="new"
                                                className="text-inherit no-underline"
                                            >
                                                <GitHub />
                                            </a>
                                            <a
                                                href={member.linkedin}
                                                target="new"
                                                className="text-inherit no-underline"
                                            >
                                                <LinkedIn />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        <div className="flex justify-end gap-3 py-3">
                            <a
                                className="w-full cursor-pointer rounded-lg bg-primary px-4 py-3 text-center text-base font-semibold text-text-primary no-underline transition-all duration-500 ease-[ease] hover:bg-primary/60 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:line-through aria-disabled:opacity-60 data-[dull=true]:bg-bg-light data-[dull=true]:text-text-secondary data-[dull=true]:hover:bg-primary/60 max-sm:text-xs"
                                href={project?.github}
                                target="_blank"
                            >
                                View Code
                            </a>
                            <a
                                className="w-full cursor-pointer rounded-lg bg-primary px-4 py-3 text-center text-base font-semibold text-text-primary no-underline transition-all duration-500 ease-[ease] hover:bg-primary/60 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:line-through aria-disabled:opacity-60 data-[dull=true]:bg-bg-light data-[dull=true]:text-text-secondary data-[dull=true]:hover:bg-primary/60 max-sm:text-xs"
                                data-dull={true}
                                aria-disabled={isWebAppLinkEmpty}
                                tabIndex={isWebAppLinkEmpty ? -1 : undefined}
                                href={project.webapp || undefined}
                                target="_blank"
                            >
                                View Live App
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ProjectDetail;
