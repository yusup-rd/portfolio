import { useEffect, useRef, useState } from "react";
import type { ThemeControls } from "../../types/portfolio";

import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PaletteIcon from "@mui/icons-material/Palette";
import TelegramIcon from "@mui/icons-material/Telegram";
import { Bio } from "../../data/constants";
import { themes } from "../../utils/Themes";

interface FooterProps {
    changeTheme: ThemeControls["changeTheme"];
    selectedThemeIndex: ThemeControls["selectedThemeIndex"];
}

const Footer = ({ changeTheme, selectedThemeIndex }: FooterProps) => {
    const [showThemeOptions, setShowThemeOptions] = useState(false);
    const selectorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                selectorRef.current &&
                event.target instanceof Node &&
                !selectorRef.current.contains(event.target)
            ) {
                setShowThemeOptions(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowThemeOptions(false);
            }
        };

        if (showThemeOptions) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [showThemeOptions]);

    const handleThemeChange = (themeIndex: number) => {
        changeTheme(themeIndex);
        setShowThemeOptions(false);
    };

    const selectedTheme = themes[selectedThemeIndex] ?? themes[0];

    return (
        <div className="flex w-full justify-center py-8">
            <footer className="flex w-full max-w-300 flex-col items-center gap-3.5 p-4 text-text-primary">
                <h1 className="text-xl font-semibold text-primary">
                    Yusup Rejebov
                </h1>
                <nav className="flex w-full max-w-200 flex-row justify-center gap-8 pt-2 max-md:flex-wrap max-md:gap-4 max-md:text-center max-md:text-xs">
                    <a
                        className="text-xl text-text-primary no-underline transition-colors duration-200 ease-in-out hover:text-primary max-md:text-base"
                        href="#about"
                    >
                        About
                    </a>
                    <a
                        className="text-xl text-text-primary no-underline transition-colors duration-200 ease-in-out hover:text-primary max-md:text-base"
                        href="#skills"
                    >
                        Skills
                    </a>
                    <a
                        className="text-xl text-text-primary no-underline transition-colors duration-200 ease-in-out hover:text-primary max-md:text-base"
                        href="#experience"
                    >
                        Experience
                    </a>
                    <a
                        className="text-xl text-text-primary no-underline transition-colors duration-200 ease-in-out hover:text-primary max-md:text-base"
                        href="#projects"
                    >
                        Projects
                    </a>
                    <a
                        className="text-xl text-text-primary no-underline transition-colors duration-200 ease-in-out hover:text-primary max-md:text-base"
                        href="#education"
                    >
                        Education
                    </a>
                </nav>
                <div className="relative flex justify-center" ref={selectorRef}>
                    <button
                        className="flex max-w-80 min-w-50 cursor-pointer items-center gap-2.5 rounded-xl border border-border/[33.33%] bg-card px-4 py-2.5 text-base text-text-primary shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-[border-color,box-shadow,background-color] duration-200 ease-[ease] hover:border-primary hover:shadow-[0_4px_14px_color-mix(in_srgb,var(--color-primary)_20%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary max-md:min-w-45 max-md:px-3 max-md:py-2 max-md:text-sm"
                        type="button"
                        onClick={() => setShowThemeOptions((open) => !open)}
                        aria-expanded={showThemeOptions}
                        aria-haspopup="listbox"
                        aria-label="Choose theme color"
                    >
                        <PaletteIcon className="shrink-0! text-xl! text-primary!" />
                        <span
                            className="size-4.5 shrink-0 rounded-full border-2 border-white/[26.67%] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
                            style={{ backgroundColor: selectedTheme.primary }}
                        />
                        <span className="flex-1 truncate text-left">
                            {selectedTheme.name}
                        </span>
                        <ExpandMoreIcon
                            className="shrink-0! text-xl! text-text-secondary! transition-transform! duration-200! ease-[ease]! data-[open=true]:rotate-180"
                            data-open={showThemeOptions}
                        />
                    </button>
                    <div
                        className="pointer-events-none invisible absolute bottom-[calc(100%+10px)] left-1/2 z-10 flex max-w-[min(360px,92dvw)] min-w-70 -translate-x-1/2 translate-y-1.5 flex-col gap-1 rounded-2xl border border-border/[26.67%] bg-card-light p-2 opacity-0 shadow-[0_8px_32px_rgba(0,0,0,0.18)] transition-[opacity,translate,visibility] duration-200 ease-[ease] data-[open=true]:pointer-events-auto data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:opacity-100 max-md:min-w-65"
                        data-open={showThemeOptions}
                        role="listbox"
                        aria-label="Theme options"
                    >
                        {themes.map((themeOption, index) => (
                            <button
                                className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-none bg-transparent px-3 py-2.5 text-left text-sm text-text-primary transition-colors duration-150 ease-[ease] hover:bg-primary/[9.41%] hover:text-primary aria-selected:bg-primary/[13.33%] aria-selected:font-medium aria-selected:text-primary"
                                key={themeOption.name}
                                type="button"
                                role="option"
                                aria-selected={index === selectedThemeIndex}
                                onClick={() => handleThemeChange(index)}
                            >
                                <span
                                    className="size-4.5 shrink-0 rounded-full border-2 border-white/[26.67%] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
                                    style={{
                                        backgroundColor: themeOption.primary,
                                    }}
                                />
                                <span className="flex-1 leading-[1.35]">
                                    {themeOption.name}
                                </span>
                                <CheckIcon
                                    className="shrink-0! text-lg! text-primary! opacity-0 data-[visible=true]:opacity-100"
                                    data-visible={index === selectedThemeIndex}
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-8 px-4 pt-4">
                    <a
                        className="inline-block text-2xl text-text-primary transition-colors duration-200 ease-in-out hover:text-primary"
                        href={Bio.facebook}
                        target="display"
                    >
                        <FacebookIcon />
                    </a>
                    <a
                        className="inline-block text-2xl text-text-primary transition-colors duration-200 ease-in-out hover:text-primary"
                        href={Bio.telegram}
                        target="display"
                    >
                        <TelegramIcon />
                    </a>
                    <a
                        className="inline-block text-2xl text-text-primary transition-colors duration-200 ease-in-out hover:text-primary"
                        href={Bio.linkedin}
                        target="display"
                    >
                        <LinkedInIcon />
                    </a>
                    <a
                        className="inline-block text-2xl text-text-primary transition-colors duration-200 ease-in-out hover:text-primary"
                        href={Bio.instagram}
                        target="display"
                    >
                        <InstagramIcon />
                    </a>
                </div>
                <p className="pt-6 text-center text-sm text-text-secondary">
                    &copy; 2024 Yusup Rejebov. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Footer;
