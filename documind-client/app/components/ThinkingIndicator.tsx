import { Box, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function ThinkingIndicator() {
  const t = useTranslations("Chat");

  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          borderRadius: "8px",
          bgcolor: "primary.dark",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            border: "2.5px solid",
            borderColor: "primary.contrastText",
            borderRadius: "2px",
          }}
        />
      </Box>
      <Stack
        direction="row"
        spacing={1.125}
        sx={{
          alignItems: "center",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          px: 2.25,
          py: 1.625,
          borderRadius: "12px 12px 12px 4px",
          boxShadow: "0 1px 3px rgba(15,18,34,0.07)",
        }}
      >
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            bgcolor: "statusProcessing.main",
            animation: "dm-pulse 1.2s ease-in-out infinite",
            "@keyframes dm-pulse": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.45 },
            },
          }}
        />
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          {t("thinking")}
        </Typography>
      </Stack>
    </Stack>
  );
}
