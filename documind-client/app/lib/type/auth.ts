export type LoginInputApi = {
  email: string;
  password: string;
};

export type RegisterInputApi = {
  email: string;
  password: string;
  name: string;
  surname: string;
} & (
  | { companyId: string; newCompanyName?: undefined }
  | { companyId?: undefined; newCompanyName: string }
);

export type LogoutInputApi = {
  refreshToken: string;
};

export type UpdateUserInputApi = {
  name: string;
  surname: string;
};

export type AuthResponseApi = {
  token: string;
  refreshToken: string;
  tokenExpiration: string;
  userId: string;
  email: string;
  name: string;
  surname: string;
};

export type MeResponseApi = {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  companyId: string;
  companyName: string;
  isActive: boolean;
};

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  response: T;
};

export type ApiErrorResponseApi = {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
};

export type User = {
  id: string;
  email: string;
  name: string;
  surname: string;
  companyId?: string;
  companyName?: string;
};

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export type AuthState = {
  user: User | null;
  status: AuthStatus;
};

export type AuthActionResult =
  | { success: true; user: User }
  | { success: false; message: string };

export type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<AuthActionResult>;
  register: (input: RegisterInputApi) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
};
