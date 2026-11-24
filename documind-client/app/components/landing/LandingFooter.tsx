import { Box, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "../Logo";
import { GITHUB_URL, SECTION_IDS, containerSx } from "./constants";

const linkSx = {
  fontSize: 14,
  color: "text.secondary",
  textDecoration: "none",
  "&:hover": { color: "primary.main" },
} as const;

/** Inherit color/decoration from the wrapping span so its hover style applies. */
const plainLinkStyle = { color: "inherit", textDecoration: "none" } as const;

const headingSx = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "text.primary",
  mb: 2,
} as const;

export default function LandingFooter() {
  const tNav = useTranslations("Landing.nav");
  const tFooter = useTranslations("Landing.footer");
  const tLegal = useTranslations("Legal");
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ ...containerSx, pt: { xs: 6, md: 8 }, pb: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              md: "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)",
            },
            gap: { xs: 5, md: 6 },
          }}
        >
          <Box sx={{ gridColumn: { xs: "1 / -1", md: "auto" } }}>
            <Link
              href="/"
              aria-label="DocuMind"
              style={{
                display: "inline-flex",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Logo size="small" />
            </Link>
            <Typography
              sx={{
                mt: 2,
                maxWidth: 340,
                fontSize: 14,
                lineHeight: 1.65,
                color: "text.secondary",
              }}
            >
              {tFooter("tagline")}
            </Typography>
          </Box>

          <Box component="nav" aria-label={tFooter("product")}>
            <Typography component="p" sx={headingSx}>
              {tFooter("product")}
            </Typography>
            <Stack component="ul" sx={{ listStyle: "none", gap: 1.25 }}>
              <li>
                <Box
                  component="a"
                  href={`#${SECTION_IDS.howItWorks}`}
                  sx={linkSx}
                >
                  {tNav("howItWorks")}
                </Box>
              </li>
              <li>
                <Box
                  component="a"
                  href={`#${SECTION_IDS.features}`}
                  sx={linkSx}
                >
                  {tNav("features")}
                </Box>
              </li>
              <li>
                <Box component="a" href={`#${SECTION_IDS.faq}`} sx={linkSx}>
                  {tNav("faq")}
                </Box>
              </li>
              <li>
                <Box
                  component="a"
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={linkSx}
                >
                  {tFooter("github")}
                </Box>
              </li>
            </Stack>
          </Box>

          <Box component="nav" aria-label={tFooter("legal")}>
            <Typography component="p" sx={headingSx}>
              {tFooter("legal")}
            </Typography>
            <Stack component="ul" sx={{ listStyle: "none", gap: 1.25 }}>
              <li>
                <Box component="span" sx={linkSx}>
                  <Link href="/legal/privacy" style={plainLinkStyle}>
                    {tLegal("privacy.title")}
                  </Link>
                </Box>
              </li>
              <li>
                <Box component="span" sx={linkSx}>
                  <Link href="/legal/terms" style={plainLinkStyle}>
                    {tLegal("terms.title")}
                  </Link>
                </Box>
              </li>
            </Stack>
          </Box>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            mt: { xs: 5, md: 7 },
            pt: 3,
            borderTop: "1px solid",
            borderColor: "divider",
            justifyContent: "space-between",
            gap: 1,
            fontSize: 13,
            color: "text.secondary",
          }}
        >
          <span>{tFooter("rights", { year })}</span>
          <span>{tFooter("license")}</span>
        </Stack>
      </Box>
    </Box>
  );
}
