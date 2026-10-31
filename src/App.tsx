import { useState } from "react";
import "./App.css";
import Contact from "./components/Contact/Contact";
import ProjectDetail from "./components/Detail/ProjectDetail";
import Education from "./components/Education/Education";
import Experience from "./components/Experience/Experience";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Navbar from "./components/Nav/Navbar";
import Projects from "./components/Projects/Projects";
import Skills from "./components/Skills/Skills";
import { useAnchorScroll } from "./hooks/useAnchorScroll";
import { useReveal } from "./hooks/useReveal";
import { useTheme } from "./hooks/useTheme";
import type { ProjectModalState } from "./types/portfolio";
const App = () => {
    const { theme, toggleTheme } = useTheme();
    const [openModal, setOpenModal] = useState<ProjectModalState>({
        state: false,
        project: null,
    });
    useReveal();
    useAnchorScroll();
    return (
        <>
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <main id="main">
                <Hero />
                <div className="border-y border-border bg-bg-light">
                    <Projects setOpenModal={setOpenModal} />
                </div>
                <Experience />
                <div className="border-y border-border bg-bg-light">
                    <Skills />
                </div>
                <Education />
                <Contact />
            </main>
            <Footer />
            {openModal.state && (
                <ProjectDetail
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                />
            )}
        </>
    );
};
export default App;
