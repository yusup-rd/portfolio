import React, { useState } from "react";
import type {
    Project,
    ProjectCategory,
    ProjectModalControls,
} from "../../types/portfolio";

import "aos/dist/aos.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { projects } from "../../data/constants";
import ProjectCard from "../Cards/ProjectCard";

type SortBy = "title" | "tags" | "date";

interface ProjectsProps {
    setOpenModal: ProjectModalControls["setOpenModal"];
}

const Projects = ({ setOpenModal }: ProjectsProps) => {
    const [category, setCategory] = useState<ProjectCategory | "all">("all");
    const [sortBy, setSortBy] = useState<SortBy | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>("asc");
    const [sortCount, setSortCount] = useState(0);

    const categories: (ProjectCategory | "all")[] = [
        "all",
        ...new Set(projects.map((p) => p.category)),
    ];

    const handleSortBy = (sortByType: SortBy) => {
        if (sortByType === sortBy) {
            setSortOrder((prev) => {
                if (prev === "asc") return "desc";
                if (prev === "desc") return null;
                return "asc";
            });
            setSortCount((prevCount) => prevCount + 1);
            if (sortCount === 2) {
                setSortBy(null);
                setSortOrder("asc");
                setSortCount(0);
            }
        } else {
            setSortBy(sortByType);
            setSortOrder("asc");
            setSortCount(1);
        }
    };

    const sortIcon = (sortByType: SortBy) => {
        if (sortBy === sortByType) {
            if (sortOrder === "asc") return <FaChevronUp className="pl-1" />;
            if (sortOrder === "desc") return <FaChevronDown className="pl-1" />;
        }
        return null;
    };

    const sortProjects = (source: Project[]) => {
        const projectsArray = [...source];
        if (sortBy === "title") {
            return projectsArray.sort((a, b) =>
                sortOrder === "asc"
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title),
            );
        } else if (sortBy === "tags") {
            return projectsArray.sort((a, b) =>
                sortOrder === "asc"
                    ? a.tags.length - b.tags.length
                    : b.tags.length - a.tags.length,
            );
        } else if (sortBy === "date") {
            const monthOrder = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ];
            return projectsArray.sort((a, b) => {
                const [monthA = "", yearA = ""] = a.date.split(" ");
                const [monthB = "", yearB = ""] = b.date.split(" ");
                const yearComparison = parseInt(yearA) - parseInt(yearB);
                if (yearComparison !== 0) {
                    return sortOrder === "asc"
                        ? yearComparison
                        : -yearComparison;
                } else {
                    const monthIndexA = monthOrder.indexOf(monthA);
                    const monthIndexB = monthOrder.indexOf(monthB);
                    return sortOrder === "asc"
                        ? monthIndexA - monthIndexB
                        : monthIndexB - monthIndexA;
                }
            });
        }
        return projectsArray.sort((a, b) => a.id - b.id);
    };

    return (
        <div
            className="projects-gradient relative z-1 flex flex-col items-center justify-center [clip-path:polygon(0_0,100%_0,100%_100%,100%_98%,0_100%)]"
            id="projects"
        >
            <div className="relative flex w-full max-w-337.5 flex-col items-center justify-center gap-4.25 pt-7.5 pb-25 max-md:pt-5.5">
                <div className="flex flex-col items-center gap-3">
                    <div className="text-center text-4xl font-semibold text-text-primary max-md:text-3xl">
                        Projects
                    </div>
                    <div className="max-w-150 text-center text-lg text-text-secondary max-md:px-3.75 max-md:text-base">
                        Here you can explore some of my projects. Click on a
                        project to see the details.
                    </div>
                    <div className="max-w-150 pt-3.75 text-center text-base text-text-primary max-md:px-3.75 max-md:text-sm">
                        Category
                    </div>
                </div>
                <div className="flex rounded-xl border-[1.5px] border-primary text-base font-medium text-primary max-md:text-xs">
                    {categories.map((cat, index) => (
                        <React.Fragment key={cat}>
                            <div
                                className="cursor-pointer px-4.5 py-2 transition-all duration-200 ease-in-out first:rounded-l-xl last:rounded-r-xl hover:bg-primary/[8.24%] data-[active=true]:bg-primary/[12.55%] data-[active=true]:hover:bg-primary/[8.24%] max-md:rounded-sm max-md:px-2 max-md:py-1.5"
                                onClick={() => setCategory(cat)}
                                data-active={category === cat}
                            >
                                {cat.toUpperCase()}
                            </div>
                            {index < categories.length - 1 && (
                                <div className="w-0.375 bg-primary" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <div className="max-w-150 pt-3.75 text-center text-base text-text-primary max-md:px-3.75 max-md:text-sm">
                    Sort by
                </div>
                <div className="flex rounded-xl border-[1.5px] border-primary text-base font-medium text-primary max-md:text-xs">
                    <div
                        className="cursor-pointer px-4.5 py-2 transition-all duration-200 ease-in-out first:rounded-l-xl last:rounded-r-xl hover:bg-primary/[8.24%] data-[active=true]:bg-primary/[12.55%] data-[active=true]:hover:bg-primary/[8.24%] max-md:rounded-sm max-md:px-2 max-md:py-1.5"
                        onClick={() => handleSortBy("title")}
                        data-active={sortBy === "title"}
                    >
                        <span className="inline-flex items-center align-middle">
                            Title {sortIcon("title")}
                        </span>
                    </div>
                    <div className="w-0.375 bg-primary" />
                    <div
                        className="cursor-pointer px-4.5 py-2 transition-all duration-200 ease-in-out first:rounded-l-xl last:rounded-r-xl hover:bg-primary/[8.24%] data-[active=true]:bg-primary/[12.55%] data-[active=true]:hover:bg-primary/[8.24%] max-md:rounded-sm max-md:px-2 max-md:py-1.5"
                        onClick={() => handleSortBy("date")}
                        data-active={sortBy === "date"}
                    >
                        <span className="inline-flex items-center align-middle">
                            Date {sortIcon("date")}
                        </span>
                    </div>
                    <div className="w-0.375 bg-primary" />
                    <div
                        className="cursor-pointer px-4.5 py-2 transition-all duration-200 ease-in-out first:rounded-l-xl last:rounded-r-xl hover:bg-primary/[8.24%] data-[active=true]:bg-primary/[12.55%] data-[active=true]:hover:bg-primary/[8.24%] max-md:rounded-sm max-md:px-2 max-md:py-1.5"
                        onClick={() => handleSortBy("tags")}
                        data-active={sortBy === "tags"}
                    >
                        <span className="inline-flex items-center align-middle">
                            Tags {sortIcon("tags")}
                        </span>
                    </div>
                </div>
                <div className="flex w-full flex-wrap items-center justify-center gap-7">
                    {sortProjects(
                        category === "all"
                            ? projects
                            : projects.filter(
                                  (project) => project.category === category,
                              ),
                    ).map((project, index) => (
                        <ProjectCard
                            key={index}
                            project={project}
                            setOpenModal={setOpenModal}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Projects;
