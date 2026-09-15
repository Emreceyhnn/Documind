import { Box, Stack } from "@mui/material";
import type { ReactNode } from "react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

interface AuthShellProps {
  children: ReactNode;
  footer?: ReactNode;
  gradient?: boolean;
  maxWidth?: number;
}

export default function AuthShell({
  children,
  footer,
  gradient = false,
  maxWidth = 420,
}: AuthShellProps) {
  return (
    <Box
      sx={[
        {
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          alignItems: "safe center",
          justifyContent: "center",
          overflowY: "auto",
          position: "relative",
          px: { xs: 2, sm: 3 },
          pt: { xs: 7, sm: 6 },
          pb: { xs: 4, sm: 6 },
          background: gradient
            ? "linear-gradient(160deg, #EEF0FE 0%, #F8F9FC 55%, #E6E9FC 100%)"
            : "background.default",
        },
        (theme) =>
          gradient
            ? theme.applyStyles("dark", {
                background: "linear-gradient(160deg, #14162A 0%, #0B0D17 55%, #1B1740 100%)",
              })
            : {},
      ]}
    >
      <Box sx={{ position: "absolute", top: { xs: 12, sm: 20 }, right: { xs: 12, sm: 24 } }}>
        <LanguageSwitcher variant="button" />
      </Box>

      <Box sx={{ width: "100%", maxWidth }}>
        <Stack sx={{ alignItems: "center", mb: { xs: 2.75, sm: 3.5 } }}>
          <Logo size="medium" />
        </Stack>

        <Box
          sx={[
            {
              bgcolor: "background.paper",
              borderRadius: "14px",
              px: { xs: 2.5, sm: 4 },
              pt: { xs: 3.5, sm: 4.5 },
              pb: { xs: 3, sm: 3.75 },
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 1px 2px rgba(15,18,34,0.06), 0 12px 32px rgba(15,18,34,0.08)",
            },
            (theme) =>
              theme.applyStyles("dark", {
                boxShadow: "0 1px 2px rgba(0,0,0,0.4), 0 12px 32px rgba(0,0,0,0.45)",
              }),
          ]}
        >
          {children}
        </Box>

        {footer && (
          <Box sx={{ mt: 2.75, textAlign: "center" }}>{footer}</Box>
        )}
      </Box>
    </Box>
  );
}
