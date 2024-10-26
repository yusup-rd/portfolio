import { useState } from "react";
import styled from "styled-components";
import FacebookIcon from "@mui/icons-material/Facebook";
import TelegramIcon from "@mui/icons-material/Telegram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
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
const ThemeLink = styled.span`
    color: ${({ theme }) => theme.border};
    text-decoration: none;
    font-size: 1.2rem;
    border: 1px solid ${({ theme }) => theme.border};
    padding: 5px 20px;
    border-radius: 15px;
    transition: color 0.2s ease-in-out;
    cursor: pointer;
    &:hover {
        color: ${({ theme }) => theme.border + 99};
    }
    @media (max-width: 768px) {
        font-size: 1rem;
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

const ThemeOptions = styled.div`
    display: flex;
    flex-direction: column;
    // text-align: center;
    gap: 8px;
`;
const ThemeOption = styled.p`
    font-size: 14px;
    cursor: pointer;
    transition: color 0.2s ease-in-out;
    &:hover {
        color: ${({ theme }) => theme.primary};
    }
    ${({ isSelected, theme }) =>
        isSelected
            ? `
        color: ${theme.primary};
        border-radius: 8px;
    `
            : ""}
`;

function Footer({ changeTheme, selectedThemeIndex, setSelectedThemeIndex }) {
    const [showThemeOptions, setShowThemeOptions] = useState(false);

    const toggleThemeOptions = () => {
        setShowThemeOptions(!showThemeOptions);
    };

    const handleThemeChange = (themeIndex) => {
        changeTheme(themeIndex);
        setShowThemeOptions(false);
        setSelectedThemeIndex(themeIndex);
    };

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
                <Nav>
                    <ThemeLink onClick={toggleThemeOptions}>
                        Theme Color
                    </ThemeLink>
                </Nav>
                {showThemeOptions && (
                    <ThemeOptions>
                        {themes.map((theme, index) => (
                            <ThemeOption
                                key={index}
                                isSelected={index === selectedThemeIndex}
                                onClick={() => handleThemeChange(index)}
                            >
                                {theme.name}
                            </ThemeOption>
                        ))}
                    </ThemeOptions>
                )}
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
