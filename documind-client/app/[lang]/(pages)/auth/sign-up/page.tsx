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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "@/i18n/navigation";
import AuthShell from "@/app/components/AuthShell";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { checkPendingInvite } from "@/app/lib/api/auth";
import { buildSignUpSchema, type SignUpFormValues } from "@/app/lib/validation/auth";
import { translateServerMessage } from "@/app/lib/api/errorMessages";

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
  const tErrors = useTranslations("Errors");
  const router = useRouter();
  const { register: registerUser, status } = useAuth();
  const theme = useTheme();

  const strengthColor: Record<Strength, string> = {
    0: theme.palette.divider,
    1: theme.palette.statusError.main,
    2: theme.palette.statusProcessing.main,
    3: theme.palette.statusReady.main,
  };

  const [formError, setFormError] = useState<string | null>(null);
  const [pendingInvite, setPendingInvite] = useState<{
    companyId: string;
    companyName: string;
  } | null>(null);

  const schema = useMemo(() => buildSignUpSchema(tErrors), [tErrors]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      termsAccepted: true,
      companyMode: "create",
      newCompanyName: "",
      companyId: "",
      hasPendingInvite: false,
    },
  });

  const email = watch("email");
  const password = watch("password");
  const companyMode = watch("companyMode");

  useEffect(() => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setPendingInvite(null);
      setValue("hasPendingInvite", false);
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(async () => {
      const invite = await checkPendingInvite(trimmedEmail);
      if (!cancelled) {
        setPendingInvite(invite);
        setValue("hasPendingInvite", !!invite);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [email, setValue]);

  const strength = useMemo(() => computeStrength(password), [password]);
  const strengthLabel = {
    0: "",
    1: t("passwordStrengthWeak"),
    2: t("passwordStrengthMedium"),
    3: t("passwordStrengthStrong"),
  }[strength];

  const isLoading = status === "loading";

  async function onSubmit(values: SignUpFormValues) {
    setFormError(null);

    const [name, ...rest] = values.fullName.trim().split(/\s+/);
    const surname = rest.join(" ");

    const result = pendingInvite
      ? await registerUser({
          email: values.email,
          password: values.password,
          name: name ?? "",
          surname,
          companyId: pendingInvite.companyId,
        })
      : values.companyMode === "create"
        ? await registerUser({
            email: values.email,
            password: values.password,
            name: name ?? "",
            surname,
            newCompanyName: (values.newCompanyName ?? "").trim(),
          })
        : await registerUser({
            email: values.email,
            password: values.password,
            name: name ?? "",
            surname,
            companyId: (values.companyId ?? "").trim(),
          });

    if (result.success) {
      router.push("/docs");
    } else {
      setFormError(translateServerMessage(result.message, tErrors));
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

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={1.75}>
            {formError && <Alert severity="error">{formError}</Alert>}

            <TextField
              label={t("fullNameLabel")}
              placeholder={t("fullNamePlaceholder")}
              fullWidth
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("fullName")}
            />

            <TextField
              type="email"
              label={t("emailLabel")}
              placeholder={t("emailPlaceholder")}
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("email")}
            />

            <Box>
              <TextField
                type="password"
                label={t("passwordLabel")}
                placeholder={t("passwordPlaceholder")}
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{ inputLabel: { shrink: true } }}
                {...register("password")}
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
                    if (value) setValue("companyMode", value);
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
                    fullWidth
                    error={!!errors.newCompanyName}
                    helperText={errors.newCompanyName?.message}
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("newCompanyName")}
                  />
                ) : (
                  <TextField
                    label={t("companyIdLabel")}
                    placeholder={t("companyIdPlaceholder")}
                    fullWidth
                    error={!!errors.companyId}
                    helperText={errors.companyId?.message ?? t("companyIdHint")}
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("companyId")}
                  />
                )}
              </Box>
            )}

            <FormControlLabel
              sx={{ alignItems: "flex-start", mt: 0.25, ml: 0 }}
              control={
                <Checkbox
                  {...register("termsAccepted")}
                  defaultChecked
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
            {errors.termsAccepted && (
              <Typography sx={{ fontSize: 12, color: "statusError.main", mt: -1.25 }}>
                {errors.termsAccepted.message}
              </Typography>
            )}

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
