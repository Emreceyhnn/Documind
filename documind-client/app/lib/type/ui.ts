export type DocStatus = "ready" | "processing" | "error";

export interface DocumentItem {
  id: string;
  name: string;
  ext: string;
  meta: string;
  status: DocStatus;
}

export interface ChatDocument {
  id: string;
  name: string;
  ext: string;
  pages: string;
  status: DocStatus;
}

export interface ChatSource {
  ext: string;
  name: string;
  page: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: ChatSource[];
}
