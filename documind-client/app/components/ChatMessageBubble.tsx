import { Box, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import type { ChatMessage } from "../lib/type/ui";
import SourceCard from "./SourceCard";

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export default function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const t = useTranslations("Chat");

  if (message.role === "user") {
    return (
      <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
        <Box
          sx={{
            maxWidth: "76%",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            px: 2.25,
            py: 1.75,
            borderRadius: "12px 12px 4px 12px",
            fontSize: 15,
            lineHeight: 1.6,
            boxShadow: "0 2px 8px rgba(79,70,229,0.22)",
          }}
        >
          {message.text}
        </Box>
        <Box
          sx={{
            width: 32,
            height: 32,
            flexShrink: 0,
            borderRadius: "50%",
            bgcolor: "secondary.main",
            color: "primary.dark",
            fontSize: 12,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          EK
        </Box>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={1.5}>
      <Box
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          borderRadius: "8px",
          bgcolor: "primary.dark",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            border: "2.5px solid",
            borderColor: "primary.contrastText",
            borderRadius: "2px",
          }}
        />
      </Box>
      <Box sx={{ maxWidth: "84%", minWidth: 0 }}>
        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            px: 2.25,
            py: 2,
            borderRadius: "12px 12px 12px 4px",
            fontSize: 15,
            lineHeight: 1.65,
            boxShadow: "0 1px 3px rgba(15,18,34,0.07)",
          }}
        >
          {message.text}
        </Box>

        {message.sources && message.sources.length > 0 && (
          <>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "text.disabled",
                mt: 1.75,
                mb: 1,
                ml: 0.25,
              }}
            >
              {t("sourcesHeading")}
            </Typography>
            <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1.25 }}>
              {message.sources.map((source, i) => (
                <SourceCard key={i} source={source} />
              ))}
            </Stack>
          </>
        )}
      </Box>
    </Stack>
  );
}
