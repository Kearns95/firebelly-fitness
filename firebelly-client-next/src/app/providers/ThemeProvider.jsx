import { useEffect } from "react";
import { useSelector } from "react-redux";

/**
 * Applies the active Firebelly theme as a class on <html>.
 *
 * The copied Redux `states.jsx` seeds `user.themeMode` from
 * localStorage('theme'), which is absent (null) in this fresh app — so the
 * default resolves to "moor" (the brand dark default). Only "light" drops the
 * `dark` class; every other theme is a dark recoloring (see DESIGN.md).
 */
const DARK_THEMES = new Set(["moor", "forest", "ember", "dark", null, undefined, ""]);

export function ThemeProvider({ children }) {
  const themeMode = useSelector((state) => state.user?.themeMode);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = DARK_THEMES.has(themeMode);
    root.classList.toggle("dark", isDark);
    root.dataset.theme = themeMode || "moor";
  }, [themeMode]);

  return children;
}

export default ThemeProvider;
