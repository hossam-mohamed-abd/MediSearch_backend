import {
  Request,
  Response,
  NextFunction,
} from "express";

import { verifyToken } from "../utils/verifyToken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payload = verifyToken(token);

    req.userId = payload.userId;

    req.role = payload.role;

    req.pharmacyId = payload.pharmacyId;

    req.staffRole = payload.staffRole;

    req.user = {
      id: payload.userId,
      role: payload.role,
      pharmacyId: payload.pharmacyId,
      staffRole: payload.staffRole,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};