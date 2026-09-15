"use server";

import {
  ApiEnvelope,
  AuthActionResult,
  AuthResponseApi,
  LoginInputApi,
  LogoutInputApi,
  MeResponseApi,
  RegisterInputApi,
  UpdateUserInputApi,
  User,
} from "../type/auth";
import {
  clearSessionCookies,
  getAccessToken,
  getRefreshToken,
  setSessionCookies,
} from "./session";
import {
  createAuthorizedClient,
  extractErrorMessage,
  parseErrorResponse,
  requireServerEnv,
} from "./http";

function getAuthApiUrl(): string {
  return requireServerEnv("AUTH_API_URL");
}

function toUser(data: {
  userId: string;
  email: string;
  name: string;
  surname: string;
  companyId?: string;
  companyName?: string;
}): User {
  return {
    id: data.userId,
    email: data.email,
    name: data.name,
    surname: data.surname,
    companyId: data.companyId,
    companyName: data.companyName,
  };
}

function toUserFromMe(data: MeResponseApi): User {
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    surname: data.surname,
    companyId: data.companyId,
    companyName: data.companyName,
  };
}

export async function login({
  email,
  password,
}: LoginInputApi): Promise<AuthActionResult> {
  const authApiUrl = getAuthApiUrl();

  let response: Response;
  try {
    response = await fetch(`${authApiUrl}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email, Password: password }),
    });
  } catch {
    return {
      success: false,
      message: "Network connection failed.",
    };
  }

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      "Login failed. Please check your email and password."
    );
    return { success: false, message };
  }

  const envelope = (await response.json()) as ApiEnvelope<AuthResponseApi>;
  const data = envelope.response;
  await setSessionCookies(data.token, data.refreshToken);
  return { success: true, user: toUser(data) };
}

export async function register({
  email,
  name,
  surname,
  password,
  companyId,
  newCompanyName,
}: RegisterInputApi): Promise<AuthActionResult> {
  const authApiUrl = getAuthApiUrl();

  let response: Response;
  try {
    response = await fetch(`${authApiUrl}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Email: email,
        Name: name,
        Surname: surname,
        Password: password,
        CompanyId: companyId,
        NewCompanyName: newCompanyName,
      }),
    });
  } catch {
    return {
      success: false,
      message: "Network connection failed.",
    };
  }

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      "Registration failed. Please check your email and password."
    );
    return { success: false, message };
  }

  const envelope = (await response.json()) as ApiEnvelope<AuthResponseApi>;
  const data = envelope.response;
  await setSessionCookies(data.token, data.refreshToken);
  return { success: true, user: toUser(data) };
}

export async function checkPendingInvite(
  email: string
): Promise<{ companyId: string; companyName: string } | null> {
  const authApiUrl = getAuthApiUrl();

  if (!email.trim()) {
    return null;
  }

  let response: Response;
  try {
    response = await fetch(
      `${authApiUrl}/api/companies/invites/check?email=${encodeURIComponent(email)}`
    );
  } catch {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const envelope = (await response.json()) as ApiEnvelope<{
    companyId: string;
    companyName: string;
  } | null>;

  return envelope.response;
}

export async function refreshSession(): Promise<string | null> {
  const authApiUrl = process.env.AUTH_API_URL;
  const refreshToken = await getRefreshToken();
  if (!authApiUrl || !refreshToken) {
    return null;
  }

  let response: Response;
  try {
    response = await fetch(`${authApiUrl}/api/users/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ RefreshToken: refreshToken }),
    });
  } catch {
    return null;
  }

  if (!response.ok) {
    await clearSessionCookies();
    return null;
  }

  const envelope = (await response.json()) as ApiEnvelope<AuthResponseApi>;
  const data = envelope.response;
  await setSessionCookies(data.token, data.refreshToken);
  return data.token;
}

const authorizedFetch = createAuthorizedClient("AUTH_API_URL", refreshSession);

export async function logout() {
  const refreshToken = await getRefreshToken();

  try {
    if (refreshToken) {
      await authorizedFetch("/api/users/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken } satisfies LogoutInputApi),
      });
    }
  } finally {
    await clearSessionCookies();
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return null;
  }

  let response: Response;
  try {
    response = await authorizedFetch("/api/users/me");
  } catch {
    return null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      await clearSessionCookies();
    }
    return null;
  }

  const envelope = (await response.json()) as ApiEnvelope<MeResponseApi>;
  return toUserFromMe(envelope.response);
}

export async function updateUser({ name, surname }: UpdateUserInputApi) {
  let response: Response;
  try {
    response = await authorizedFetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Name: name, Surname: surname }),
    });
  } catch {
    throw new Error("Network connection failed.");
  }

  if (!response.ok) {
    await parseErrorResponse(response, "Could not update user information. Please try again.");
  }

  const envelope = (await response.json()) as ApiEnvelope<MeResponseApi>;
  return toUserFromMe(envelope.response);
}

export async function deleteUser() {
  let response: Response;
  try {
    response = await authorizedFetch("/api/users/me", {
      method: "DELETE",
    });
  } catch {
    throw new Error("Network connection failed.");
  }

  if (!response.ok) {
    await parseErrorResponse(response, "Could not delete user account. Please try again.");
  }

  await clearSessionCookies();
}
