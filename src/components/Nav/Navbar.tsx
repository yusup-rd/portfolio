import { useEffect, useState } from "react";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import type { Theme } from "../../hooks/useTheme";
import AnimatedHeight from "../ui/AnimatedHeight";
import ThemeToggle from "../ui/ThemeToggle";
interface NavbarProps {
    theme: Theme;
    toggleTheme: () => void;
}
const links = [
    ["Work", "projects"],
    ["Experience", "experience"],
    ["Expertise", "skills"],
    ["Contact", "contact"],
] as const;
const Navbar = ({ theme, toggleTheme }: NavbarProps) => {
    const [open, setOpen] = useState(false);
    const [instant, setInstant] = useState(false);
    useEffect(() => {
        const close = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setInstant(true);
                setOpen(false);
            }
        };
        const resize = () => {
            if (innerWidth >= 768) setOpen(false);
        };
        addEventListener("keydown", close);
        addEventListener("resize", resize);
        return () => {
            removeEventListener("keydown", close);
            removeEventListener("resize", resize);
        };
    }, []);
    return (
        <header className="site-nav">
            <div className="page-shell flex h-20 items-center justify-between gap-4">
                <a
                    href="#about"
                    aria-label="Yusup Rejebov, back to top"
                    className="flex items-center gap-3 font-semibold tracking-tight"
                >
                    <span className="monogram">
                        yr<span className="text-primary">.</span>
                    </span>
                    <span className="hidden text-sm sm:inline">
                        Yusup Rejebov
                    </span>
                </a>
                <nav
                    aria-label="Main navigation"
                    className="hidden items-center gap-7 md:flex"
                >
                    {links.map(([label, id]) => (
                        <a className="nav-link" key={id} href={"#" + id}>
                            {label}
                        </a>
                    ))}
                </nav>
                <div className="flex items-center gap-3">
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    <a
                        className="button button-primary hidden sm:inline-flex"
                        href="#contact"
                    >
                        Let’s talk <FiArrowUpRight aria-hidden="true" />
                    </a>
                    <button
                        type="button"
                        className="icon-button md:hidden"
                        aria-label={
                            open ? "Close navigation" : "Open navigation"
                        }
                        aria-expanded={open}
                        aria-controls="mobile-navigation"
                        onClick={(event) => {
                            setInstant(event.detail === 0);
                            setOpen(!open);
                        }}
                    >
                        {open ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>
            <AnimatedHeight
                open={open}
                instant={instant}
                id="mobile-navigation"
                className="md:hidden"
            >
                <nav
                    aria-label="Mobile navigation"
                    className="mobile-menu page-shell md:hidden"
                >
                    {links.map(([label, id]) => (
                        <a
                            key={id}
                            href={"#" + id}
                            onClick={(event) => {
                                setInstant(event.detail === 0);
                                setOpen(false);
                            }}
                            className="nav-link py-3 text-xl"
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            </AnimatedHeight>
        </header>
    );
};
export default Navbar;
