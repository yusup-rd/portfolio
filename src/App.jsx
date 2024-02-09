import "./App.css";
import { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { themes } from "./utils/Themes";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Nav/Navbar";
import Hero from "./components/Hero/Hero";
import Skills from "./components/Skills/Skills";
import Experience from "./components/Experience/Experience";
import Projects from "./components/Projects/Projects";
import Education from "./components/Education/Education";
import ProjectDetail from "./components/Detail/ProjectDetail";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const Body = styled.div`
    background-color: ${({ theme }) => theme.bg};
    width: 100%;
    height: 100%;
    overflow-x: hidden;
`;
const Wrapper = styled.div`
    background: linear-gradient(
            38.37deg,
            rgba(204, 0, 187, 0.15) 0%,
            rgba(201, 32, 184, 0) 50%
        ),
        linear-gradient(
            141.27deg,
            rgba(0, 78, 289, 0) 50%,
            rgba(0, 78, 289, 0.15) 100%
        );
    width: 100%;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;

const App = () => {
    const [openModal, setOpenModal] = useState({ state: false, project: null });
    const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
    const changeTheme = (themeIndex) => {
        setSelectedThemeIndex(themeIndex);
    };
    useEffect(() => {
        AOS.init({ once: false, mirror: true, duration: 1500 });
        return () => {
            AOS.refresh();
        };
    }, [selectedThemeIndex]);

    return (
        <ThemeProvider theme={themes[selectedThemeIndex]}>
            <Router>
                <Navbar
                    selectedThemeIndex={selectedThemeIndex}
                    changeTheme={changeTheme}
                />
                <Body>
                    <Hero />
                    <Wrapper>
                        <Skills />
                        <Experience />
                    </Wrapper>
                    <Projects
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                    />
                    <Wrapper>
                        <Education />
                        <Contact />
                    </Wrapper>
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
                </Body>
            </Router>
        </ThemeProvider>
    );
};

export default App;
