"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import AuthShell from "@/app/components/AuthShell";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { checkPendingInvite } from "@/app/lib/api/auth";

type Strength = 0 | 1 | 2 | 3;

function computeStrength(password: string): Strength {
  if (password.length === 0) return 0;
  if (password.length < 8) return 1;
  const hasUpper = /[A-Z]/.test(password);
  const hasNonLetter = /[^A-Za-z]/.test(password);
  return hasUpper && hasNonLetter ? 3 : 2;
}

const STRENGTH_WIDTH: Record<Strength, string> = {
  0: "0%",
  1: "33%",
  2: "66%",
  3: "100%",
};

export default function SignUpPage() {
  const t = useTranslations("SignUp");
  const router = useRouter();
  const { register, status } = useAuth();
  const theme = useTheme();

  const strengthColor: Record<Strength, string> = {
    0: theme.palette.divider,
    1: theme.palette.statusError.main,
    2: theme.palette.statusProcessing.main,
    3: theme.palette.statusReady.main,
  };

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyMode, setCompanyMode] = useState<"create" | "join">("create");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [pendingInvite, setPendingInvite] = useState<{
    companyId: string;
    companyName: string;
  } | null>(null);

  useEffect(() => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setPendingInvite(null);
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(async () => {
      const invite = await checkPendingInvite(trimmedEmail);
      if (!cancelled) {
        setPendingInvite(invite);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [email]);

  const strength = useMemo(() => computeStrength(password), [password]);
  const strengthLabel = {
    0: "",
    1: t("passwordStrengthWeak"),
    2: t("passwordStrengthMedium"),
    3: t("passwordStrengthStrong"),
  }[strength];

  const isLoading = status === "loading";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!termsAccepted) {
      setError("Devam etmek için kullanım koşullarını kabul etmelisiniz.");
      return;
    }

    const [name, ...rest] = fullName.trim().split(/\s+/);
    const surname = rest.join(" ");

    const result = pendingInvite
      ? await register({
          email,
          password,
          name: name ?? "",
          surname,
          companyId: pendingInvite.companyId,
        })
      : companyMode === "create"
        ? await register({
            email,
            password,
            name: name ?? "",
            surname,
            newCompanyName: newCompanyName.trim(),
          })
        : await register({
            email,
            password,
            name: name ?? "",
            surname,
            companyId: companyId.trim(),
          });

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
          <Stack
            direction="row"
            spacing={2.25}
            useFlexGap
            sx={{ justifyContent: "center", flexWrap: "wrap" }}
          >
            {[t("badgeCompliance"), t("badgeRegion"), t("badgeNoCard")].map(
              (label) => (
                <Typography
                  key={label}
                  sx={{
                    fontFamily: "var(--font-ibm-plex-mono)",
                    fontSize: 11,
                    color: "text.disabled",
                  }}
                >
                  {label}
                </Typography>
              )
            )}
          </Stack>
        }
      >
        <Typography
          sx={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.01em", mb: 0.75 }}
        >
          {t("title")}
        </Typography>
        <Typography
          sx={{ fontSize: 14, lineHeight: 1.5, color: "text.secondary", mb: 2.5 }}
        >
          {t("subtitle")}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={1.75}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label={t("fullNameLabel")}
              placeholder={t("fullNamePlaceholder")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

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
              <TextField
                type="password"
                label={t("passwordLabel")}
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", mt: 1.125 }}>
                <Box
                  sx={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    bgcolor: "divider",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: STRENGTH_WIDTH[strength],
                      bgcolor: strengthColor[strength],
                      borderRadius: 2,
                      transition: "width 0.2s ease, background-color 0.2s ease",
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "var(--font-ibm-plex-mono)",
                    fontSize: 11,
                    color: "text.secondary",
                    flexShrink: 0,
                  }}
                >
                  {strengthLabel}
                </Typography>
              </Stack>
            </Box>

            {pendingInvite ? (
              <Alert severity="info">
                {t("pendingInviteNotice", { companyName: pendingInvite.companyName })}
              </Alert>
            ) : (
              <Box>
                <ToggleButtonGroup
                  value={companyMode}
                  exclusive
                  fullWidth
                  onChange={(_, value) => {
                    if (value) setCompanyMode(value);
                  }}
                  sx={{ mb: 1.5 }}
                >
                  <ToggleButton value="create">{t("companyModeCreate")}</ToggleButton>
                  <ToggleButton value="join">{t("companyModeJoin")}</ToggleButton>
                </ToggleButtonGroup>

                {companyMode === "create" ? (
                  <TextField
                    label={t("newCompanyNameLabel")}
                    placeholder={t("newCompanyNamePlaceholder")}
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    required
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                ) : (
                  <TextField
                    label={t("companyIdLabel")}
                    placeholder={t("companyIdPlaceholder")}
                    helperText={t("companyIdHint")}
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    required
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              </Box>
            )}

            <FormControlLabel
              sx={{ alignItems: "flex-start", mt: 0.25, ml: 0 }}
              control={
                <Checkbox
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  sx={{ p: 0, mr: 1.25, mt: 0.25, color: "borderStrong" }}
                />
              }
              label={
                <Typography sx={{ fontSize: 13, lineHeight: 1.55, color: "text.secondary" }}>
                  {t("termsPrefix")}{" "}
                  <Box
                    component="a"
                    href="#"
                    sx={{
                      color: "primary.light",
                      textDecoration: "none",
                      "&:hover": { color: "primary.dark", textDecoration: "underline" },
                    }}
                  >
                    {t("termsLink")}
                  </Box>{" "}
                  {t("termsMiddle")}{" "}
                  <Box
                    component="a"
                    href="#"
                    sx={{
                      color: "primary.light",
                      textDecoration: "none",
                      "&:hover": { color: "primary.dark", textDecoration: "underline" },
                    }}
                  >
                    {t("privacyLink")}
                  </Box>{" "}
                  {t("termsSuffix")}
                </Typography>
              }
            />

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

        <Typography
          sx={{ textAlign: "center", fontSize: 14, color: "text.secondary", mt: 2 }}
        >
          {t("haveAccount")}{" "}
          <Link
            href="/auth/sign-in"
            style={{ fontWeight: 600, color: theme.palette.primary.light, textDecoration: "none" }}
          >
            {t("signInLink")}
          </Link>
        </Typography>
      </AuthShell>
    </>
  );
}
