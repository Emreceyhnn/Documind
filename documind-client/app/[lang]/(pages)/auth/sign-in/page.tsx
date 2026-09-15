"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "@/i18n/navigation";
import AuthShell from "@/app/components/AuthShell";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { buildSignInSchema, type SignInFormValues } from "@/app/lib/validation/auth";
import { translateServerMessage } from "@/app/lib/api/errorMessages";

export default function SignInPage() {
  const t = useTranslations("SignIn");
  const tErrors = useTranslations("Errors");
  const router = useRouter();
  const { login, status } = useAuth();
  const theme = useTheme();

  const [ssoOpen, setSsoOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const schema = useMemo(() => buildSignInSchema(tErrors), [tErrors]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const isLoading = status === "loading";

  async function onSubmit(values: SignInFormValues) {
    setFormError(null);
    const result = await login(values.email, values.password);
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

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.25}>
            {formError && <Alert severity="error">{formError}</Alert>}

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
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordPlaceholder")}
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          size="small"
                          aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon fontSize="small" />
                          ) : (
                            <VisibilityIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                {...register("password")}
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
