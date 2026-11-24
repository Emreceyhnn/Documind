import { Box, Stack, Typography } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useTranslations } from "next-intl";
import { primaryTint } from "./constants";

const mono = "var(--font-ibm-plex-mono), ui-monospace, monospace";

const darkScheme = "[data-mui-color-scheme='dark'] &";

/** Skeleton line standing in for surrounding document text. */
function Line({ width }: { width: string }) {
  return (
    <Box
      aria-hidden
      sx={{
        height: 8,
        width,
        borderRadius: 4,
        bgcolor: "divider",
        opacity: 0.8,
      }}
    />
  );
}

/**
 * Static illustration of the product's core promise: an answer that points
 * back to the exact passage it came from. All text is real, translated
 * content so it is readable by crawlers and assistive tech.
 */
export default function ProductPreview() {
  const t = useTranslations("Landing.preview");

  return (
    <Box component="figure" sx={{ m: 0, position: "relative" }}>
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: { xs: "-4% -2%", md: "-10% -8%" },
          background: `radial-gradient(closest-side, ${primaryTint(0.28)}, transparent 72%)`,
          filter: "blur(28px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow:
            "0 1px 2px rgba(15,18,34,0.05), 0 24px 60px -12px rgba(55,48,163,0.28)",
          [darkScheme]: {
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.4), 0 24px 60px -12px rgba(0,0,0,0.65)",
          },
        }}
      >
        {/* Window chrome */}
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            gap: 0.75,
            px: 2,
            py: 1.5,
            bgcolor: "surfaceSubtle",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
          aria-hidden
        >
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                bgcolor: "borderStrong",
              }}
            />
          ))}
        </Stack>

        {/* Document pane */}
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            pt: { xs: 2.25, sm: 3 },
            pb: { xs: 2.5, sm: 3.25 },
          }}
        >
          <Stack
            direction="row"
            sx={{ alignItems: "center", gap: 1, mb: 2, flexWrap: "wrap" }}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: mono,
                fontSize: 10,
                fontWeight: 500,
                color: "primary.main",
                bgcolor: "secondary.main",
                borderRadius: "4px",
                px: 0.75,
                py: 0.25,
              }}
            >
              PDF
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: 13,
                fontWeight: 600,
                minWidth: 0,
                overflowWrap: "anywhere",
              }}
            >
              {t("docName")}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontFamily: mono,
                fontSize: 11,
                color: "text.secondary",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 999,
                px: 1,
                py: 0.125,
              }}
            >
              {t("docPage")}
            </Typography>
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                gap: 0.75,
                ml: "auto",
                color: "statusReady.main",
              }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: "statusReady.main",
                }}
              />
              <Typography
                component="span"
                sx={{ fontSize: 12, fontWeight: 600 }}
              >
                {t("status")}
              </Typography>
            </Stack>
          </Stack>

          <Typography
            component="p"
            sx={{
              fontSize: 14,
              fontWeight: 600,
              mb: 1.5,
              color: "text.primary",
            }}
          >
            {t("docHeading")}
          </Typography>

          <Stack sx={{ gap: 1, mb: 1.75 }}>
            <Line width="92%" />
            <Line width="64%" />
          </Stack>

          <Typography
            component="p"
            sx={{ fontSize: 14, lineHeight: 1.75, color: "text.secondary" }}
          >
            {t("docBefore")}
            <Box
              component="mark"
              sx={{
                color: "text.primary",
                fontWeight: 600,
                bgcolor: primaryTint(0.16),
                borderRadius: "4px",
                px: 0.5,
                py: 0.125,
                boxShadow: `inset 0 -2px 0 ${primaryTint(0.65)}`,
              }}
            >
              {t("docHighlight")}
            </Box>
            {t("docAfter")}
          </Typography>

          <Box sx={{ mt: 1.75 }}>
            <Line width="78%" />
          </Box>
        </Box>

        {/* Connector between source and answer */}
        <Box
          aria-hidden
          sx={{
            position: "relative",
            height: 0,
            borderTop: "1px dashed",
            borderColor: "borderStrong",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: 0,
              transform: "translate(-50%, -50%)",
              width: 28,
              height: 28,
              borderRadius: "50%",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "borderStrong",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
            }}
          >
            <ArrowDownwardIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>

        {/* Chat pane */}
        <Stack
          sx={{
            gap: 1.75,
            px: { xs: 2, sm: 3 },
            pt: { xs: 3.25, sm: 3.75 },
            pb: { xs: 2.5, sm: 3.25 },
            bgcolor: "surfaceSubtle",
          }}
        >
          <Box
            sx={{
              alignSelf: "flex-end",
              maxWidth: "88%",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              borderRadius: "14px 14px 4px 14px",
              px: 2,
              py: 1.25,
              fontSize: 14,
              lineHeight: 1.55,
            }}
          >
            {t("question")}
          </Box>

          <Box
            sx={{
              alignSelf: "flex-start",
              maxWidth: "94%",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "14px 14px 14px 4px",
              px: 2,
              py: 1.5,
            }}
          >
            <Typography
              sx={{ fontSize: 14, lineHeight: 1.65, color: "text.primary" }}
            >
              {t("answer")}
            </Typography>

            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                gap: 1,
                mt: 1.5,
                pt: 1.25,
                borderTop: "1px solid",
                borderColor: "divider",
                flexWrap: "wrap",
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                }}
              >
                {t("sourceLabel")}
              </Typography>
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  gap: 0.75,
                  bgcolor: primaryTint(0.1),
                  border: "1px solid",
                  borderColor: primaryTint(0.35),
                  borderRadius: 999,
                  pl: 0.875,
                  pr: 0.5,
                  py: 0.375,
                  minWidth: 0,
                }}
              >
                <DescriptionOutlinedIcon
                  sx={{ fontSize: 14, color: "primary.main" }}
                />
                <Typography
                  component="span"
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "text.primary",
                    overflowWrap: "anywhere",
                  }}
                >
                  {t("docName")}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: mono,
                    fontSize: 11,
                    fontWeight: 500,
                    color: "primary.contrastText",
                    bgcolor: "primary.main",
                    borderRadius: 999,
                    px: 0.875,
                    py: 0.125,
                  }}
                >
                  {t("sourcePage")}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Box
        component="figcaption"
        sx={{
          mt: 2.25,
          textAlign: "center",
          fontSize: 13,
          color: "text.secondary",
        }}
      >
        {t("caption")}
      </Box>
    </Box>
  );
}
