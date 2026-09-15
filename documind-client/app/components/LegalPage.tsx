import { Box, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";

interface LegalPageProps {
  namespace: "Legal.terms" | "Legal.privacy";
}

export default function LegalPage({ namespace }: LegalPageProps) {
  const t = useTranslations(namespace);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", px: 3, py: { xs: 4, sm: 6 } }}>
      <Stack sx={{ maxWidth: 640, mx: "auto" }}>
        <Box sx={{ mb: 4 }}>
          <Link href="/auth/sign-up" style={{ textDecoration: "none" }}>
            <Logo size="small" />
          </Link>
        </Box>

        <Typography sx={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em", mb: 1.5 }}>
          {t("title")}
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.disabled", mb: 3.5 }}>
          {t("lastUpdated")}
        </Typography>
        <Typography sx={{ fontSize: 14, lineHeight: 1.7, color: "text.secondary", whiteSpace: "pre-line" }}>
          {t("body")}
        </Typography>
      </Stack>
    </Box>
  );
}
