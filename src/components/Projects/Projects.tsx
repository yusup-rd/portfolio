import {
    AnimatePresence,
    domMax,
    LazyMotion,
    m,
    useIsPresent,
} from "motion/react";
import { useRef, useState, type ReactNode, type Ref } from "react";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import { Bio, projects } from "../../data/constants";
import { useProjectGalleryMotion } from "../../hooks/useProjectGalleryMotion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { ProjectModalControls } from "../../types/portfolio";
import { motionTiming } from "../../utils/motion";
import ProjectCard from "../Cards/ProjectCard";
import RubberSegment from "../ui/RubberSegment";
import SectionHeading from "../ui/SectionHeading";
import SortSelect from "../ui/SortSelect";
const projectFilters = [
    {
        value: "all",
        ariaLabel: "All projects",
        label: (
            <>
                <span className="sm:hidden">All</span>
                <span className="hidden sm:inline">All projects</span>
            </>
        ),
    },
    { value: "full-stack", label: "Full-stack" },
    { value: "mobile", label: "Mobile" },
    { value: "back-end", label: "Backend" },
] as const;
interface ProjectsProps {
    setOpenModal: ProjectModalControls["setOpenModal"];
}
interface GalleryItemProps {
    children: ReactNode;
    instant: boolean;
    ref?: Ref<HTMLDivElement>;
    className?: string;
}
const exit = (instant: boolean) => ({
    opacity: 0,
    transition: { duration: instant ? 0 : motionTiming.fade },
});
const GalleryItem = ({
    children,
    instant,
    ref,
    className = "min-w-0",
}: GalleryItemProps) => {
    const present = useIsPresent();
    return (
        <m.div
            ref={ref}
            layout="position"
            initial={instant ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit="exit"
            variants={{ exit }}
            transition={{
                duration: instant ? 0 : motionTiming.fade,
                layout: {
                    duration: instant ? 0 : motionTiming.spring.duration,
                    ease: motionTiming.ease,
                },
            }}
            inert={!present}
            className={className}
        >
            {children}
        </m.div>
    );
};
const Projects = ({ setOpenModal }: ProjectsProps) => {
    const [expanded, setExpanded] = useState(false);
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("recent");
    const featured = [13, 12, 14].flatMap((id) =>
        projects.filter((p) => p.id === id),
    );
    const returnPosition = useRef(0);
    const reduceMotion = useReducedMotion();
    const [keyboard, setKeyboard] = useState(false);
    const instant = keyboard || reduceMotion;
    const { viewport, content, restoreScroll } = useProjectGalleryMotion(
        `${expanded}:${category}:${sort}`,
        instant,
    );
    const prepareChange = () => {
        setKeyboard(document.documentElement.dataset.input === "keyboard");
        restoreScroll(null);
    };
    const toggleGallery = (keyboard: boolean) => {
        setKeyboard(keyboard);
        if (!expanded) returnPosition.current = scrollY;
        restoreScroll(expanded ? returnPosition.current : null);
        setExpanded(!expanded);
    };
    const visible = expanded
        ? [...projects]
              .filter((p) => category === "all" || p.category === category)
              .sort((a, b) =>
                  sort === "title"
                      ? a.title.localeCompare(b.title)
                      : b.id - a.id,
              )
        : featured;
    return (
        <section
            id="projects"
            className="page-shell section-space flex flex-col gap-10"
        >
            <SectionHeading
                number="01"
                eyebrow="Selected work"
                title="Ideas, made tangible."
                description="A selection of applications exploring useful products, considered interfaces, and the systems underneath."
            />
            <LazyMotion features={domMax}>
                <div
                    ref={viewport}
                    id="project-gallery"
                    className="overflow-clip"
                >
                    <div ref={content} className="relative flex flex-col gap-8">
                        <AnimatePresence
                            initial={false}
                            mode="popLayout"
                            custom={instant}
                        >
                            {expanded && (
                                <GalleryItem
                                    key="controls"
                                    instant={instant}
                                    className="flex flex-wrap items-center justify-between gap-4"
                                >
                                    <RubberSegment
                                        items={projectFilters}
                                        value={category}
                                        onChange={(value) => {
                                            prepareChange();
                                            setCategory(value);
                                        }}
                                        aria-label="Filter projects"
                                        trackColor="var(--page)"
                                        thumbColor="var(--accent)"
                                        textColor="var(--ink)"
                                        activeTextColor="var(--button-ink)"
                                        size="lg"
                                        radius={16}
                                        inset={4}
                                        className="rubber-segment w-full sm:w-auto"
                                    />
                                    <SortSelect
                                        value={sort}
                                        onChange={(value) => {
                                            prepareChange();
                                            setSort(value);
                                        }}
                                    />
                                </GalleryItem>
                            )}
                        </AnimatePresence>
                        <m.div
                            layout="position"
                            transition={{
                                duration: instant
                                    ? 0
                                    : motionTiming.spring.duration,
                                ease: motionTiming.ease,
                            }}
                            className="relative grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
                        >
                            <AnimatePresence
                                initial={false}
                                mode="popLayout"
                                custom={instant}
                            >
                                {visible.map((project) => (
                                    <GalleryItem
                                        key={project.id}
                                        instant={instant}
                                    >
                                        <ProjectCard
                                            project={project}
                                            setOpenModal={setOpenModal}
                                        />
                                    </GalleryItem>
                                ))}
                            </AnimatePresence>
                        </m.div>
                    </div>
                </div>
            </LazyMotion>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-7">
                <button
                    className="button button-secondary"
                    type="button"
                    aria-expanded={expanded}
                    aria-controls="project-gallery"
                    onClick={(event) => toggleGallery(event.detail === 0)}
                >
                    {expanded ? "Show selected work" : "Explore all projects"}
                    <FiArrowDown
                        className={`${expanded ? "rotate-180" : "rotate-0"} transition-transform duration-200 ease-out motion-reduce:transition-none`}
                        style={{
                            transitionDuration: instant ? "0s" : undefined,
                        }}
                        aria-hidden="true"
                    />
                </button>
                <a
                    className="text-link"
                    href={Bio.github}
                    target="_blank"
                    rel="noreferrer"
                >
                    More on GitHub <FiArrowUpRight aria-hidden="true" />
                </a>
            </div>
        </section>
    );
};
export default Projects;
