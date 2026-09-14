import { getAccessToken } from "./session";

export function requireServerEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Sunucu yapılandırma hatası: ${key} tanımlı değil.`);
  }
  return value;
}

export function createAuthorizedClient(
  baseUrlEnvKey: string,
  refreshSession: () => Promise<string | null>
) {
  const baseUrl = requireServerEnv(baseUrlEnvKey);

  return async function authorizedFetch(
    path: string,
    init: RequestInit = {}
  ): Promise<Response> {
    const accessToken = await getAccessToken();

    const doFetch = (token: string | null) =>
      fetch(`${baseUrl}${path}`, {
        ...init,
        headers: {
          ...(init.headers ?? {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

    let response = await doFetch(accessToken);

    if (response.status === 401) {
      const newAccessToken = await refreshSession();
      if (newAccessToken) {
        response = await doFetch(newAccessToken);
      }
    }

    return response;
  };
}

export async function parseErrorResponse<
  T extends { message?: string; title?: string; error?: string },
>(response: Response, fallbackMessage: string): Promise<never> {
  const message = await extractErrorMessage(response, fallbackMessage);
  throw new Error(message);
}

export async function extractErrorMessage<
  T extends { message?: string; title?: string; error?: string },
>(response: Response, fallbackMessage: string): Promise<string> {
  let errorData: T = {} as T;
  try {
    errorData = (await response.json()) as T;
  } catch {}

  return errorData.message ?? errorData.title ?? errorData.error ?? fallbackMessage;
}
