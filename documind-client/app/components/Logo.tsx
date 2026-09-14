import { Box, Stack, Typography } from "@mui/material";

interface LogoProps {
  size?: "small" | "medium" | "large";
  color?: "dark" | "light";
}

const SIZES = {
  small: { box: 28, mark: 11, border: 2.5, font: 16 },
  medium: { box: 38, mark: 14, border: 3, font: 24 },
  large: { box: 38, mark: 14, border: 3, font: 24 },
} as const;

export default function Logo({ size = "medium", color = "dark" }: LogoProps) {
  const s = SIZES[size];
  const textColor = color === "dark" ? "primary.dark" : "common.white";

  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
      <Box
        sx={{
          width: s.box,
          height: s.box,
          borderRadius: "8px",
          bgcolor: color === "dark" ? "primary.dark" : "rgba(255,255,255,0.16)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            color === "dark" ? "0 4px 12px rgba(55,48,163,0.28)" : "none",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: s.mark,
            height: s.mark,
            border: `${s.border}px solid`,
            borderColor: "primary.contrastText",
            borderRadius: "3px",
          }}
        />
      </Box>
      <Typography
        sx={{
          fontSize: s.font,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: textColor,
        }}
      >
        DocuMind
      </Typography>
    </Stack>
  );
}
