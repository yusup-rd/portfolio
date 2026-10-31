import { LazyMotion, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import { Bio, projects } from "../../data/constants";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { ProjectModalControls } from "../../types/portfolio";
import { motionTiming } from "../../utils/motion";
import ProjectCard from "../Cards/ProjectCard";
import RubberSegment from "../ui/RubberSegment";
import SectionHeading from "../ui/SectionHeading";
import SortSelect from "../ui/SortSelect";
const projectFilters = [
    { value: "all", label: "All projects", compactLabel: "All" },
    { value: "full-stack", label: "Full-stack" },
    { value: "mobile", label: "Mobile" },
    { value: "back-end", label: "Backend" },
] as const;
const loadMotionFeatures = () =>
    import("../ui/motionFeatures").then((module) => module.default);

interface ProjectsProps {
    setOpenModal: ProjectModalControls["setOpenModal"];
}
const Projects = ({ setOpenModal }: ProjectsProps) => {
    const [expanded, setExpanded] = useState(false);
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("recent");
    const featured = [13, 12, 14].flatMap((id) =>
        projects.filter((p) => p.id === id),
    );
    const gallery = useRef<HTMLDivElement>(null);
    const returnPosition = useRef(0);
    const restoring = useRef(false);
    const reduceMotion = useReducedMotion();
    const [instant, setInstant] = useState(false);
    const [height, setHeight] = useState<number | null>(null);
    useEffect(() => {
        if (!gallery.current) return;
        const observer = new ResizeObserver(([entry]) => {
            if (entry) setHeight(entry.contentRect.height);
        });
        observer.observe(gallery.current);
        return () => observer.disconnect();
    }, []);
    const toggleGallery = (keyboard: boolean) => {
        setInstant(keyboard || Boolean(reduceMotion));
        if (!expanded) returnPosition.current = scrollY;
        else {
            restoring.current = true;
            window.scrollTo({
                top: returnPosition.current,
                behavior: keyboard || reduceMotion ? "instant" : "smooth",
            });
        }
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
            <LazyMotion features={loadMotionFeatures}>
                <m.div
                    initial={false}
                    animate={{ height: height ?? "auto" }}
                    transition={{
                        type: "spring",
                        bounce: 0,
                        duration:
                            instant || reduceMotion
                                ? 0
                                : motionTiming.spring.duration,
                    }}
                    className="overflow-hidden"
                    onAnimationComplete={() => {
                        if (restoring.current) {
                            window.scrollTo({
                                top: returnPosition.current,
                                behavior: "instant",
                            });
                            restoring.current = false;
                        }
                    }}
                >
                    <div ref={gallery} className="flex flex-col gap-8">
                        {expanded && (
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <RubberSegment
                                    items={projectFilters}
                                    value={category}
                                    onChange={setCategory}
                                    label="Filter projects"
                                />
                                <SortSelect value={sort} onChange={setSort} />
                            </div>
                        )}
                        <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                            {visible.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    setOpenModal={setOpenModal}
                                />
                            ))}
                        </div>
                    </div>
                </m.div>
            </LazyMotion>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-7">
                <button
                    className="button button-secondary"
                    type="button"
                    aria-expanded={expanded}
                    onClick={(event) => toggleGallery(event.detail === 0)}
                >
                    {expanded ? "Show selected work" : "Explore all projects"}
                    <FiArrowDown
                        className={expanded ? "rotate-180" : ""}
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
