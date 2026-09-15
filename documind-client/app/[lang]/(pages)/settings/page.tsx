"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import Sidebar from "@/app/components/Sidebar";
import Logo from "@/app/components/Logo";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { updateUser, deleteUser } from "@/app/lib/api/auth";
import { addCompanyMember } from "@/app/lib/api/company";
import {
  buildProfileSchema,
  buildInviteSchema,
  type ProfileFormValues,
  type InviteFormValues,
} from "@/app/lib/validation/auth";
import { translateServerMessage } from "@/app/lib/api/errorMessages";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const tErrors = useTranslations("Errors");
  const router = useRouter();
  const { user } = useAuth();

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [companyIdCopied, setCompanyIdCopied] = useState(false);

  const profileSchema = useMemo(() => buildProfileSchema(tErrors), [tErrors]);
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", surname: user?.surname ?? "" },
  });

  const inviteSchema = useMemo(() => buildInviteSchema(tErrors), [tErrors]);
  const {
    register: registerInvite,
    handleSubmit: handleInviteSubmit,
    reset: resetInvite,
    formState: { errors: inviteErrors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { memberEmail: "" },
  });

  async function onSaveProfile(values: ProfileFormValues) {
    setSaveError(null);
    setSaveSuccess(false);
    setSaving(true);
    try {
      await updateUser(values);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(
        err instanceof Error ? translateServerMessage(err.message, tErrors) : t("saveError")
      );
    } finally {
      setSaving(false);
    }
  }

  async function onInvite(values: InviteFormValues) {
    setInviteError(null);
    setInviteSuccess(false);

    if (!user?.companyId) {
      setInviteError(t("teamMissingCompanyError"));
      return;
    }

    setInviting(true);
    try {
      await addCompanyMember({ companyId: user.companyId, userEmail: values.memberEmail.trim() });
      setInviteSuccess(true);
      resetInvite();
    } catch (err) {
      setInviteError(
        err instanceof Error ? translateServerMessage(err.message, tErrors) : t("teamInviteError")
      );
    } finally {
      setInviting(false);
    }
  }

  function handleCopyCompanyId() {
    if (!user?.companyId) return;

    const markCopied = () => {
      setCompanyIdCopied(true);
      setTimeout(() => setCompanyIdCopied(false), 2000);
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(user.companyId).then(markCopied, () => {});
      return;
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = user.companyId;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      markCopied();
    } catch {}
  }

  async function handleDelete() {
    if (!window.confirm(t("deleteConfirm"))) return;
    setDeleteError(null);
    setDeleting(true);
    try {
      await deleteUser();
      router.push("/auth/sign-in");
    } catch (err) {
      setDeleteError(
        err instanceof Error ? translateServerMessage(err.message, tErrors) : t("deleteError")
      );
      setDeleting(false);
    }
  }

  return (
    <Stack direction="row" sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar />

      <Stack sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            boxShadow: "0 1px 3px rgba(15,18,34,0.05)",
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
              px: 4,
              py: 2.25,
              maxWidth: 640,
              mx: "auto",
            }}
          >
            <Logo size="small" color="dark" clickable />
            <Box sx={{ height: 22, width: 1, bgcolor: "divider" }} />
            <Box>
              <Typography sx={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>
                {t("title")}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.25 }}>
                {t("subtitle")}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ flex: 1, px: 4, pt: 3.5, pb: 12, maxWidth: 640, width: "100%", mx: "auto" }}>
          <Box
            component="form"
            noValidate
            onSubmit={handleProfileSubmit(onSaveProfile)}
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "10px",
              p: 3.5,
              boxShadow: "0 1px 2px rgba(15,18,34,0.06)",
            }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2 }}>
              {t("profileHeading")}
            </Typography>

            <Stack spacing={2.25}>
              {saveError && <Alert severity="error">{saveError}</Alert>}
              {saveSuccess && <Alert severity="success">{t("saveSuccess")}</Alert>}

              <TextField
                label={t("nameLabel")}
                fullWidth
                error={!!profileErrors.name}
                helperText={profileErrors.name?.message}
                slotProps={{ inputLabel: { shrink: true } }}
                {...registerProfile("name")}
              />
              <TextField
                label={t("surnameLabel")}
                fullWidth
                error={!!profileErrors.surname}
                helperText={profileErrors.surname?.message}
                slotProps={{ inputLabel: { shrink: true } }}
                {...registerProfile("surname")}
              />
              <TextField
                label={t("emailLabel")}
                value={user?.email ?? ""}
                fullWidth
                disabled
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label={t("companyLabel")}
                value={user?.companyName ?? ""}
                fullWidth
                disabled
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <Box>
                <Button type="submit" variant="contained" loading={saving} sx={{ px: 3 }}>
                  {t("save")}
                </Button>
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              mt: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "10px",
              p: 3.5,
              boxShadow: "0 1px 2px rgba(15,18,34,0.06)",
            }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2 }}>
              {t("teamHeading")}
            </Typography>

            <Stack spacing={2.25}>
              <Box>
                <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 0.75 }}>
                  {t("teamCompanyIdLabel")}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <TextField
                    value={user?.companyId ?? ""}
                    fullWidth
                    size="small"
                    disabled
                    slotProps={{ input: { sx: { fontFamily: "var(--font-ibm-plex-mono)", fontSize: 13 } } }}
                  />
                  <Tooltip title={companyIdCopied ? t("teamCopied") : t("teamCopy")}>
                    <IconButton onClick={handleCopyCompanyId} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.75 }}>
                  {t("teamCompanyIdHint")}
                </Typography>
              </Box>

              <Box
                component="form"
                noValidate
                onSubmit={handleInviteSubmit(onInvite)}
                sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.25 }}>
                  {t("teamInviteHeading")}
                </Typography>

                {inviteError && (
                  <Alert severity="error" sx={{ mb: 1.5 }}>
                    {inviteError}
                  </Alert>
                )}
                {inviteSuccess && (
                  <Alert severity="success" sx={{ mb: 1.5 }}>
                    {t("teamInviteSuccess")}
                  </Alert>
                )}

                <Stack direction="row" spacing={1.25} sx={{ alignItems: "flex-start" }}>
                  <TextField
                    type="email"
                    placeholder={t("teamInviteEmailPlaceholder")}
                    error={!!inviteErrors.memberEmail}
                    helperText={inviteErrors.memberEmail?.message}
                    fullWidth
                    size="small"
                    {...registerInvite("memberEmail")}
                  />
                  <Button type="submit" variant="contained" loading={inviting} sx={{ px: 2.5, flexShrink: 0 }}>
                    {t("teamInviteSubmit")}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              mt: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "10px",
              p: 3.5,
              boxShadow: "0 1px 2px rgba(15,18,34,0.06)",
            }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 0.75 }}>
              {t("languageHeading")}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
              {t("languageSubtitle")}
            </Typography>

            <LanguageSwitcher variant="pill" />
          </Box>

          <Box
            sx={{
              mt: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "statusError.main",
              borderRadius: "10px",
              p: 3.5,
              boxShadow: "0 1px 2px rgba(15,18,34,0.06)",
            }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 0.75, color: "statusError.contrastText" }}>
              {t("dangerZoneTitle")}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
              {t("dangerZoneBody")}
            </Typography>

            {deleteError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            )}

            <Button
              variant="outlined"
              color="error"
              loading={deleting}
              onClick={handleDelete}
              sx={{ px: 3 }}
            >
              {t("deleteAccount")}
            </Button>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
