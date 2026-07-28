import { useEffect, useState } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { Button } from "./Button";

export const THEME_STORAGE_KEY = "cms-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // localStorage puede no estar disponible (modo privado, etc.)
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      color="black"
      size="extrasmall"
      onClick={toggle}
      title={theme === "light" ? "Cambiar a tema oscuro" : "Cambiar a tema claro"}
    >
      {theme === "light" ? <IoMoonOutline /> : <IoSunnyOutline />}
    </Button>
  );
}
