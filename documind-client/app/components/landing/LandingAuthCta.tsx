"use client";

import { Button, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/app/lib/hooks/useAuth";

interface SecondaryAction {
  label: string;
  href: string;
  /** Hide the secondary action for signed-in visitors (e.g. "Log in"). */
  hideWhenAuthed?: boolean;
  /** Hide it on narrow screens, for tight places such as the header. */
  hideOnMobile?: boolean;
  /** Render it to the left of the primary button (e.g. "Log in" in the header). */
  first?: boolean;
}

interface LandingAuthCtaProps {
  primary: string;
  openApp: string;
  secondary?: SecondaryAction;
  size?: "medium" | "large";
  tone?: "default" | "onDark";
  showArrow?: boolean;
}

/**
 * Primary call to action. Signed-in visitors get a direct link into the app
 * instead of the sign-up form. The auth state is seeded on the server, so the
 * first paint already matches the visitor.
 */
export default function LandingAuthCta({
  primary,
  openApp,
  secondary,
  size = "medium",
  tone = "default",
  showArrow = true,
}: LandingAuthCtaProps) {
  const { status } = useAuth();
  const authed = status === "authenticated";
  const onDark = tone === "onDark";

  const showSecondary = secondary && !(authed && secondary.hideWhenAuthed);
  const secondaryIsAnchor = secondary?.href.startsWith("#");

  const primaryButton = (
    <Button
      key="primary"
      component={Link}
      href={authed ? "/docs" : "/auth/sign-up"}
      variant="contained"
      size={size}
      endIcon={showArrow ? <ArrowForwardIcon /> : undefined}
      sx={
        onDark
          ? {
              // The theme styles .MuiButton-colorPrimary with higher
              // specificity than a plain sx key, so target it explicitly.
              "&.MuiButton-colorPrimary": {
                backgroundColor: "#FFFFFF",
                color: "#3730A3",
                boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                "&:hover": {
                  backgroundColor: "#EEF0FE",
                  boxShadow: "0 8px 22px rgba(0,0,0,0.3)",
                },
              },
            }
          : size === "large"
            ? { px: 3.5, py: 1.4, fontSize: 16 }
            : undefined
      }
    >
      {authed ? openApp : primary}
    </Button>
  );

  const secondaryButton =
    showSecondary && secondary ? (
      <Button
        key="secondary"
        {...(secondaryIsAnchor
          ? { component: "a" as const, href: secondary.href }
          : { component: Link, href: secondary.href })}
        variant={onDark ? "outlined" : "text"}
        size={size}
        sx={[
          onDark
            ? {
                color: "#FFFFFF",
                borderColor: "rgba(255,255,255,0.55)",
                "&:hover": {
                  borderColor: "#FFFFFF",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }
            : {
                color: "text.primary",
                ...(size === "large" ? { px: 2.5, py: 1.4, fontSize: 16 } : {}),
              },
          secondary.hideOnMobile
            ? { display: { xs: "none", sm: "inline-flex" } }
            : {},
        ]}
      >
        {secondary.label}
      </Button>
    ) : null;

  // Keep DOM order identical to the visual order so Tab order matches.
  const buttons = secondary?.first
    ? [secondaryButton, primaryButton]
    : [primaryButton, secondaryButton];

  return (
    <Stack
      direction="row"
      sx={{ alignItems: "center", flexWrap: "wrap", gap: 1.5 }}
    >
      {buttons}
    </Stack>
  );
}
