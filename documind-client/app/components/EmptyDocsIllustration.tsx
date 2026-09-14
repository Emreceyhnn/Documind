import { Box } from "@mui/material";

export default function EmptyDocsIllustration() {
  return (
    <Box sx={{ width: 140, height: 96, mx: "auto", mb: 3, position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          left: 14,
          top: 10,
          width: 70,
          height: 86,
          borderRadius: "6px",
          bgcolor: "surfaceHover",
          border: "1px solid",
          borderColor: "divider",
          transform: "rotate(-7deg)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: 40,
          top: 4,
          width: 70,
          height: 86,
          borderRadius: "6px",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "borderStrong",
          boxShadow: "0 4px 12px rgba(15,18,34,0.10)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: 52,
          top: 26,
          width: 46,
          height: 6,
          borderRadius: "3px",
          bgcolor: "divider",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: 52,
          top: 40,
          width: 34,
          height: 6,
          borderRadius: "3px",
          bgcolor: "divider",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: 52,
          top: 54,
          width: 42,
          height: 6,
          borderRadius: "3px",
          bgcolor: "divider",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: 4,
          bottom: 0,
          width: 34,
          height: 34,
          borderRadius: "50%",
          bgcolor: "statusReady.light",
          border: "1px solid",
          borderColor: "statusReady.main",
        }}
      />
    </Box>
  );
}
