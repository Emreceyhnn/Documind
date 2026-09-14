"use server";

import { ApiEnvelope } from "../type/auth";
import { AddMemberInputApi, CompanyResponseApi } from "../type/company";
import { refreshSession } from "./auth";
import { createAuthorizedClient, parseErrorResponse } from "./http";

const authorizedFetch = createAuthorizedClient("AUTH_API_URL", refreshSession);

export async function getCompany(
  companyId: string
): Promise<CompanyResponseApi> {
  let response: Response;
  try {
    response = await authorizedFetch(`/api/companies/${companyId}`);
  } catch {
    throw new Error(
      "Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin."
    );
  }

  if (!response.ok) {
    await parseErrorResponse(response, "Şirket bilgileri alınamadı.");
  }

  const envelope = (await response.json()) as ApiEnvelope<CompanyResponseApi>;
  return envelope.response;
}

export async function addCompanyMember({
  companyId,
  userEmail,
}: AddMemberInputApi): Promise<CompanyResponseApi> {
  let response: Response;
  try {
    response = await authorizedFetch("/api/companies/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ CompanyId: companyId, UserEmail: userEmail }),
    });
  } catch {
    throw new Error(
      "Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin."
    );
  }

  if (!response.ok) {
    await parseErrorResponse(response, "Üye eklenemedi.");
  }

  const envelope = (await response.json()) as ApiEnvelope<CompanyResponseApi>;
  return envelope.response;
}

export async function removeCompanyMember(
  companyId: string,
  userId: string
): Promise<void> {
  let response: Response;
  try {
    response = await authorizedFetch("/api/companies/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ CompanyId: companyId, UserId: userId }),
    });
  } catch {
    throw new Error(
      "Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin."
    );
  }

  if (!response.ok) {
    await parseErrorResponse(response, "Üye kaldırılamadı.");
  }
}
