
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/verifyToken";

/**
 * Like authMiddleware, but never blocks the request. If a valid token is
 * present, req.userId is set so downstream code can personalize the response
 * (e.g. ranking pharmacies by the user's city). If not, the request proceeds
 * as an anonymous/guest request with req.userId left undefined.
 */
export const optionalAuthMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.token;
    if (!token) return next();

    const payload = verifyToken(token);
    req.userId = payload.userId;
  } catch {
    // Invalid/expired token — treat as a guest rather than failing the request.
  }

  next();
};
