import { Box, Typography } from "@mui/material";

interface FileTypeTileProps {
  ext: string;
  size?: "small" | "medium";
}

const SIZES = {
  small: { width: 24, height: 30, radius: 3, font: 7 },
  medium: { width: 40, height: 48, radius: 4, font: 9 },
} as const;

export default function FileTypeTile({
  ext,
  size = "medium",
}: FileTypeTileProps) {
  const s = SIZES[size];
  return (
    <Box
      sx={{
        width: s.width,
        height: s.height,
        flexShrink: 0,
        borderRadius: `${s.radius}px`,
        bgcolor: "surfaceHover",
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        pb: 0.75,
      }}
    >
      <Typography
        sx={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: s.font,
          fontWeight: 500,
          color: "primary.main",
        }}
      >
        {ext}
      </Typography>
    </Box>
  );
}
