export type AppRole = "staff" | "admin";

export type CustomJWTPayload = {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  email?: string;
  role?: string;
  user_role?: AppRole;
};