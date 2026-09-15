import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { sendChatQuery } from "@/app/lib/api/chat";
import { translateServerMessage } from "@/app/lib/api/errorMessages";
import type { SimilarChunkResultApi } from "@/app/lib/type/chat";
import type { ChatMessage, ChatSource } from "@/app/lib/type/ui";

let messageIdCounter = 0;

function nextId(prefix: string): string {
  messageIdCounter += 1;
  return `${prefix}-${messageIdCounter}`;
}

function toChatSource(
  chunk: SimilarChunkResultApi,
  tChat: (key: string, values?: Record<string, string | number | Date>) => string
): ChatSource {
  return {
    ext: "PDF",
    name: tChat("sourceChunkName", { index: chunk.chunkIndex + 1 }),
    page: `%${Math.round(chunk.similarity * 100)}`,
    snippet: chunk.content.slice(0, 220),
  };
}

export function useChat() {
  const tChat = useTranslations("Chat");
  const tErrors = useTranslations("Errors");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setError(null);
      setMessages((prev) => [
        ...prev,
        { id: nextId("user"), role: "user", text: trimmed },
      ]);
      setSending(true);

      try {
        const result = await sendChatQuery(trimmed);
        setMessages((prev) => [
          ...prev,
          {
            id: nextId("assistant"),
            role: "assistant",
            text: result.answer,
            sources: result.sources.map((chunk) => toChatSource(chunk, tChat)),
          },
        ]);
      } catch (err) {
        const message =
          err instanceof Error
            ? translateServerMessage(err.message, tErrors)
            : tErrors("chatQueryFailed");
        setError(message);
        setMessages((prev) => [
          ...prev,
          { id: nextId("assistant"), role: "assistant", text: message },
        ]);
      } finally {
        setSending(false);
      }
    },
    [tChat, tErrors]
  );

  return { messages, sending, error, send };
}
