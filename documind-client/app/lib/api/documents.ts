"use server";

import {
  DocumentApi,
  DownloadUrlResultApi,
  UploadDocumentResultApi,
} from "../type/documents";
import { refreshSession } from "./auth";
import { createAuthorizedClient, parseErrorResponse } from "./http";

const authorizedDocumentFetch = createAuthorizedClient("DOCUMENT_API_URL", refreshSession);

export async function listDocuments(): Promise<DocumentApi[]> {
  let response: Response;
  try {
    response = await authorizedDocumentFetch("/api/v1/documents");
  } catch {
    throw new Error(
      "Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin."
    );
  }

  if (!response.ok) {
    await parseErrorResponse(response, "Dokümanlar yüklenemedi.");
  }

  return (await response.json()) as DocumentApi[];
}

export async function uploadDocument(
  formData: FormData
): Promise<UploadDocumentResultApi> {
  let response: Response;
  try {
    response = await authorizedDocumentFetch("/api/v1/documents/upload", {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error(
      "Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin."
    );
  }

  if (!response.ok) {
    await parseErrorResponse(response, "Doküman yüklenemedi.");
  }

  return (await response.json()) as UploadDocumentResultApi;
}

export async function deleteDocument(documentId: string): Promise<void> {
  let response: Response;
  try {
    response = await authorizedDocumentFetch(`/api/v1/documents/${documentId}`, {
      method: "DELETE",
    });
  } catch {
    throw new Error(
      "Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin."
    );
  }

  if (!response.ok) {
    await parseErrorResponse(response, "Doküman silinemedi.");
  }
}

export async function getDocumentDownloadUrl(
  documentId: string
): Promise<string> {
  let response: Response;
  try {
    response = await authorizedDocumentFetch(
      `/api/v1/documents/${documentId}/download-url`
    );
  } catch {
    throw new Error(
      "Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin."
    );
  }

  if (!response.ok) {
    await parseErrorResponse(response, "Doküman açılamadı.");
  }

  const data = (await response.json()) as DownloadUrlResultApi;
  return data.url;
}
