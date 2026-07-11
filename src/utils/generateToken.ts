import jwt, { Secret, SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  userId: bigint;

  role?: string;

  pharmacyId?: bigint;

  staffRole?: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const jwtPayload = {
    userId: Number(payload.userId),

    role: payload.role ?? "customer",

    pharmacyId: payload.pharmacyId
      ? Number(payload.pharmacyId)
      : undefined,

    staffRole: payload.staffRole ?? undefined,
  };

  const secret: Secret = process.env.JWT_SECRET as string;

  const options: SignOptions = {
    expiresIn:
      (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "7d",
  };

  return jwt.sign(jwtPayload, secret, options);
};