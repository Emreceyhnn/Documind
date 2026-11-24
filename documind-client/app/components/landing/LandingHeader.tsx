import { Box, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "../Logo";
import LanguageSwitcher from "../LanguageSwitcher";
import LandingAuthCta from "./LandingAuthCta";
import { SECTION_IDS, containerSx } from "./constants";

const NAV_LINKS = [
  { id: SECTION_IDS.howItWorks, key: "howItWorks" },
  { id: SECTION_IDS.features, key: "features" },
  { id: SECTION_IDS.faq, key: "faq" },
] as const;

export default function LandingHeader() {
  const t = useTranslations("Landing.nav");

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "rgba(var(--mui-palette-background-defaultChannel) / 0.82)",
        backdropFilter: "saturate(180%) blur(14px)",
      }}
    >
      <Box
        sx={{
          ...containerSx,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
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

        <Box
          component="nav"
          aria-label={t("primary")}
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 4,
          }}
        >
          {NAV_LINKS.map(({ id, key }) => (
            <Box
              key={id}
              component="a"
              href={`#${id}`}
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: "text.secondary",
                textDecoration: "none",
                transition: "color 0.15s ease",
                "&:hover": { color: "text.primary" },
              }}
            >
              {t(key)}
            </Box>
          ))}
        </Box>

        <Stack
          direction="row"
          sx={{ alignItems: "center", gap: { xs: 0.5, sm: 1.5 } }}
        >
          <LanguageSwitcher variant="button" />
          <LandingAuthCta
            primary={t("getStarted")}
            openApp={t("openApp")}
            showArrow={false}
            secondary={{
              label: t("logIn"),
              href: "/auth/sign-in",
              hideWhenAuthed: true,
              hideOnMobile: true,
              first: true,
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
}
