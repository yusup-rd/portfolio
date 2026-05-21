import { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import FacebookIcon from "@mui/icons-material/Facebook";
import TelegramIcon from "@mui/icons-material/Telegram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PaletteIcon from "@mui/icons-material/Palette";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import { Bio } from "../../data/constants";
import { themes } from "../../utils/Themes";

const FooterContainer = styled.div`
    width: 100%;
    padding: 2rem 0;
    display: flex;
    justify-content: center;
`;
const FooterWrapper = styled.footer`
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    align-items: center;
    padding: 1rem;
    color: ${({ theme }) => theme.text_primary};
`;
const Logo = styled.h1`
    font-weight: 600;
    font-size: 20px;
    color: ${({ theme }) => theme.primary};
`;
const Nav = styled.nav`
    width: 100%;
    max-width: 800px;
    margin-top: 0.5rem;
    display: flex;
    flex-direction: row;
    gap: 2rem;
    justify-content: center;
    @media (max-width: 768px) {
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        text-align: center;
        font-size: 12px;
    }
`;
const NavLink = styled.a`
    color: ${({ theme }) => theme.text_primary};
    text-decoration: none;
    font-size: 1.2rem;
    transition: color 0.2s ease-in-out;
    &:hover {
        color: ${({ theme }) => theme.primary};
    }
    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const ThemeSelector = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
`;

const ThemeTrigger = styled.button`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    min-width: 200px;
    max-width: 320px;
    background: ${({ theme }) => theme.card};
    border: 1px solid ${({ theme }) => theme.border + 55};
    border-radius: 12px;
    color: ${({ theme }) => theme.text_primary};
    font-size: 0.95rem;
    cursor: pointer;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        background-color 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    &:hover {
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 4px 14px ${({ theme }) => theme.primary + 33};
    }

    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.primary};
        outline-offset: 2px;
    }

    @media (max-width: 768px) {
        min-width: 180px;
        font-size: 0.85rem;
        padding: 8px 12px;
    }
`;

const TriggerLabel = styled.span`
    flex: 1;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const TriggerIcon = styled(PaletteIcon)`
    && {
        font-size: 1.25rem;
        color: ${({ theme }) => theme.primary};
        flex-shrink: 0;
    }
`;

const ChevronIcon = styled(ExpandMoreIcon)`
    && {
        font-size: 1.35rem;
        color: ${({ theme }) => theme.text_secondary};
        flex-shrink: 0;
        transition: transform 0.2s ease;
        transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0)")};
    }
`;

const ColorSwatch = styled.span`
    width: 18px;
    height: 18px;
    border-radius: 50%;
    flex-shrink: 0;
    background: ${({ $color }) => $color};
    border: 2px solid ${({ theme }) => theme.white + 44};
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.12);
`;

const ThemeMenu = styled.div`
    position: absolute;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    min-width: 280px;
    max-width: min(360px, 92vw);
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    background: ${({ theme }) => theme.card_light};
    border: 1px solid ${({ theme }) => theme.border + 44};
    border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
    z-index: 10;
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
    transform: translateX(-50%)
        translateY(${({ $open }) => ($open ? "0" : "6px")});
    transition:
        opacity 0.2s ease,
        transform 0.2s ease,
        visibility 0.2s ease;
    pointer-events: ${({ $open }) => ($open ? "auto" : "none")};

    @media (max-width: 768px) {
        min-width: 260px;
    }
`;

const ThemeMenuItem = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 12px;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: ${({ theme }) => theme.text_primary};
    font-size: 0.9rem;
    text-align: left;
    cursor: pointer;
    transition:
        background-color 0.15s ease,
        color 0.15s ease;

    &:hover {
        background: ${({ theme }) => theme.primary + 18};
        color: ${({ theme }) => theme.primary};
    }

    ${({ $selected, theme }) =>
        $selected &&
        css`
            background: ${theme.primary + 22};
            color: ${theme.primary};
            font-weight: 500;
        `}
`;

const MenuItemLabel = styled.span`
    flex: 1;
    line-height: 1.35;
`;

const SelectedCheck = styled(CheckIcon)`
    && {
        font-size: 1.1rem;
        color: ${({ theme }) => theme.primary};
        flex-shrink: 0;
        opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    }
`;

const SocialMediaIcons = styled.div`
    display: flex;
    margin-top: 1rem;
`;
const SocialMediaIcon = styled.a`
    display: inline-block;
    margin: 0 1rem;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.text_primary};
    transition: color 0.2s ease-in-out;
    &:hover {
        color: ${({ theme }) => theme.primary};
    }
`;
const Copyright = styled.p`
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.soft2};
    text-align: center;
`;

function Footer({ changeTheme, selectedThemeIndex, setSelectedThemeIndex }) {
    const [showThemeOptions, setShowThemeOptions] = useState(false);
    const selectorRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                selectorRef.current &&
                !selectorRef.current.contains(event.target)
            ) {
                setShowThemeOptions(false);
            }
        };

        const handleEscape = (event) => {
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

    const handleThemeChange = (themeIndex) => {
        changeTheme(themeIndex);
        setSelectedThemeIndex(themeIndex);
        setShowThemeOptions(false);
    };

    const selectedTheme = themes[selectedThemeIndex];

    return (
        <FooterContainer>
            <FooterWrapper>
                <Logo>Yusup Rejebov</Logo>
                <Nav>
                    <NavLink href="#about">About</NavLink>
                    <NavLink href="#skills">Skills</NavLink>
                    <NavLink href="#experience">Experience</NavLink>
                    <NavLink href="#projects">Projects</NavLink>
                    <NavLink href="#education">Education</NavLink>
                </Nav>
                <ThemeSelector ref={selectorRef}>
                    <ThemeTrigger
                        type="button"
                        onClick={() => setShowThemeOptions((open) => !open)}
                        aria-expanded={showThemeOptions}
                        aria-haspopup="listbox"
                        aria-label="Choose theme color"
                    >
                        <TriggerIcon />
                        <ColorSwatch $color={selectedTheme.primary} />
                        <TriggerLabel>{selectedTheme.name}</TriggerLabel>
                        <ChevronIcon $open={showThemeOptions} />
                    </ThemeTrigger>
                    <ThemeMenu
                        $open={showThemeOptions}
                        role="listbox"
                        aria-label="Theme options"
                    >
                        {themes.map((themeOption, index) => (
                            <ThemeMenuItem
                                key={themeOption.name}
                                type="button"
                                role="option"
                                aria-selected={index === selectedThemeIndex}
                                $selected={index === selectedThemeIndex}
                                onClick={() => handleThemeChange(index)}
                            >
                                <ColorSwatch $color={themeOption.primary} />
                                <MenuItemLabel>
                                    {themeOption.name}
                                </MenuItemLabel>
                                <SelectedCheck
                                    $visible={index === selectedThemeIndex}
                                />
                            </ThemeMenuItem>
                        ))}
                    </ThemeMenu>
                </ThemeSelector>
                <SocialMediaIcons>
                    <SocialMediaIcon href={Bio.facebook} target="display">
                        <FacebookIcon />
                    </SocialMediaIcon>
                    <SocialMediaIcon href={Bio.telegram} target="display">
                        <TelegramIcon />
                    </SocialMediaIcon>
                    <SocialMediaIcon href={Bio.linkedin} target="display">
                        <LinkedInIcon />
                    </SocialMediaIcon>
                    <SocialMediaIcon href={Bio.instagram} target="display">
                        <InstagramIcon />
                    </SocialMediaIcon>
                </SocialMediaIcons>
                <Copyright>
                    &copy; 2024 Yusup Rejebov. All rights reserved.
                </Copyright>
            </FooterWrapper>
        </FooterContainer>
    );
}

export default Footer;
