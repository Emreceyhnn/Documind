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
  return async function authorizedFetch(
    path: string,
    init: RequestInit = {}
  ): Promise<Response> {
    const baseUrl = requireServerEnv(baseUrlEnvKey);
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

export async function parseErrorResponse(
  response: Response,
  fallbackMessage: string
): Promise<never> {
  const message = await extractErrorMessage(response, fallbackMessage);
  throw new Error(message);
}

export async function extractErrorMessage<
  T extends {
    message?: string;
    title?: string;
    error?: string;
    errors?: Record<string, string[]>;
  },
>(response: Response, fallbackMessage: string): Promise<string> {
  let errorData: T = {} as T;
  try {
    errorData = (await response.json()) as T;
  } catch {}

  const firstFieldError = errorData.errors
    ? Object.values(errorData.errors).flat().find((m) => !!m)
    : undefined;

  return (
    errorData.message ??
    firstFieldError ??
    errorData.title ??
    errorData.error ??
    fallbackMessage
  );
}
