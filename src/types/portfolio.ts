import type { Dispatch, SetStateAction } from "react";

export interface Biography {
    github: string;
    resume: string;
    image: string;
    linkedin: string;
    telegram: string;
    instagram: string;
}

export interface SkillGroup {
    title: string;
    skills: { name: string; image: string }[];
}

export interface Experience {
    id: number;
    role: string;
    company: string;
    date: string;
    desc: string;
    skills: string[];
}

export interface PortfolioDocument {
    title: string;
    src: string;
}

export interface Education {
    documents?: PortfolioDocument[];
    id: number;
    school: string;
    date: string;
    grade: string;
    desc: string;
    degree: string;
}

export type ProjectCategory = "back-end" | "full-stack" | "mobile";

export interface Project {
    screenshots?: string[];
    imageFit?: "contain" | "cover";
    id: number;
    title: string;
    date: string;
    description: string;
    image: string;
    tags: string[];
    category: ProjectCategory;
    github: string;
    webapp: string;
}

export type ProjectModalState =
    { state: false; project: null } | { state: true; project: Project };

export interface ProjectModalControls {
    setOpenModal: Dispatch<SetStateAction<ProjectModalState>>;
}
