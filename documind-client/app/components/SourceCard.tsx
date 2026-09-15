import { Box, Stack, Typography } from "@mui/material";
import type { ChatSource } from "../lib/type/ui";

interface SourceCardProps {
  source: ChatSource;
}

export default function SourceCard({ source }: SourceCardProps) {
  return (
    <Box
      sx={{
        flex: { xs: "1 1 100%", sm: "1 1 280px" },
        minWidth: 0,
        bgcolor: "surfaceSubtle",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px",
        px: 1.75,
        py: 1.5,
        cursor: "pointer",
        "&:hover": {
          bgcolor: "surfaceHover",
          borderColor: "primary.light",
          boxShadow: "0 3px 12px rgba(15,18,34,0.10)",
        },
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.875 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-ibm-plex-mono)",
            fontSize: 9,
            fontWeight: 500,
            color: "primary.main",
            bgcolor: "secondary.main",
            borderRadius: "3px",
            px: 0.625,
            py: 0.25,
          }}
        >
          {source.ext}
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
          }}
        >
          {source.name}
        </Typography>
        <Typography
          sx={{
            flexShrink: 0,
            fontFamily: "var(--font-ibm-plex-mono)",
            fontSize: 11,
            color: "text.secondary",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 999,
            px: 1,
            py: 0.25,
          }}
        >
          {source.page}
        </Typography>
      </Stack>
      <Typography
        sx={{
          fontSize: 12,
          lineHeight: 1.55,
          color: "text.secondary",
          borderLeft: "2px solid",
          borderColor: "secondary.main",
          pl: 1.125,
        }}
      >
        {source.snippet}
      </Typography>
    </Box>
  );
}
