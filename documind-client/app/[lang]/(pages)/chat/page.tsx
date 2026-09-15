"use client";

import { useRef, useState } from "react";
import { Alert, Box, Stack, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Sidebar from "@/app/components/Sidebar";
import Logo from "@/app/components/Logo";
import ChatMessageBubble from "@/app/components/ChatMessageBubble";
import ThinkingIndicator from "@/app/components/ThinkingIndicator";
import StatusChip from "@/app/components/StatusChip";
import UserBadge from "@/app/components/UserBadge";
import { useChat } from "@/app/lib/hooks/useChat";
import { useDocuments } from "@/app/lib/hooks/useDocuments";

export default function ChatPage() {
  const t = useTranslations("Chat");
  const { messages, sending, error, send } = useChat();
  const { documents, uploading, upload } = useDocuments();
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const canSend = draft.trim().length > 0 && !sending;

  const readyCount = documents.filter((d) => d.status === "ready").length;

  function handleSend() {
    const text = draft.trim();
    if (!text || sending) return;
    send(text);
    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    upload(file).catch(() => {});
  }

  return (
    <Stack direction="row" sx={{ height: "100vh", bgcolor: "background.default" }}>
      <Sidebar />

      <Stack sx={{ flex: 1, minWidth: 0 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            px: 3.5,
            py: 2,
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            boxShadow: "0 1px 3px rgba(15,18,34,0.05)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Logo size="small" color="dark" clickable />
            <Box sx={{ height: 22, width: 1, bgcolor: "divider" }} />
            <UserBadge />
          </Box>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            hidden
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            <Box
              component="button"
              onClick={() => !uploading && inputRef.current?.click()}
              sx={{
                fontFamily: "inherit",
                fontSize: 12,
                fontWeight: 600,
                color: "primary.main",
                bgcolor: "transparent",
                border: "1px solid",
                borderColor: "borderStrong",
                borderRadius: "6px",
                px: 1.5,
                py: 0.75,
                cursor: uploading ? "default" : "pointer",
                opacity: uploading ? 0.6 : 1,
                "&:hover": uploading ? {} : { bgcolor: "surfaceHover" },
              }}
            >
              {uploading ? t("uploading") : t("addDocument")}
            </Box>
            {readyCount > 0 ? (
              <StatusChip
                status="ready"
                label={t("sourcesReadyCount", { count: readyCount })}
              />
            ) : (
              <StatusChip status="processing" label={t("sourcesEmpty")} />
            )}
          </Stack>
        </Stack>

        <Box sx={{ flex: 1, overflow: "auto", px: 3.5, pt: 3.5, pb: 2.5 }}>
          <Stack sx={{ maxWidth: 780, mx: "auto", gap: 2.75 }}>
            {error && <Alert severity="error">{error}</Alert>}

            {messages.length === 0 ? (
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: 14,
                  color: "text.secondary",
                  mt: 6,
                }}
              >
                {t("emptyState")}
              </Typography>
            ) : (
              messages.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))
            )}
            {sending && <ThinkingIndicator />}
          </Stack>
        </Box>

        <Box
          sx={{
            px: 3.5,
            pt: 2,
            pb: { xs: 4, sm: 10.5 },
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ maxWidth: 780, mx: "auto" }}>
            <Stack
              direction="row"
              spacing={1.25}
              sx={{
                alignItems: "flex-end",
                bgcolor: "surfaceSubtle",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "8px",
                pl: 1.75,
                pr: 1,
                py: 1,
              }}
            >
              <TextField
                variant="standard"
                placeholder={t("inputPlaceholder")}
                fullWidth
                multiline
                maxRows={6}
                value={draft}
                disabled={sending}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                slotProps={{
                  input: {
                    disableUnderline: true,
                    sx: {
                      alignItems: "center",
                      py: 0,
                      "& textarea": {
                        lineHeight: 1.5,
                        py: "9px",
                        boxSizing: "border-box",
                      },
                    },
                  },
                }}
                sx={{ flex: 1 }}
              />
              <Box
                component="button"
                onClick={handleSend}
                disabled={!canSend}
                sx={{
                  flexShrink: 0,
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: 1,
                  color: "primary.contrastText",
                  bgcolor: "primary.main",
                  border: 0,
                  px: 2.5,
                  height: 40,
                  borderRadius: "8px",
                  cursor: canSend ? "pointer" : "default",
                  opacity: canSend ? 1 : 0.45,
                  boxShadow: "0 2px 6px rgba(79,70,229,0.28)",
                  "&:hover": canSend ? { bgcolor: "primary.dark" } : {},
                }}
              >
                {t("send")}
              </Box>
            </Stack>
            <Typography
              sx={{
                fontFamily: "var(--font-ibm-plex-mono)",
                fontSize: 11,
                color: "text.disabled",
                mt: 1.25,
              }}
            >
              {t("disclaimer")}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
