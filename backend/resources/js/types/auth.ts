export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthSession = {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  user: AuthUser;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthApiError = {
  message?: string;
  errors?: Record<string, string[]>;
};
