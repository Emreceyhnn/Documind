"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteDocument,
  getDocumentDownloadUrl,
  listDocuments,
  uploadDocument,
} from "@/app/lib/api/documents";
import type { DocumentApi } from "@/app/lib/type/documents";
import type { DocumentItem } from "@/app/lib/type/ui";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toDocumentItem(doc: DocumentApi): DocumentItem {
  const sizeMb = (doc.fileSizeBytes / 1024 / 1024).toFixed(1);
  return {
    id: doc.id,
    name: doc.fileName,
    ext: doc.contentType.includes("pdf") ? "PDF" : "DOC",
    meta: `${formatDate(doc.uploadedAt)} · ${sizeMb} MB`,
    status: doc.status,
  };
}

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listDocuments();
      setDocuments(data.map(toDocumentItem));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dokümanlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await listDocuments();
        if (!cancelled) setDocuments(data.map(toDocumentItem));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Dokümanlar yüklenemedi.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("file", file);
        await uploadDocument(formData);
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Doküman yüklenemedi.");
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [refresh]
  );

  const getDownloadUrl = useCallback((documentId: string) => {
    return getDocumentDownloadUrl(documentId);
  }, []);

  const remove = useCallback(async (documentId: string) => {
    setError(null);
    try {
      await deleteDocument(documentId);
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Doküman silinemedi.");
      throw err;
    }
  }, []);

  return { documents, loading, error, uploading, upload, refresh, getDownloadUrl, remove };
}
