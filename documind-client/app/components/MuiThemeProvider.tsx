"use client";

import type { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "../lib/theme";

export default function MuiThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider theme={theme} defaultMode="light">
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
