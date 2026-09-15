"use client";

import { Box, Button, Drawer, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "./Logo";
import SidebarUserFooter from "./SidebarUserFooter";
import { useAuth } from "@/app/lib/hooks/useAuth";
import {
  SIDEBAR_BG,
  SIDEBAR_BG_ACTIVE,
  SIDEBAR_BG_HOVER,
  SIDEBAR_BORDER,
  SIDEBAR_TEXT,
  SIDEBAR_TEXT_ACTIVE,
  SIDEBAR_TEXT_MUTED,
} from "@/app/lib/sidebarColors";

export const SIDEBAR_WIDTH = 240;

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const t = useTranslations("Sidebar");
  const tChat = useTranslations("Chat");
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: "/docs", label: t("documents"), active: pathname === "/docs" },
    { href: "/chat", label: t("chat"), active: pathname === "/chat" },
  ];

  const settingsActive = pathname === "/settings";
  const onChatPage = pathname === "/chat";

  const content = (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        bgcolor: SIDEBAR_BG,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        px: 2,
        py: 2.5,
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", px: 0.5, pb: 2.5 }}>
        <Logo size="small" color="light" />
        <IconButton
          onClick={onMobileClose}
          size="small"
          sx={{
            display: { xs: "inline-flex", md: "none" },
            color: "rgba(255,255,255,0.72)",
            "&:hover": { color: "#fff", bgcolor: SIDEBAR_BG_HOVER },
          }}
          aria-label={t("closeMenu")}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box
        sx={{
          p: 1.5,
          borderRadius: "8px",
          bgcolor: "rgba(255,255,255,0.05)",
          border: "1px solid",
          borderColor: SIDEBAR_BORDER,
          mb: 2.5,
        }}
      >
        <Typography
          sx={{
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: SIDEBAR_TEXT_MUTED,
            mb: 0.625,
          }}
        >
          {t("workspace")}
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
          {user?.companyName || t("workspaceName")}
        </Typography>
      </Box>

      <Stack spacing={0.25}>
        {navItems.map((item) => (
          <Box
            key={item.href}
            component={Link}
            href={item.href}
            onClick={onMobileClose}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              px: 1.5,
              py: 1.25,
              borderRadius: "6px",
              fontSize: 14,
              fontWeight: item.active ? 600 : 400,
              color: item.active ? SIDEBAR_TEXT_ACTIVE : SIDEBAR_TEXT,
              bgcolor: item.active ? SIDEBAR_BG_ACTIVE : "transparent",
              textDecoration: "none",
              cursor: "pointer",
              "&:hover": {
                bgcolor: item.active ? SIDEBAR_BG_ACTIVE : SIDEBAR_BG_HOVER,
                color: SIDEBAR_TEXT_ACTIVE,
              },
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "2px",
                bgcolor: item.active ? "primary.light" : SIDEBAR_TEXT_MUTED,
              }}
            />
            {item.label}
          </Box>
        ))}
        <Box
          component={Link}
          href="/settings"
          onClick={onMobileClose}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 1.5,
            py: 1.25,
            borderRadius: "6px",
            fontSize: 14,
            fontWeight: settingsActive ? 600 : 400,
            color: settingsActive ? SIDEBAR_TEXT_ACTIVE : SIDEBAR_TEXT,
            bgcolor: settingsActive ? SIDEBAR_BG_ACTIVE : "transparent",
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": {
              bgcolor: settingsActive ? SIDEBAR_BG_ACTIVE : SIDEBAR_BG_HOVER,
              color: SIDEBAR_TEXT_ACTIVE,
            },
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "2px",
              bgcolor: settingsActive ? "primary.light" : SIDEBAR_TEXT_MUTED,
            }}
          />
          {t("settings")}
        </Box>
      </Stack>

      {onChatPage && (
        <Box sx={{ mt: 2.5 }}>
          <Button
            component={Link}
            href="/docs"
            onClick={onMobileClose}
            variant="outlined"
            fullWidth
            sx={{
              fontSize: 13,
              color: "#fff",
              borderColor: "rgba(255,255,255,0.16)",
              py: 1,
              "&:hover": {
                bgcolor: SIDEBAR_BG_HOVER,
                borderColor: "rgba(255,255,255,0.3)",
              },
            }}
          >
            {tChat("addDocument")}
          </Button>
        </Box>
      )}

      <Box sx={{ flex: 1 }} />

      <SidebarUserFooter variant="dark" />
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          flexShrink: 0,
          height: "100vh",
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          borderRight: "1px solid",
          borderColor: SIDEBAR_BORDER,
        }}
      >
        {content}
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: SIDEBAR_WIDTH,
            border: "none",
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}
