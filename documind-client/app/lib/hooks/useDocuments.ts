"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  deleteDocument,
  getDocumentDownloadUrl,
  listDocuments,
  uploadDocument,
} from "@/app/lib/api/documents";
import { translateServerMessage } from "@/app/lib/api/errorMessages";
import type { DocumentApi } from "@/app/lib/type/documents";
import type { DocumentItem } from "@/app/lib/type/ui";

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toDocumentItem(doc: DocumentApi, locale: string): DocumentItem {
  const sizeMb = (doc.fileSizeBytes / 1024 / 1024).toFixed(1);
  return {
    id: doc.id,
    name: doc.fileName,
    ext: doc.contentType.includes("pdf") ? "PDF" : "DOC",
    meta: `${formatDate(doc.uploadedAt, locale)} · ${sizeMb} MB`,
    status: doc.status,
  };
}

export function useDocuments() {
  const locale = useLocale();
  const tErrors = useTranslations("Errors");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listDocuments();
      setDocuments(data.map((doc) => toDocumentItem(doc, locale)));
    } catch (err) {
      setError(
        err instanceof Error
          ? translateServerMessage(err.message, tErrors)
          : tErrors("loadDocumentsFailed")
      );
    } finally {
      setLoading(false);
    }
  }, [locale, tErrors]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listDocuments();
        if (!cancelled) setDocuments(data.map((doc) => toDocumentItem(doc, locale)));
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? translateServerMessage(err.message, tErrors)
              : tErrors("loadDocumentsFailed")
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locale, tErrors]);

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
        setError(
          err instanceof Error
            ? translateServerMessage(err.message, tErrors)
            : tErrors("uploadDocumentFailed")
        );
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [refresh, tErrors]
  );

  const getDownloadUrl = useCallback((documentId: string) => {
    return getDocumentDownloadUrl(documentId);
  }, []);

  const remove = useCallback(
    async (documentId: string) => {
      setError(null);
      try {
        await deleteDocument(documentId);
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      } catch (err) {
        setError(
          err instanceof Error
            ? translateServerMessage(err.message, tErrors)
            : tErrors("deleteDocumentFailed")
        );
        throw err;
      }
    },
    [tErrors]
  );

  return { documents, loading, error, uploading, upload, refresh, getDownloadUrl, remove };
}
