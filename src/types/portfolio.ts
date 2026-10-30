import type { Dispatch, SetStateAction } from "react";

export interface Biography {
    name: string;
    roles: string[];
    description: string;
    github: string;
    resume: string;
    image: string;
    linkedin: string;
    telegram: string;
    instagram: string;
    facebook: string;
}

export interface SkillGroup {
    title: string;
    skills: { name: string; image: string }[];
}

export interface Experience {
    id: number;
    img: string;
    role: string;
    company: string;
    date: string;
    desc: string;
    skills: string[];
    doc?: string;
}

export interface Education {
    id: number;
    img: string;
    school: string;
    date: string;
    grade: string;
    desc: string;
    degree: string;
    doc?: string;
}

export type ProjectCategory =
    "front-end" | "back-end" | "full-stack" | "mobile" | "programming";

export interface Project {
    id: number;
    title: string;
    date: string;
    description: string;
    image: string;
    tags: string[];
    category: ProjectCategory;
    github: string;
    webapp: string;
    members?: { name: string; img: string; github: string; linkedin: string }[];
}

export type ProjectModalState =
    { state: false; project: null } | { state: true; project: Project };

export interface ProjectModalControls {
    setOpenModal: Dispatch<SetStateAction<ProjectModalState>>;
}

export interface ThemeControls {
    selectedThemeIndex: number;
    changeTheme: (index: number) => void;
}
