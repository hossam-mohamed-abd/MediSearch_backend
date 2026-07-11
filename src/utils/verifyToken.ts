import jwt, { Secret } from "jsonwebtoken";

export interface JwtPayload {
  userId: number;

  role: string;

  pharmacyId?: number;

  staffRole?: string;

  iat: number;

  exp: number;
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET as Secret,
  ) as JwtPayload;
};