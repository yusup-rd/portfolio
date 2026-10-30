import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import type { ThemeControls } from "../../types/portfolio";

import { FaBars, FaPalette } from "react-icons/fa";
import { RiCodeBoxLine } from "react-icons/ri";
import { Bio } from "../../data/constants";
import { themes } from "../../utils/Themes";

interface NavbarProps {
    changeTheme: ThemeControls["changeTheme"];
    selectedThemeIndex: ThemeControls["selectedThemeIndex"];
}

const Navbar = ({ changeTheme, selectedThemeIndex }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showThemeOptions, setShowThemeOptions] = useState(false);
    const theme = themes[selectedThemeIndex] ?? themes[0];

    const closeMobileMenu = () => {
        if (window.innerWidth > 860) {
            setIsOpen(false);
        }
    };

    const toggleThemeOptions = () => {
        setShowThemeOptions(!showThemeOptions);
    };

    const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
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
        <div className="sticky top-0 z-10 flex h-20 items-center justify-center bg-card-light text-base max-lg:transition-all max-lg:duration-800 max-lg:ease-[ease]">
            <div className="z-1 flex h-15 w-full max-w-300 justify-between px-6">
                <a
                    className="flex cursor-pointer items-center justify-self-start px-1.5 no-underline max-sm:px-0"
                    href="/"

                    onClick={handleLogoClick}
                >
                    <RiCodeBoxLine size="3rem" className="text-text-primary" />
                    <span className="px-1 text-lg font-bold text-text-primary">
                        Yusup
                    </span>
                </a>
                <div className="hidden max-lg:absolute max-lg:top-0 max-lg:right-0 max-lg:block max-lg:-translate-x-full max-lg:translate-y-1/2 max-lg:cursor-pointer max-lg:text-2xl max-lg:text-text-primary">
                    <FaBars
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                    />
                </div>
                <ul className="flex w-full list-none items-center justify-center gap-8 max-lg:hidden">
                    <a
                        className="cursor-pointer font-medium text-text-primary no-underline transition-all duration-200 ease-in-out hover:text-primary"
                        href="#about"
                    >
                        About
                    </a>
                    <a
                        className="cursor-pointer font-medium text-text-primary no-underline transition-all duration-200 ease-in-out hover:text-primary"
                        href="#skills"
                    >
                        Skills
                    </a>
                    <a
                        className="cursor-pointer font-medium text-text-primary no-underline transition-all duration-200 ease-in-out hover:text-primary"
                        href="#experience"
                    >
                        Experience
                    </a>
                    <a
                        className="cursor-pointer font-medium text-text-primary no-underline transition-all duration-200 ease-in-out hover:text-primary"
                        href="#projects"
                    >
                        Projects
                    </a>
                    <a
                        className="cursor-pointer font-medium text-text-primary no-underline transition-all duration-200 ease-in-out hover:text-primary"
                        href="#education"
                    >
                        Education
                    </a>
                </ul>
                <div className="flex h-full w-[30%] items-center justify-between gap-2.5 px-1.5 max-lg:hidden">
                    <a
                        className="flex h-[70%] cursor-pointer items-center justify-center rounded-3xl border-[1.8px] border-primary bg-transparent px-5 text-center text-base font-medium text-primary no-underline transition-all duration-200 ease-in-out hover:bg-primary hover:text-white max-sm:text-xs lg:max-xl:px-1.25 lg:max-xl:text-xs"
                        href={Bio.github}
                        target="_blank"
                    >
                        Github Profile
                    </a>
                    <div className="relative flex items-center max-lg:-order-1">
                        <button
                            className="cursor-pointer border-none bg-transparent text-text-primary transition-colors duration-200 ease-in-out hover:text-primary max-lg:relative"
                            onClick={toggleThemeOptions}
                        >
                            <FaPalette className="text-xl" />
                        </button>
                        <div
                            className="absolute top-full right-0 z-2 hidden min-w-75 flex-col rounded-lg bg-card-light shadow-[0_0_10px_rgba(0,0,0,0.1)] data-[open=true]:flex"
                            data-open={showThemeOptions}
                        >
                            {themes.map((themeOption, index) => (
                                <p
                                    className="cursor-pointer p-2 text-sm text-text-primary transition-colors duration-200 ease-in-out hover:text-primary data-[selected=true]:rounded-sm data-[selected=true]:bg-bg-light data-[selected=true]:text-primary"
                                    key={index}
                                    data-selected={
                                        index ===
                                        themes.findIndex(
                                            (t) => t.name === theme.name,
                                        )
                                    }
                                    onClick={() => {
                                        changeTheme(index);
                                        toggleThemeOptions();
                                    }}
                                >
                                    {themeOption.name}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div
                    className="absolute top-20 right-0 z-1 flex w-full flex-col justify-center gap-4 rounded-b-[20px] bg-card-light px-10 pt-3 pb-6 shadow-[0_10px_10px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out"
                    data-open={isOpen}
                >
                    <a
                        className="cursor-pointer font-medium text-text-primary no-underline transition-all duration-200 ease-in-out hover:text-primary"
                        href="#about"
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                    >
                        About
                    </a>
                    <a
                        className="cursor-pointer font-medium text-text-primary no-underline transition-all duration-200 ease-in-out hover:text-primary"
                        href="#skills"
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                    >
                        Skills
                    </a>
                    <a
                        className="cursor-pointer font-medium text-text-primary no-underline transition-all duration-200 ease-in-out hover:text-primary"
                        href="#experience"
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                    >
                        Experience
                    </a>
                    <a
                        className="cursor-pointer font-medium text-text-primary no-underline transition-all duration-200 ease-in-out hover:text-primary"
                        href="#projects"
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                    >
                        Projects
                    </a>
                    <a
                        className="cursor-pointer font-medium text-text-primary no-underline transition-all duration-200 ease-in-out hover:text-primary"
                        href="#education"
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                    >
                        Education
                    </a>
                    <a
                        className="flex w-max cursor-pointer items-center justify-center self-center rounded-full border-[1.8px] border-primary bg-primary px-4 py-2.5 text-center text-base font-medium text-white no-underline transition-all duration-200 ease-in-out hover:bg-transparent hover:text-primary max-sm:text-xs"
                        href={Bio.github}
                        target="_blank"
                    >
                        Github Profile
                    </a>
                    <a
                        className="cursor-pointer font-medium text-text-primary no-underline transition-all duration-200 ease-in-out hover:text-primary"
                        onClick={toggleThemeOptions}
                    >
                        <div className="flex justify-center">
                            <FaPalette />
                        </div>
                    </a>
                    {showThemeOptions && (
                        <div
                            className="absolute left-5 z-2 hidden flex-col rounded-lg bg-card-light shadow-[0_0_10px_rgba(0,0,0,0.1)] data-[open=true]:flex max-lg:relative max-lg:left-0 max-lg:w-full"
                            data-open={showThemeOptions}
                        >
                            {themes.map((themeOption, index) => (
                                <p
                                    className="cursor-pointer p-2 text-sm text-text-primary transition-colors duration-200 ease-in-out hover:text-primary data-[selected=true]:rounded-sm data-[selected=true]:bg-bg-light data-[selected=true]:text-primary"
                                    key={index}
                                    data-selected={
                                        index ===
                                        themes.findIndex(
                                            (t) => t.name === theme.name,
                                        )
                                    }
                                    onClick={() => {
                                        changeTheme(index);
                                        toggleThemeOptions();
                                    }}
                                >
                                    {themeOption.name}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;
