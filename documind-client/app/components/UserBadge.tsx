"use client";

import { Box, Stack, Typography } from "@mui/material";
import { useAuth } from "@/app/lib/hooks/useAuth";

export default function UserBadge() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase();
  const fullName = `${user.name} ${user.surname}`.trim();

  return (
    <Stack
      direction="row"
      spacing={1.25}
      sx={{
        alignItems: "center",
        bgcolor: "surfaceSubtle",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "999px",
        pl: 0.5,
        pr: 1.75,
        py: 0.5,
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          bgcolor: "secondary.main",
          color: "secondary.contrastText",
          fontSize: 12,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {initials}
      </Box>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: "text.primary",
          whiteSpace: "nowrap",
        }}
      >
        {fullName}
      </Typography>
    </Stack>
  );
}
