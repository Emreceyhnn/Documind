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
    throw new Error("Network connection failed.");
  }

  if (!response.ok) {
    await parseErrorResponse(response, "Could not load documents.");
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
    throw new Error("Network connection failed.");
  }

  if (!response.ok) {
    await parseErrorResponse(response, "Could not upload document.");
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
    throw new Error("Network connection failed.");
  }

  if (!response.ok) {
    await parseErrorResponse(response, "Could not delete document.");
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
    throw new Error("Network connection failed.");
  }

  if (!response.ok) {
    await parseErrorResponse(response, "Could not open document.");
  }

  const data = (await response.json()) as DownloadUrlResultApi;
  return data.url;
}
