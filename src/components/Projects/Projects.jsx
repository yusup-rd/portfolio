import React, { useState } from "react";
import styled from "styled-components";
import ProjectCard from "../Cards/ProjectCard";
import { projects } from "../../data/constants";
import "aos/dist/aos.css";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";

const Section = styled.div`
    background: linear-gradient(
        343.07deg,
        rgba(132, 59, 206, 0.06) 5.71%,
        rgba(132, 59, 206, 0) 64.83%
    );
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 98%, 0 100%);
`;
const Wrapper = styled.div`
    max-width: 1350px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 12px;
    padding: 10px 0 100px 0;
`;
const Title = styled.div`
    font-size: 42px;
    font-weight: 600;
    text-align: center;
    margin-top: 20px;
    color: ${({ theme }) => theme.text_primary};
    @media (max-width: 768px) {
        margin-top: 12px;
        font-size: 32px;
    }
`;
const Desc = styled.div`
    font-size: 18px;
    max-width: 600px;
    text-align: center;
    color: ${({ theme }) => theme.text_secondary};
    @media (max-width: 768px) {
        font-size: 16px;
        padding: 0 15px;
    }
`;
const ToggleGroup = styled.div`
    display: flex;
    border: 1.5px solid ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
    font-size: 16px;
    border-radius: 12px;
    font-weight: 500;
    margin: 22px 0;
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;
const ToggleButton = styled.div`
    padding: 8px 18px;
    cursor: pointer;
    border-radius: ${({ isFirst, isLast }) => {
        if (isFirst) return "12px 0 0 12px";
        if (isLast) return "0 12px 12px 0";
        return "0";
    }};

    transition: all 0.2s ease-in-out;
    ${({ active, theme }) =>
        active &&
        `
            background-color: ${theme.primary + 20};
        `}
    &:hover {
        background-color: ${({ theme }) => theme.primary + 15};
    }
    @media (max-width: 768px) {
        padding: 6px 8px;
        border-radius: 4px;
    }
`;
const Divider = styled.div`
    width: 1.5px;
    background-color: ${({ theme }) => theme.primary};
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;
const CardContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 28px;
`;
const EmptyCategory = styled.div`
    font-size: 18px;
    max-width: 600px;
    text-align: center;
    color: ${({ theme }) => theme.text_secondary};
    @media (max-width: 768px) {
        font-size: 16px;
    }
`;
const IconWrapper = styled.span`
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
`;

const Projects = ({ openModal, setOpenModal }) => {
    const [category, setCategory] = useState("all");
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortCount, setSortCount] = useState(0);

    const handleSortBy = (sortByType) => {
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

    const sortIcon = (sortByType) => {
        if (sortBy === sortByType) {
            if (sortOrder === "asc")
                return <FaChevronUp style={{ paddingLeft: "4px" }} />;
            if (sortOrder === "desc")
                return <FaChevronDown style={{ paddingLeft: "4px" }} />;
        }
        return null;
    };

    const sortProjects = (projectsArray) => {
        if (sortBy === "title") {
            return projectsArray.sort((a, b) =>
                sortOrder === "asc"
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title)
            );
        } else if (sortBy === "tags") {
            return projectsArray.sort((a, b) =>
                sortOrder === "asc"
                    ? a.tags.length - b.tags.length
                    : b.tags.length - a.tags.length
            );
        } else if (sortBy === "date") {
            return projectsArray.sort((a, b) => {
                if (sortOrder === "asc") {
                    return a.date > b.date ? 1 : a.date < b.date ? -1 : 0;
                } else {
                    return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
                }
            });
        }

        return projectsArray.sort((a, b) => a.id - b.id);
    };

    return (
        <Section id="projects">
            <Wrapper>
                <Title>Projects</Title>
                <Desc>
                    Here you can explore some of my projects. Click on a project
                    to see the details.
                </Desc>
                <ToggleGroup>
                    <ToggleButton
                        onClick={() => setCategory("all")}
                        active={category === "all"}
                        isFirst={true}
                    >
                        ALL
                    </ToggleButton>
                    <Divider />
                    <ToggleButton
                        onClick={() => setCategory("web app")}
                        active={category === "web app"}
                    >
                        WEB APP
                    </ToggleButton>
                    <Divider />
                    <ToggleButton
                        onClick={() => setCategory("programming")}
                        active={category === "programming"}
                    >
                        PROGRAMMING
                    </ToggleButton>
                    <Divider />
                    <ToggleButton
                        onClick={() => setCategory("machine learning")}
                        active={category === "machine learning"}
                        isLast={true}
                    >
                        MACHINE LEARNING
                    </ToggleButton>
                </ToggleGroup>
                <ToggleGroup>
                    <ToggleButton
                        onClick={() => handleSortBy("title")}
                        active={sortBy === "title"}
                        isFirst={true}
                    >
                        <IconWrapper>Title {sortIcon("title")}</IconWrapper>
                    </ToggleButton>
                    <Divider />
                    <ToggleButton
                        onClick={() => handleSortBy("date")}
                        active={sortBy === "date"}
                    >
                        <IconWrapper>Date {sortIcon("date")}</IconWrapper>
                    </ToggleButton>
                    <Divider />
                    <ToggleButton
                        onClick={() => handleSortBy("tags")}
                        active={sortBy === "tags"}
                        isLast={true}
                    >
                        <IconWrapper>Tags {sortIcon("tags")}</IconWrapper>
                    </ToggleButton>
                </ToggleGroup>
                <CardContainer>
                    {sortProjects(
                        category === "all"
                            ? projects
                            : projects.filter(
                                  (project) => project.category === category
                              )
                    ).map((project, index) => (
                        <ProjectCard
                            key={index}
                            project={project}
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                        />
                    ))}
                    {category !== "all" &&
                        projects.filter((item) => item.category === category)
                            .length === 0 && (
                            <EmptyCategory>
                                Nothing in here yet, but coming soon!
                            </EmptyCategory>
                        )}
                </CardContainer>
            </Wrapper>
        </Section>
    );
};

export default Projects;
