export type SimilarChunkResultApi = {
  documentId: string;
  chunkIndex: number;
  content: string;
  similarity: number;
};

export type QueryResultApi = {
  answer: string;
  sources: SimilarChunkResultApi[];
};

export type ChatApiError = {
  error?: string;
};
