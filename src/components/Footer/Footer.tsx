import {
    FiArrowUp,
    FiArrowUpRight,
    FiGithub,
    FiInstagram,
    FiLinkedin,
} from "react-icons/fi";
import { SiTelegram } from "react-icons/si";
import { Bio } from "../../data/constants";
const Footer = () => {
    return (
        <footer className="page-shell flex flex-col gap-8 border-t border-border py-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
                <a className="monogram" href="#about" aria-label="Back to top">
                    yr<span className="text-primary">.</span>
                </a>
                <nav aria-label="Social links" className="flex flex-wrap gap-6">
                    {[
                        ["GitHub", Bio.github],
                        ["LinkedIn", Bio.linkedin],
                        ["Telegram", Bio.telegram],
                        ["Instagram", Bio.instagram],
                    ].map(([label, href]) => (
                        <a
                            key={label}
                            className="text-link text-sm"
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {label === "GitHub" ? (
                                <FiGithub aria-hidden="true" />
                            ) : label === "LinkedIn" ? (
                                <FiLinkedin aria-hidden="true" />
                            ) : label === "Instagram" ? (
                                <FiInstagram aria-hidden="true" />
                            ) : (
                                <SiTelegram aria-hidden="true" />
                            )}
                            {label}
                            <FiArrowUpRight aria-hidden="true" />
                        </a>
                    ))}
                </nav>
                <a
                    href="#about"
                    className="icon-button ml-auto"
                    aria-label="Back to top"
                >
                    <FiArrowUp />
                </a>
            </div>
            <div className="flex flex-wrap justify-between gap-3 text-xs text-text-secondary">
                <p>© {new Date().getFullYear()} Yusup Rejebov</p>
                <p>Built with intention. Refined with curiosity.</p>
            </div>
        </footer>
    );
};
export default Footer;
