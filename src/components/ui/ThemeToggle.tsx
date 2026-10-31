import { FiMoon, FiSun } from "react-icons/fi";
import type { Theme } from "../../hooks/useTheme";
interface ThemeToggleProps {
    theme: Theme;
    toggleTheme: () => void;
}
const ThemeToggle = ({ theme, toggleTheme }: ThemeToggleProps) => {
    return (
        <button
            className="theme-toggle pressable"
            type="button"
            onClick={toggleTheme}
            aria-label={
                theme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
            }
        >
            <span className="theme-icon" data-active={theme === "light"}>
                <FiSun />
            </span>
            <span className="theme-icon" data-active={theme === "dark"}>
                <FiMoon />
            </span>
        </button>
    );
};
export default ThemeToggle;
