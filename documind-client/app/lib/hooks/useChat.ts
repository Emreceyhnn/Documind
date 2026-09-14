import { useCallback, useState } from "react";
import { sendChatQuery } from "@/app/lib/api/chat";
import type { SimilarChunkResultApi } from "@/app/lib/type/chat";
import type { ChatMessage, ChatSource } from "@/app/lib/type/ui";

let messageIdCounter = 0;

function nextId(prefix: string): string {
  messageIdCounter += 1;
  return `${prefix}-${messageIdCounter}`;
}

function toChatSource(chunk: SimilarChunkResultApi): ChatSource {
  return {
    ext: "PDF",
    name: `Doküman parçası #${chunk.chunkIndex + 1}`,
    page: `%${Math.round(chunk.similarity * 100)}`,
    snippet: chunk.content.slice(0, 220),
  };
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (text: string) => {
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
          sources: result.sources.map(toChatSource),
        },
      ]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Cevap alınamadı.";
      setError(message);
      setMessages((prev) => [
        ...prev,
        { id: nextId("assistant"), role: "assistant", text: message },
      ]);
    } finally {
      setSending(false);
    }
  }, []);

  return { messages, sending, error, send };
}
