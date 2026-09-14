export type DocumentStatusApi = "processing" | "ready" | "error";

export type DocumentApi = {
  id: string;
  userId: string;
  fileName: string;
  storageKey: string;
  fileSizeBytes: number;
  contentType: string;
  status: DocumentStatusApi;
  uploadedAt: string;
};

export type UploadDocumentResultApi = {
  documentId: string;
  fileName: string;
  status: DocumentStatusApi;
};

export type DocumentApiError = {
  error?: string;
};

export type DownloadUrlResultApi = {
  url: string;
};
