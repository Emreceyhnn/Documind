import { Box, Stack, Typography } from "@mui/material";
import { Link } from "@/i18n/navigation";

interface LogoProps {
  size?: "small" | "medium" | "large";
  color?: "dark" | "light";
  showText?: boolean;
  clickable?: boolean;
}

const SIZES = {
  small: { box: 30, icon: 18, font: 16 },
  medium: { box: 38, icon: 22, font: 22 },
  large: { box: 48, icon: 28, font: 28 },
} as const;

export default function Logo({
  size = "medium",
  color = "dark",
  showText = true,
  clickable = false,
}: LogoProps) {
  const s = SIZES[size];
  const isLight = color === "light";

  const content = (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", display: "inline-flex" }}>
      <Box
        sx={{
          width: s.box,
          height: s.box,
          borderRadius: "9px",
          background: isLight
            ? "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)"
            : "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isLight
            ? "0 2px 10px rgba(99,102,241,0.35)"
            : "0 4px 14px rgba(55,48,163,0.32)",
          flexShrink: 0,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": clickable
            ? {
                transform: "scale(1.05)",
                boxShadow: "0 6px 18px rgba(79,70,229,0.45)",
              }
            : {},
        }}
      >
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 3C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V9L14 3H6Z"
            fill="white"
            fillOpacity="0.2"
            stroke="white"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M14 3V9H20"
            stroke="white"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 11V16M9.5 13.5H14.5"
            stroke="white"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <circle cx="12" cy="13.5" r="1.25" fill="#38BDF8" />
        </svg>
      </Box>

      {showText && (
        <Typography
          sx={{
            fontSize: s.font,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: isLight ? "#FFFFFF" : "text.primary",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          Docu
          <Box
            component="span"
            sx={{
              background: isLight
                ? "linear-gradient(135deg, #A5B4FC 0%, #C7D2FE 100%)"
                : "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Mind
          </Box>
        </Typography>
      )}
    </Stack>
  );

  if (clickable) {
    return (
      <Box
        component={Link}
        href="/docs"
        sx={{
          textDecoration: "none",
          color: "inherit",
          display: "inline-flex",
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
}
