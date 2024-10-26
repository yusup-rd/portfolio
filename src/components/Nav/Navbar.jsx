import { useEffect, useState } from "react";
import styled, { css, useTheme } from "styled-components";
import { RiCodeBoxLine } from "react-icons/ri";
import { FaPalette } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { Bio } from "../../data/constants";
import { themes } from "../../utils/Themes";

const Nav = styled.div`
    background-color: ${({ theme }) => theme.card_light};
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    position: sticky;
    top: 0;
    z-index: 10;
    @media screen and (max-width: 960px) {
        transition: 0.8s all ease;
    }
`;

const NavContainer = styled.div`
    display: flex;
    justify-content: space-between;
    height: 60px;
    z-index: 1;
    width: 100%;
    padding: 0 24px;
    max-width: 1200px;
`;

const NavLogo = styled.a`
    padding: 0 6px;
    display: flex;
    justify-self: flex-start;
    align-items: center;
    cursor: pointer;
    text-decoration: none;
    @media screen and (max-width: 640px) {
        padding: 0 0px;
    }
`;

const MobileIcon = styled.div`
    display: none;
    @media screen and (max-width: 860px) {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 50%);
        font-size: 1.5rem;
        cursor: pointer;
        color: ${({ theme }) => theme.text_primary};
    }
`;

const NavItems = styled.ul`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 32px;
    list-style: none;
    @media screen and (max-width: 860px) {
        display: none;
    }
`;

const NavLink = styled.a`
    color: ${({ theme }) => theme.text_primary};
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    &:hover {
        color: ${({ theme }) => theme.primary};
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 30%;
    height: 100%;
    padding: 0 6px;
    @media screen and (max-width: 860px) {
        display: none;
    }
`;

const GithubButton = styled.a`
    background-color: transparent;
    color: ${({ theme }) => theme.primary};
    border: 1.8px solid ${({ theme }) => theme.primary};
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    margin: 0 10px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    height: 70%;
    transition: all 0.2s ease-in-out;
    :hover {
        background-color: ${({ theme }) => theme.primary};
        color: ${({ theme }) => theme.white};
    }
    @media screen and (max-width: 640px) {
        font-size: 0.8rem;
    }
    @media screen and (min-width: 860px) and (max-width: 1045px) {
        font-size: 0.8rem;
        padding: 0 5px;
    }
    ${({ className }) =>
        className === "menuGithub" &&
        css`
            padding: 10px 16px;
            background: ${({ theme }) => theme.primary};
            border-radius: 50px;
            color: white;
            margin: 5px auto;
            width: max-content;
            :hover {
                color: ${({ theme }) => theme.primary};
                background-color: transparent;
                border: 1.8px solid ${({ theme }) => theme.primary};
            }
        `}
`;

const Span = styled.span`
    padding: 0 4px;
    font-weight: bold;
    font-size: 18px;
    color: ${({ theme }) => theme.text_primary};
`;

const MobileMenu = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
    position: absolute;
    top: 80px;
    right: 0;
    width: 100%;
    padding: 12px 40px 24px 40px;
    background: ${({ theme }) => theme.card_light};
    transition: all 0.3s ease-in-out;
    transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(0)")};
    border-radius: 0 0 20px 20px;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.3);
    opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
    z-index: ${({ isOpen }) => (isOpen ? "1" : "-1")};
`;

const MobileLink = styled.a`
    color: ${({ theme }) => theme.text_primary};
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    &:hover {
        color: ${({ theme }) => theme.primary};
    }
`;

const ThemeDropdown = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
    position: relative;
    @media screen and (max-width: 860px) {
        order: -1;
    }
`;

const ThemeDropdownButton = styled.button`
    background-color: transparent;
    border: none;
    color: ${({ theme }) => theme.text_primary};
    cursor: pointer;
    transition: color 0.2s ease-in-out;
    &:hover {
        color: ${({ theme }) => theme.primary};
    }
    @media screen and (max-width: 860px) {
        position: relative;
    }
`;

const ThemeDropdownMenu = styled.div`
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 300px;
    background: ${({ theme }) => theme.card_light};
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 2;
`;

const ThemeOption = styled.p`
    font-size: 14px;
    padding: 8px;
    cursor: pointer;
    transition: color 0.2s ease-in-out;
    color: ${({ theme }) => theme.text_primary};
    &:hover {
        color: ${({ theme }) => theme.primary};
    }
    ${({ isSelected, theme }) =>
        isSelected &&
        css`
            color: ${theme.primary};
            background-color: ${({ theme }) => theme.bgLight};
            border-radius: 4px;
        `}
`;

const ThemeDropdownMenuMobile = styled.div`
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    left: 20px;
    background: ${({ theme }) => theme.card_light};
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 2;

    @media screen and (max-width: 860px) {
        position: relative;
        width: 100%;
        left: 0;
    }
`;

const Navbar = ({ changeTheme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showThemeOptions, setShowThemeOptions] = useState(false);
    const theme = useTheme();

    const closeMobileMenu = () => {
        if (window.innerWidth > 860) {
            setIsOpen(false);
        }
    };

    const toggleThemeOptions = () => {
        setShowThemeOptions(!showThemeOptions);
    };

    const handleLogoClick = (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        window.addEventListener("resize", closeMobileMenu);
        return () => {
            window.removeEventListener("resize", closeMobileMenu);
        };
    }, []);

    return (
        <Nav>
            <NavContainer>
                <NavLogo
                    href="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                        cursor: "pointer",
                    }}
                    onClick={handleLogoClick}
                >
                    <RiCodeBoxLine
                        size="3rem"
                        style={{ color: theme.text_primary }}
                    />
                    <Span>Yusup</Span>
                </NavLogo>
                <MobileIcon>
                    <FaBars
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                    />
                </MobileIcon>
                <NavItems>
                    <NavLink href="#about">About</NavLink>
                    <NavLink href="#skills">Skills</NavLink>
                    <NavLink href="#experience">Experience</NavLink>
                    <NavLink href="#projects">Projects</NavLink>
                    <NavLink href="#education">Education</NavLink>
                </NavItems>
                <ButtonContainer>
                    <GithubButton href={Bio.github} target="_blank">
                        Github Profile
                    </GithubButton>
                    <ThemeDropdown>
                        <ThemeDropdownButton onClick={toggleThemeOptions}>
                            <FaPalette style={{ fontSize: "20px" }} />
                        </ThemeDropdownButton>
                        <ThemeDropdownMenu isOpen={showThemeOptions}>
                            {themes.map((themeOption, index) => (
                                <ThemeOption
                                    key={index}
                                    isSelected={
                                        index ===
                                        themes.findIndex(
                                            (t) => t.name === theme.name
                                        )
                                    }
                                    onClick={() => {
                                        changeTheme(index);
                                        toggleThemeOptions();
                                    }}
                                >
                                    {themeOption.name}
                                </ThemeOption>
                            ))}
                        </ThemeDropdownMenu>
                    </ThemeDropdown>
                </ButtonContainer>
            </NavContainer>
            {isOpen && (
                <MobileMenu isOpen={isOpen}>
                    <MobileLink
                        href="#about"
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                    >
                        About
                    </MobileLink>
                    <MobileLink
                        href="#skills"
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                    >
                        Skills
                    </MobileLink>
                    <MobileLink
                        href="#experience"
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                    >
                        Experience
                    </MobileLink>
                    <MobileLink
                        href="#projects"
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                    >
                        Projects
                    </MobileLink>
                    <MobileLink
                        href="#education"
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                    >
                        Education
                    </MobileLink>
                    <GithubButton
                        className={"menuGithub"}
                        href={Bio.github}
                        target="_blank"
                    >
                        Github Profile
                    </GithubButton>
                    <MobileLink
                        onClick={toggleThemeOptions}
                        style={{ cursor: "pointer" }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <FaPalette />
                        </div>
                    </MobileLink>
                    {showThemeOptions && (
                        <ThemeDropdownMenuMobile isOpen={showThemeOptions}>
                            {themes.map((themeOption, index) => (
                                <ThemeOption
                                    key={index}
                                    isSelected={
                                        index ===
                                        themes.findIndex(
                                            (t) => t.name === theme.name
                                        )
                                    }
                                    onClick={() => {
                                        changeTheme(index);
                                        toggleThemeOptions();
                                    }}
                                >
                                    {themeOption.name}
                                </ThemeOption>
                            ))}
                        </ThemeDropdownMenuMobile>
                    )}
                </MobileMenu>
            )}
        </Nav>
    );
};

export default Navbar;
