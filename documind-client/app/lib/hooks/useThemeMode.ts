"use client";

import { useColorScheme } from "@mui/material/styles";

export function useThemeMode() {
  const { mode, setMode } = useColorScheme();

  const resolvedMode = mode === "system" ? "light" : (mode ?? "light");

  const toggleMode = () => {
    setMode(resolvedMode === "dark" ? "light" : "dark");
  };

  return { mode: resolvedMode, toggleMode };
}
