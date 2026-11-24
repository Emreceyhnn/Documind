import type { ReactNode } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslations } from "next-intl";
import LandingAuthCta from "./LandingAuthCta";
import ProductPreview from "./ProductPreview";
import {
  GITHUB_URL,
  SECTION_IDS,
  containerSx,
  primaryTint,
  sectionSx,
} from "./constants";

const mono = "var(--font-ibm-plex-mono), ui-monospace, monospace";
const darkScheme = "[data-mui-color-scheme='dark'] &";

const h2Sx = {
  fontSize: { xs: 28, sm: 34, md: 40 },
  fontWeight: 700,
  letterSpacing: "-0.03em",
  lineHeight: 1.12,
  color: "text.primary",
  textWrap: "balance",
} as const;

const leadSx = {
  fontSize: { xs: 16, md: 18 },
  lineHeight: 1.65,
  color: "text.secondary",
} as const;

function SectionHeading({
  id,
  title,
  subtitle,
  align = "center",
}: {
  id: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <Box
      sx={{
        textAlign: align,
        maxWidth: 680,
        mx: align === "center" ? "auto" : 0,
        mb: { xs: 5, md: 7 },
      }}
    >
      <Typography component="h2" id={id} sx={h2Sx}>
        {title}
      </Typography>
      {subtitle && (
        <Typography sx={{ ...leadSx, mt: 2 }}>{subtitle}</Typography>
      )}
    </Box>
  );
}

function IconTile({ children }: { children: ReactNode }) {
  return (
    <Box
      aria-hidden
      sx={{
        width: 44,
        height: 44,
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "primary.main",
        bgcolor: primaryTint(0.1),
        border: "1px solid",
        borderColor: primaryTint(0.22),
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

export function Hero() {
  const t = useTranslations("Landing");

  return (
    <Box
      component="section"
      aria-labelledby="hero-title"
      sx={{
        position: "relative",
        overflow: "hidden",
        pt: { xs: 7, md: 11 },
        pb: { xs: 9, md: 12 },
        background: `radial-gradient(70% 55% at 50% -5%, ${primaryTint(0.2)} 0%, transparent 72%)`,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(var(--mui-palette-divider) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(70% 60% at 50% 20%, #000 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(70% 60% at 50% 20%, #000 0%, transparent 100%)",
          opacity: 0.55,
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          ...containerSx,
          position: "relative",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 1fr) minmax(0, 1.05fr)",
          },
          alignItems: "center",
          gap: { xs: 7, md: 8, lg: 10 },
        }}
      >
        <Box>
          <Stack
            direction="row"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.625,
              mb: 3,
              borderRadius: 999,
              border: "1px solid",
              borderColor: primaryTint(0.3),
              bgcolor: primaryTint(0.08),
              color: "primary.main",
              fontFamily: mono,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            <Box
              aria-hidden
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "primary.main",
              }}
            />
            {t("hero.eyebrow")}
          </Stack>

          <Typography
            component="h1"
            id="hero-title"
            sx={{
              fontSize: { xs: 38, sm: 50, md: 54, lg: 62 },
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.04,
              color: "text.primary",
              textWrap: "balance",
            }}
          >
            {t.rich("hero.title", {
              em: (chunks) => (
                <Box
                  component="span"
                  sx={{
                    background:
                      "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    [darkScheme]: {
                      background:
                        "linear-gradient(135deg, #A5B4FC 0%, #C4B5FD 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                    },
                  }}
                >
                  {chunks}
                </Box>
              ),
            })}
          </Typography>

          <Typography sx={{ ...leadSx, mt: 3, maxWidth: 540 }}>
            {t("hero.subtitle")}
          </Typography>

          <Box sx={{ mt: 4.5 }}>
            <LandingAuthCta
              size="large"
              primary={t("hero.primaryCta")}
              openApp={t("nav.openApp")}
              secondary={{
                label: t("hero.secondaryCta"),
                href: `#${SECTION_IDS.howItWorks}`,
              }}
            />
          </Box>

          <Typography
            sx={{
              mt: 3.5,
              fontFamily: mono,
              fontSize: 12,
              lineHeight: 1.7,
              color: "text.secondary",
            }}
          >
            {t("hero.note")}
          </Typography>
        </Box>

        <ProductPreview />
      </Box>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* How it works                                                                */
/* -------------------------------------------------------------------------- */

const STEPS = [
  { key: "upload", Icon: CloudUploadOutlinedIcon },
  { key: "index", Icon: ManageSearchOutlinedIcon },
  { key: "ask", Icon: QuestionAnswerOutlinedIcon },
] as const;

export function HowItWorks() {
  const t = useTranslations("Landing.how");

  return (
    <Box
      component="section"
      id={SECTION_IDS.howItWorks}
      aria-labelledby="how-title"
      sx={{
        ...sectionSx,
        bgcolor: "surfaceSubtle",
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={containerSx}>
        <SectionHeading
          id="how-title"
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Box
          component="ol"
          sx={{
            listStyle: "none",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
            gap: { xs: 2.5, md: 3 },
          }}
        >
          {STEPS.map(({ key, Icon }, index) => (
            <Box
              component="li"
              key={key}
              sx={{
                position: "relative",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "16px",
                p: { xs: 3, md: 3.5 },
              }}
            >
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <IconTile>
                  <Icon />
                </IconTile>
                <Typography
                  aria-hidden
                  sx={{
                    fontFamily: mono,
                    fontSize: 30,
                    fontWeight: 500,
                    lineHeight: 1,
                    // Large text needs 3:1; the primary color clears it in
                    // both light and dark mode.
                    color: "primary.main",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </Typography>
              </Stack>
              <Typography
                component="h3"
                sx={{
                  fontSize: 19,
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                  mb: 1.25,
                }}
              >
                {t(`steps.${key}.title`)}
              </Typography>
              <Typography
                sx={{ fontSize: 15, lineHeight: 1.65, color: "text.secondary" }}
              >
                {t(`steps.${key}.body`)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Features                                                                    */
/* -------------------------------------------------------------------------- */

const FEATURES = [
  { key: "cited", Icon: FactCheckOutlinedIcon },
  { key: "grounded", Icon: VerifiedUserOutlinedIcon },
  { key: "semantic", Icon: TravelExploreOutlinedIcon },
  { key: "team", Icon: GroupsOutlinedIcon },
  { key: "bilingual", Icon: TranslateOutlinedIcon },
  { key: "selfhost", Icon: DnsOutlinedIcon },
] as const;

export function Features() {
  const t = useTranslations("Landing.features");

  return (
    <Box
      component="section"
      id={SECTION_IDS.features}
      aria-labelledby="features-title"
      sx={sectionSx}
    >
      <Box sx={containerSx}>
        <SectionHeading
          id="features-title"
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Box
          component="ul"
          sx={{
            listStyle: "none",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          {FEATURES.map(({ key, Icon }) => (
            <Box
              component="li"
              key={key}
              sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "16px",
                p: { xs: 3, md: 3.5 },
                transition:
                  "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                "&:hover": {
                  borderColor: primaryTint(0.45),
                  boxShadow: "0 14px 34px -14px rgba(55,48,163,0.28)",
                  transform: "translateY(-2px)",
                },
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                  "&:hover": { transform: "none" },
                },
              }}
            >
              <Box sx={{ mb: 2.5 }}>
                <IconTile>
                  <Icon />
                </IconTile>
              </Box>
              <Typography
                component="h3"
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                  mb: 1,
                }}
              >
                {t(`items.${key}.title`)}
              </Typography>
              <Typography
                sx={{ fontSize: 15, lineHeight: 1.65, color: "text.secondary" }}
              >
                {t(`items.${key}.body`)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Under the hood                                                              */
/* -------------------------------------------------------------------------- */

const TECH_STACK = [
  "ASP.NET Core (.NET 10)",
  "PostgreSQL + pgvector",
  "gRPC",
  "Google Gemini",
  "MinIO",
  "Next.js",
  "Docker Compose",
] as const;

export function TechStack() {
  const t = useTranslations("Landing.tech");

  return (
    <Box
      component="section"
      aria-labelledby="tech-title"
      sx={{
        ...sectionSx,
        py: { xs: 8, md: 11 },
        bgcolor: "surfaceSubtle",
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          ...containerSx,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 1fr) minmax(0, 1fr)",
          },
          alignItems: "center",
          gap: { xs: 4, md: 8 },
        }}
      >
        <Box>
          <SectionHeading
            id="tech-title"
            title={t("title")}
            subtitle={t("body")}
            align="left"
          />
          <Box sx={{ mt: -3 }}>
            <Button
              component="a"
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              startIcon={<GitHubIcon />}
              sx={{
                color: "text.primary",
                borderColor: "borderStrong",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "surfaceHover",
                },
              }}
            >
              {t("cta")}
            </Button>
          </Box>
        </Box>

        <Box
          component="ul"
          aria-label={t("listLabel")}
          sx={{
            listStyle: "none",
            display: "flex",
            flexWrap: "wrap",
            gap: 1.25,
          }}
        >
          {TECH_STACK.map((name) => (
            <Box
              component="li"
              key={name}
              sx={{
                fontFamily: mono,
                fontSize: 13,
                fontWeight: 500,
                color: "text.primary",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "10px",
                px: 1.75,
                py: 1,
              }}
            >
              {name}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                         */
/* -------------------------------------------------------------------------- */

export const FAQ_KEYS = [
  "fileTypes",
  "sources",
  "indexing",
  "openSource",
  "stack",
] as const;

export function Faq() {
  const t = useTranslations("Landing.faq");

  return (
    <Box
      component="section"
      id={SECTION_IDS.faq}
      aria-labelledby="faq-title"
      sx={sectionSx}
    >
      <Box sx={{ ...containerSx, maxWidth: 820 }}>
        <SectionHeading id="faq-title" title={t("title")} />

        <Stack sx={{ gap: 1.5 }}>
          {FAQ_KEYS.map((key) => (
            <Box
              component="details"
              key={key}
              sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "14px",
                transition: "border-color 0.2s ease",
                "&[open]": { borderColor: primaryTint(0.4) },
                "&[open] .faq-chevron": { transform: "rotate(180deg)" },
                "@media (prefers-reduced-motion: reduce)": {
                  "& .faq-chevron": { transition: "none" },
                },
              }}
            >
              <Box
                component="summary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  px: { xs: 2.25, sm: 3 },
                  py: 2.25,
                  cursor: "pointer",
                  listStyle: "none",
                  borderRadius: "14px",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "text.primary",
                  "&::-webkit-details-marker": { display: "none" },
                  "&:hover": { color: "primary.main" },
                }}
              >
                <Typography
                  component="h3"
                  sx={{
                    fontSize: "inherit",
                    fontWeight: "inherit",
                    letterSpacing: "inherit",
                    color: "inherit",
                  }}
                >
                  {t(`items.${key}.q`)}
                </Typography>
                <ExpandMoreIcon
                  className="faq-chevron"
                  aria-hidden
                  sx={{
                    flexShrink: 0,
                    color: "text.secondary",
                    transition: "transform 0.2s ease",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  px: { xs: 2.25, sm: 3 },
                  pb: 2.5,
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "text.secondary",
                }}
              >
                {t(`items.${key}.a`)}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Final call to action                                                        */
/* -------------------------------------------------------------------------- */

export function FinalCta() {
  const t = useTranslations("Landing");

  return (
    <Box
      component="section"
      aria-labelledby="cta-title"
      sx={{ pb: { xs: 9, md: 13 } }}
    >
      <Box sx={containerSx}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
            borderRadius: { xs: "20px", md: "28px" },
            px: { xs: 3, sm: 6 },
            py: { xs: 7, md: 9 },
            color: "#FFFFFF",
            background:
              "linear-gradient(135deg, #4338CA 0%, #4F46E5 45%, #7C3AED 100%)",
            boxShadow: "0 30px 70px -24px rgba(79,70,229,0.55)",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              maskImage:
                "radial-gradient(80% 90% at 50% 0%, #000 0%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(80% 90% at 50% 0%, #000 0%, transparent 100%)",
              pointerEvents: "none",
            },
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Typography
              component="h2"
              id="cta-title"
              sx={{
                fontSize: { xs: 28, sm: 36, md: 42 },
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.12,
                maxWidth: 640,
                mx: "auto",
                textWrap: "balance",
              }}
            >
              {t("cta.title")}
            </Typography>
            <Typography
              sx={{
                mt: 2,
                mb: 4.5,
                fontSize: { xs: 16, md: 18 },
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.86)",
                maxWidth: 520,
                mx: "auto",
              }}
            >
              {t("cta.body")}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <LandingAuthCta
                size="large"
                tone="onDark"
                primary={t("cta.primary")}
                openApp={t("nav.openApp")}
                secondary={{
                  label: t("cta.secondary"),
                  href: "/auth/sign-in",
                  hideWhenAuthed: true,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
