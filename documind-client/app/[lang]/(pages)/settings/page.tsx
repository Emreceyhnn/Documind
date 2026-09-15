"use client";

import { useState } from "react";
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
import { useRouter } from "@/i18n/navigation";
import Sidebar from "@/app/components/Sidebar";
import Logo from "@/app/components/Logo";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { updateUser, deleteUser } from "@/app/lib/api/auth";
import { addCompanyMember } from "@/app/lib/api/company";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [memberEmail, setMemberEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [companyIdCopied, setCompanyIdCopied] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    setSaving(true);
    try {
      await updateUser({ name, surname });
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(false);

    if (!user?.companyId) {
      setInviteError(t("teamMissingCompanyError"));
      return;
    }

    setInviting(true);
    try {
      await addCompanyMember({ companyId: user.companyId, userEmail: memberEmail.trim() });
      setInviteSuccess(true);
      setMemberEmail("");
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : t("teamInviteError"));
    } finally {
      setInviting(false);
    }
  }

  async function handleCopyCompanyId() {
    if (!user?.companyId) return;
    try {
      await navigator.clipboard.writeText(user.companyId);
      setCompanyIdCopied(true);
      setTimeout(() => setCompanyIdCopied(false), 2000);
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
      setDeleteError(err instanceof Error ? err.message : t("deleteError"));
      setDeleting(false);
    }
  }

  return (
    <Stack direction="row" sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar />

      <Stack sx={{ flex: 1, minWidth: 0 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            px: 4,
            py: 2.25,
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            boxShadow: "0 1px 3px rgba(15,18,34,0.05)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
          </Box>
        </Stack>

        <Box sx={{ flex: 1, px: 4, pt: 3.5, pb: 12, maxWidth: 640, width: "100%" }}>
          <Box
            component="form"
            onSubmit={handleSave}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label={t("surnameLabel")}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
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
                onSubmit={handleInvite}
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

                <Stack direction="row" spacing={1.25}>
                  <TextField
                    type="email"
                    placeholder={t("teamInviteEmailPlaceholder")}
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    required
                    fullWidth
                    size="small"
                  />
                  <Button type="submit" variant="contained" loading={inviting} sx={{ px: 2.5 }}>
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
