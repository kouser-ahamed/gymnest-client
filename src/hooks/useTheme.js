"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("gymnest-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    document.documentElement.classList.toggle(
      "dark",
      savedTheme === "dark"
    );

    localStorage.setItem("gymnest-theme", savedTheme);
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("gymnest-theme", newTheme);
    setTheme(newTheme);
  };

  return { theme, toggleTheme };
}