import React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { createAnimation } from "./theme-animations";
import { motion } from "framer-motion";

export default function ThemeToggleButton({
  variant = "circle-blur",
  start = "top-left",
  showLabel = false,
  url = "",
}) {
  const { theme, setTheme } = useTheme();
  const styleId = "theme-transition-styles";

  const updateStyles = React.useCallback((css) => {
    if (typeof window === "undefined") return;
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = css;
  }, []);

  const toggleTheme = React.useCallback(() => {
    const animation = createAnimation(variant, start, url);
    updateStyles(animation.css);

    if (typeof window === "undefined") return;

    const switchTheme = () => {
      setTheme(theme === "light" ? "dark" : "light");
    };

    if (!document.startViewTransition) {
      switchTheme();
      return;
    }

    document.startViewTransition(switchTheme);
  }, [theme, setTheme]);

  return (
    <motion.div whileTap={{ rotate: 80 }} transition={{ duration: 0.2 }}>
      <Button
        onClick={toggleTheme}
        size="icon"
        className="group relative h-9 w-9 cursor-pointer !border-none !bg-transparent p-0 text-black !outline-none dark:text-white"
        name="Theme Toggle Button"
      >
        <SunIcon className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <MoonIcon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Theme Toggle</span>

        {showLabel && (
          <>
            <span className="absolute -top-10 hidden rounded-full border px-2 group-hover:block">
              variant = {variant}
            </span>
            <span className="absolute -bottom-10 hidden rounded-full border px-2 group-hover:block">
              start = {start}
            </span>
          </>
        )}
      </Button>
    </motion.div>
  );
}
