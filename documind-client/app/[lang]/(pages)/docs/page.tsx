"use client";

import { useRef, useState } from "react";
import { Alert, Box, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Sidebar from "@/app/components/Sidebar";
import Logo from "@/app/components/Logo";
import DocumentRow from "@/app/components/DocumentRow";
import DocumentRowSkeleton from "@/app/components/DocumentRowSkeleton";
import EmptyDocsIllustration from "@/app/components/EmptyDocsIllustration";
import { useDocuments } from "@/app/lib/hooks/useDocuments";

export default function DocsPage() {
  const t = useTranslations("Docs");
  const { documents, loading, error, uploading, upload, getDownloadUrl, remove } =
    useDocuments();
  const inputRef = useRef<HTMLInputElement>(null);
  const [openError, setOpenError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    upload(file).catch(() => {});
  }

  async function handleOpen(id: string) {
    setOpenError(null);
    try {
      const url = await getDownloadUrl(id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setOpenError(err instanceof Error ? err.message : t("openError"));
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t("deleteConfirm"))) return;
    try {
      await remove(id);
    } catch {}
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

        <Box sx={{ flex: 1, px: 4, pt: 3.5, pb: 12, maxWidth: 1000, width: "100%" }}>
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

          <Box
            onClick={() => !uploading && inputRef.current?.click()}
            onDragEnter={(e) => {
              e.preventDefault();
              if (uploading) return;
              dragCounter.current += 1;
              setIsDragging(true);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => {
              e.preventDefault();
              dragCounter.current -= 1;
              if (dragCounter.current <= 0) {
                dragCounter.current = 0;
                setIsDragging(false);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              dragCounter.current = 0;
              setIsDragging(false);
              if (!uploading) handleFiles(e.dataTransfer.files);
            }}
            sx={{
              border: "2px dashed",
              borderColor: isDragging ? "primary.main" : "borderStrong",
              borderRadius: "10px",
              bgcolor: isDragging ? "surfaceHover" : "surfaceSubtle",
              py: 5,
              px: 3,
              textAlign: "center",
              cursor: uploading ? "default" : "pointer",
              opacity: uploading ? 0.6 : 1,
              transform: isDragging ? "scale(1.01)" : "scale(1)",
              transition: "border-color 0.15s ease, background-color 0.15s ease, transform 0.15s ease",
              "&:hover": uploading
                ? {}
                : { borderColor: "primary.light", bgcolor: "surfaceHover" },
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                mx: "auto",
                mb: 2,
                borderRadius: "50%",
                bgcolor: "secondary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: 0,
                  height: 0,
                  borderLeft: "9px solid transparent",
                  borderRight: "9px solid transparent",
                  borderBottom: "13px solid",
                  borderBottomColor: "primary.main",
                  mb: 0.375,
                }}
              />
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 0.75 }}>
              {uploading
                ? t("uploading")
                : isDragging
                  ? t("dropzoneDropHere")
                  : t("dropzoneTitle")}
            </Typography>
            {!uploading && !isDragging && (
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                {t("dropzoneOr")}{" "}
                <Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>
                  {t("dropzoneBrowse")}
                </Box>
              </Typography>
            )}
            <Typography
              sx={{
                fontFamily: "var(--font-ibm-plex-mono)",
                fontSize: 11,
                color: "text.disabled",
                mt: 1.75,
              }}
            >
              {t("dropzoneHint")}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {openError && (
            <Alert severity="error" sx={{ mt: 2 }} onClose={() => setOpenError(null)}>
              {openError}
            </Alert>
          )}

          {loading ? (
            <>
              <Stack
                direction="row"
                sx={{ alignItems: "baseline", justifyContent: "space-between", mt: 4, mb: 1.75 }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  {t("loadingHeading")}
                </Typography>
              </Stack>

              <Stack spacing={1.25}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <DocumentRowSkeleton key={i} />
                ))}
              </Stack>
            </>
          ) : documents.length > 0 ? (
            <>
              <Stack
                direction="row"
                sx={{ alignItems: "baseline", justifyContent: "space-between", mt: 4, mb: 1.75 }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  {t("uploadedHeading")}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "var(--font-ibm-plex-mono)",
                    fontSize: 12,
                    color: "text.disabled",
                  }}
                >
                  {t("fileCount", { count: documents.length })}
                </Typography>
              </Stack>

              <Stack spacing={1.25}>
                {documents.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} onOpen={handleOpen} onDelete={handleDelete} />
                ))}
              </Stack>
            </>
          ) : (
            <Box
                sx={{
                  mt: 4,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "10px",
                  py: 7,
                  px: 4,
                  textAlign: "center",
                  boxShadow: "0 1px 2px rgba(15,18,34,0.06)",
                }}
              >
                <EmptyDocsIllustration />
                <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 1 }}>
                  {t("emptyTitle")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "text.secondary",
                    maxWidth: 380,
                    mx: "auto",
                  }}
                >
                  {t("emptyBody")}
                </Typography>
              </Box>
          )}
        </Box>
      </Stack>
    </Stack>
  );
}
