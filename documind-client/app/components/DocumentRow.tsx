"use client";

import { useState } from "react";
import { IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { useTranslations } from "next-intl";
import type { DocumentItem } from "../lib/type/ui";
import FileTypeTile from "./FileTypeTile";
import StatusChip from "./StatusChip";

interface DocumentRowProps {
  doc: DocumentItem;
  onOpen?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function DocumentRow({ doc, onOpen, onDelete }: DocumentRowProps) {
  const t = useTranslations("Docs");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorEl);

  const statusLabel = {
    ready: t("statusReady"),
    processing: t("statusProcessing"),
    error: t("statusError"),
  }[doc.status];

  function handleMenuOpen(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    handleMenuClose();
    onDelete?.(doc.id);
  }

  return (
    <Stack
      direction="row"
      spacing={{ xs: 1.25, sm: 2 }}
      useFlexGap
      onClick={() => onOpen?.(doc.id)}
      sx={{
        alignItems: "center",
        flexWrap: "wrap",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px",
        px: { xs: 1.5, sm: 2.25 },
        py: { xs: 1.5, sm: 2 },
        boxShadow: "0 1px 2px rgba(15,18,34,0.06)",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(15,18,34,0.12)",
          borderColor: "borderStrong",
        },
      }}
    >
      <FileTypeTile ext={doc.ext} />
      <Stack sx={{ flex: "1 1 140px", minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.005em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {doc.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-ibm-plex-mono)",
            fontSize: 12,
            color: "text.disabled",
            mt: 0.5,
          }}
        >
          {doc.meta}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", flexShrink: 0, ml: "auto" }}>
        <StatusChip status={doc.status} label={statusLabel} />
        <IconButton size="small" onClick={handleMenuOpen} sx={{ color: "text.disabled" }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose} onClick={(e) => e.stopPropagation()}>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "statusError.main" }}>
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
          {t("deleteDocument")}
        </MenuItem>
      </Menu>
    </Stack>
  );
}
