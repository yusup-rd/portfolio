import { useEffect, useLayoutEffect, useState } from "react";
import "./App.css";
import type { ProjectModalState } from "./types/portfolio";

import AOS from "aos";
import "aos/dist/aos.css";
import { BrowserRouter as Router } from "react-router-dom";
import Contact from "./components/Contact/Contact";
import ProjectDetail from "./components/Detail/ProjectDetail";
import Education from "./components/Education/Education";
import Experience from "./components/Experience/Experience";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Navbar from "./components/Nav/Navbar";
import Projects from "./components/Projects/Projects";
import Skills from "./components/Skills/Skills";
import { themes } from "./utils/Themes";

const App = () => {
    const [openModal, setOpenModal] = useState<ProjectModalState>({
        state: false,
        project: null,
    });
    const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
    const changeTheme = (themeIndex: number) => {
        setSelectedThemeIndex(themeIndex);
    };
    useLayoutEffect(() => {
        const theme = themes[selectedThemeIndex] ?? themes[0];
        for (const [key, value] of Object.entries(theme)) {
            if (key === "name") continue;
            const token = key
                .replace("bgLight", "bg-light")
                .replaceAll("_", "-");
            document.documentElement.style.setProperty(
                `--portfolio-${token}`,
                value,
            );
        }
    }, [selectedThemeIndex]);
    useEffect(() => {
        AOS.init({ once: false, mirror: true, duration: 1500 });
        return () => {
            AOS.refresh();
        };
    }, [selectedThemeIndex]);

    return (
        <Router>
            <Navbar
                selectedThemeIndex={selectedThemeIndex}
                changeTheme={changeTheme}
            />
            <div className="size-full overflow-x-hidden bg-bg">
                <Hero />
                <div className="section-gradient w-full [clip-path:polygon(0_0,100%_0,100%_100%,30%_98%,0_100%)]">
                    <Skills />
                    <Experience />
                </div>
                <Projects setOpenModal={setOpenModal} />
                <div className="section-gradient w-full [clip-path:polygon(0_0,100%_0,100%_100%,30%_98%,0_100%)]">
                    <Education />
                    <Contact />
                </div>
                <Footer
                    selectedThemeIndex={selectedThemeIndex}
                    changeTheme={changeTheme}
                />
                {openModal.state && (
                    <ProjectDetail
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                    />
                )}
            </div>
        </Router>
    );
};

export default App;
