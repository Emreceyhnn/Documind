"use server";

import { QueryResultApi } from "../type/chat";
import { refreshSession } from "./auth";
import { createAuthorizedClient, parseErrorResponse } from "./http";

const authorizedRagFetch = createAuthorizedClient("RAG_API_URL", refreshSession);

export async function sendChatQuery(
  query: string,
  topK: number = 5
): Promise<QueryResultApi> {
  let response: Response;
  try {
    response = await authorizedRagFetch("/api/v1/rag/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, topK }),
    });
  } catch {
    throw new Error("Network connection failed.");
  }

  if (!response.ok) {
    await parseErrorResponse(response, "Could not get an answer.");
  }

  return (await response.json()) as QueryResultApi;
}
