import { memo } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleTheme } from "../features/theme/themeSlice";
import type { BaseComponentProps } from "../types";

interface ThemeToggleProps extends BaseComponentProps {
  size?: "small" | "medium" | "large";
}

/**
 * Theme toggle component for switching between light and dark modes
 * Uses Redux for state management
 */
export const ThemeToggle = memo<ThemeToggleProps>(
  ({ size = "medium", className = "" }) => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.theme.mode);

    const handleToggle = () => {
      dispatch(toggleTheme());
    };

    const isDark = theme === "dark";

    return (
      <button
        onClick={handleToggle}
        className={`theme-toggle theme-toggle--${size} ${className}`}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <div className="theme-toggle__track">
          <div
            className={`theme-toggle__thumb ${isDark ? "theme-toggle__thumb--dark" : ""}`}
          >
            <span className="theme-toggle__icon">{isDark ? "🌙" : "☀️"}</span>
          </div>
        </div>
        <span className="theme-toggle__label">{isDark ? "Dark" : "Light"}</span>
      </button>
    );
  },
);

ThemeToggle.displayName = "ThemeToggle";

export default ThemeToggle;
