"use client";

import { Skeleton, Stack } from "@mui/material";

export default function DocumentRowSkeleton() {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: "center",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px",
        px: 2.25,
        py: 2,
      }}
    >
      <Skeleton variant="rounded" width={40} height={40} sx={{ flexShrink: 0, borderRadius: "8px" }} />
      <Stack sx={{ flex: 1, minWidth: 0 }} spacing={0.75}>
        <Skeleton variant="text" width="45%" height={20} />
        <Skeleton variant="text" width="25%" height={14} />
      </Stack>
      <Skeleton variant="rounded" width={72} height={24} sx={{ borderRadius: "6px", flexShrink: 0 }} />
      <Skeleton variant="circular" width={28} height={28} sx={{ flexShrink: 0 }} />
    </Stack>
  );
}
