"use client";

import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { useThemeMode } from "@/app/lib/hooks/useThemeMode";
import { SIDEBAR_BORDER } from "@/app/lib/sidebarColors";
import LanguageSwitcher from "./LanguageSwitcher";

interface SidebarUserFooterProps {
  variant: "dark" | "light";
}

export default function SidebarUserFooter({ variant }: SidebarUserFooterProps) {
  const t = useTranslations("Sidebar");
  const router = useRouter();
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();

  if (!user) {
    return null;
  }

  const initials = `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase();
  const isDark = variant === "dark";

  async function handleLogout() {
    await logout();
    router.push("/auth/sign-in");
  }

  return (
    <Box
      sx={{
        px: 1,
        py: 1.25,
        borderTop: "1px solid",
        borderColor: isDark ? SIDEBAR_BORDER : "divider",
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            bgcolor: "secondary.main",
            color: "primary.dark",
            fontSize: 13,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {initials}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: isDark ? "#fff" : "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.name} {user.surname}
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: isDark ? "rgba(255,255,255,0.6)" : "text.secondary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.email}
          </Typography>
        </Box>
        <LanguageSwitcher variant="pill" isDark={isDark} />
        <Tooltip title={mode === "dark" ? t("lightMode") : t("darkMode")}>
          <IconButton
            onClick={toggleMode}
            size="small"
            sx={{
              flexShrink: 0,
              color: isDark ? "rgba(255,255,255,0.72)" : "text.secondary",
              "&:hover": { color: isDark ? "#fff" : "primary.main" },
            }}
          >
            {mode === "dark" ? (
              <LightModeOutlinedIcon fontSize="small" />
            ) : (
              <DarkModeOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Stack>

      <Box
        component="button"
        onClick={handleLogout}
        sx={{
          display: "block",
          width: "100%",
          textAlign: "left",
          fontFamily: "inherit",
          fontSize: 12,
          fontWeight: 600,
          color: isDark ? "rgba(255,255,255,0.72)" : "text.secondary",
          bgcolor: "transparent",
          border: 0,
          cursor: "pointer",
          mt: 1,
          px: 0.25,
          py: 0.375,
          "&:hover": {
            color: isDark ? "#fff" : "primary.main",
          },
        }}
      >
        {t("logout")}
      </Box>
    </Box>
  );
}
