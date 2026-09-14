"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import AuthShell from "@/app/components/AuthShell";
import { useAuth } from "@/app/lib/hooks/useAuth";

export default function SignInPage() {
  const t = useTranslations("SignIn");
  const router = useRouter();
  const { login, status } = useAuth();
  const theme = useTheme();

  const [ssoOpen, setSsoOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isLoading = status === "loading";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = await login(email, password);
    if (result.success) {
      router.push("/docs");
    } else {
      setError(result.message);
    }
  }

  return (
    <>
      <AuthShell
        gradient
        maxWidth={460}
        footer={
          <Typography
            sx={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: 11,
              color: "text.disabled",
            }}
          >
            {t("footer")}
          </Typography>
        }
      >
        <Typography
          sx={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.01em", mb: 0.75 }}
        >
          {t("title")}
        </Typography>
        <Typography
          sx={{ fontSize: 14, lineHeight: 1.5, color: "text.secondary", mb: 3.5 }}
        >
          {t("subtitle")}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.25}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              type="email"
              label={t("emailLabel")}
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <Box>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "baseline", mb: 0.875 }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  {t("passwordLabel")}
                </Typography>
                <Typography
                  component="a"
                  href="#"
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "primary.light",
                    textDecoration: "none",
                    "&:hover": { color: "primary.dark", textDecoration: "underline" },
                  }}
                >
                  {t("forgotPassword")}
                </Typography>
              </Stack>
              <TextField
                type="password"
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              loading={isLoading}
              sx={{ py: 1.75, mt: 0.5 }}
            >
              {t("submit")}
            </Button>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", my: 3 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography
            sx={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "text.disabled",
            }}
          >
            {t("or")}
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Stack>

        {!ssoOpen ? (
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setSsoOpen(true)}
            sx={{
              py: 1.5,
              color: "primary.main",
              borderColor: "borderStrong",
              "&:hover": { bgcolor: "surfaceHover", borderColor: "primary.light" },
            }}
          >
            {t("ssoCta")}
          </Button>
        ) : (
          <Box
            sx={{
              bgcolor: "surfaceSubtle",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "8px",
              p: 2,
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>
              {t("ssoTitle")}
            </Typography>
            <Typography
              sx={{ fontSize: 12, lineHeight: 1.5, color: "text.secondary", mb: 1.5 }}
            >
              {t("ssoSubtitle")}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              <TextField
                placeholder={t("ssoDomainPlaceholder")}
                size="small"
                sx={{ flex: "1 1 150px", bgcolor: "background.paper" }}
              />
              <Button variant="contained" sx={{ flexShrink: 0, px: 2.25 }}>
                {t("ssoContinue")}
              </Button>
            </Stack>
            <Stack
              direction="row"
              spacing={1.25}
              sx={{ alignItems: "center", mt: 1.5 }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-ibm-plex-mono)",
                  fontSize: 11,
                  color: "text.disabled",
                }}
              >
                {t("ssoProviders")}
              </Typography>
              <Box sx={{ flex: 1 }} />
              <Typography
                component="a"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSsoOpen(false);
                }}
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "primary.light",
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": { color: "primary.dark", textDecoration: "underline" },
                }}
              >
                {t("ssoCancel")}
              </Typography>
            </Stack>
          </Box>
        )}

        <Typography
          sx={{ textAlign: "center", fontSize: 14, color: "text.secondary", mt: 3 }}
        >
          {t("noAccount")}{" "}
          <Link
            href="/auth/sign-up"
            style={{ fontWeight: 600, color: theme.palette.primary.light, textDecoration: "none" }}
          >
            {t("signUpLink")}
          </Link>
        </Typography>
      </AuthShell>
    </>
  );
}
