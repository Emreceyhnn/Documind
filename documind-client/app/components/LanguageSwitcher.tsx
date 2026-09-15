"use client";

import { useState } from "react";
import { Box, Button, Menu, MenuItem, Stack, Typography } from "@mui/material";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

interface LanguageSwitcherProps {
  variant?: "button" | "pill" | "select";
  color?: string;
  isDark?: boolean;
}

export default function LanguageSwitcher({
  variant = "button",
  color,
  isDark = false,
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (newLocale: "tr" | "en") => {
    handleClose();
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
    }
  };

  if (variant === "pill") {
    return (
      <Box
        sx={{
          display: "inline-flex",
          p: 0.5,
          borderRadius: "20px",
          bgcolor: isDark ? "rgba(255,255,255,0.08)" : "action.hover",
          border: "1px solid",
          borderColor: isDark ? "rgba(255,255,255,0.12)" : "divider",
        }}
      >
        <Button
          size="small"
          onClick={() => handleSelect("tr")}
          sx={{
            py: 0.3,
            px: 1.25,
            minWidth: 0,
            fontSize: 12,
            fontWeight: 700,
            borderRadius: "16px",
            bgcolor: locale === "tr" ? "primary.main" : "transparent",
            color:
              locale === "tr"
                ? "#fff"
                : isDark
                  ? "rgba(255,255,255,0.7)"
                  : "text.secondary",
            "&:hover": {
              bgcolor: locale === "tr" ? "primary.dark" : "action.hover",
            },
          }}
        >
          TR
        </Button>
        <Button
          size="small"
          onClick={() => handleSelect("en")}
          sx={{
            py: 0.3,
            px: 1.25,
            minWidth: 0,
            fontSize: 12,
            fontWeight: 700,
            borderRadius: "16px",
            bgcolor: locale === "en" ? "primary.main" : "transparent",
            color:
              locale === "en"
                ? "#fff"
                : isDark
                  ? "rgba(255,255,255,0.7)"
                  : "text.secondary",
            "&:hover": {
              bgcolor: locale === "en" ? "primary.dark" : "action.hover",
            },
          }}
        >
          EN
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        size="small"
        startIcon={<LanguageOutlinedIcon fontSize="small" />}
        sx={{
          minWidth: "auto",
          fontSize: 12,
          fontWeight: 600,
          textTransform: "uppercase",
          color:
            color ||
            (isDark ? "rgba(255,255,255,0.85)" : "text.secondary"),
          px: 1,
          py: 0.5,
          borderRadius: "6px",
          border: "1px solid",
          borderColor: isDark ? "rgba(255,255,255,0.16)" : "divider",
          "&:hover": {
            bgcolor: isDark ? "rgba(255,255,255,0.1)" : "action.hover",
            borderColor: isDark ? "rgba(255,255,255,0.3)" : "primary.main",
          },
        }}
      >
        {locale === "tr" ? "TR" : "EN"}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              mt: 0.75,
              borderRadius: "8px",
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.08)",
              minWidth: 140,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => handleSelect("tr")}
          selected={locale === "tr"}
          sx={{ fontSize: 13, py: 1 }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", width: "100%", justifyContent: "space-between" }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
              🇹🇷 Türkçe
            </Typography>
            {locale === "tr" && <CheckIcon fontSize="small" color="primary" />}
          </Stack>
        </MenuItem>

        <MenuItem
          onClick={() => handleSelect("en")}
          selected={locale === "en"}
          sx={{ fontSize: 13, py: 1 }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", width: "100%", justifyContent: "space-between" }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
              🇬🇧 English
            </Typography>
            {locale === "en" && <CheckIcon fontSize="small" color="primary" />}
          </Stack>
        </MenuItem>
      </Menu>
    </>
  );
}
