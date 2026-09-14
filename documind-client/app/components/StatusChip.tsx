import { Box, Stack, Typography } from "@mui/material";
import type { DocStatus } from "../lib/type/ui";

const STATUS_PALETTE_KEY: Record<DocStatus, "statusReady" | "statusProcessing" | "statusError"> = {
  ready: "statusReady",
  processing: "statusProcessing",
  error: "statusError",
};

const PULSE: Record<DocStatus, boolean> = {
  ready: false,
  processing: true,
  error: false,
};

interface StatusChipProps {
  status: DocStatus;
  label: string;
}

export default function StatusChip({ status, label }: StatusChipProps) {
  const paletteKey = STATUS_PALETTE_KEY[status] ?? "statusError";
  const pulse = PULSE[status] ?? false;

  return (
    <Stack
      direction="row"
      spacing={0.875}
      sx={{
        alignItems: "center",
        px: 1.5,
        py: 0.75,
        borderRadius: 999,
        bgcolor: `${paletteKey}.light`,
        border: "1px solid",
        borderColor: `${paletteKey}.main`,
        flexShrink: 0,
        width: "fit-content",
      }}
    >
      <Box
        sx={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          bgcolor: `${paletteKey}.main`,
          animation: pulse ? "dm-pulse 1.4s ease-in-out infinite" : "none",
          "@keyframes dm-pulse": {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.45 },
          },
        }}
      />
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: `${paletteKey}.contrastText` }}>
        {label}
      </Typography>
    </Stack>
  );
}
