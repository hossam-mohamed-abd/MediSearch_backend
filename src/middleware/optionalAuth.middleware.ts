import {
  Request,
  Response,
  NextFunction,
} from "express";

import { verifyToken } from "../utils/verifyToken";

/**
 * Optional Authentication
 *
 * لو فيه Token صحيح:
 *   - يضيف بيانات المستخدم للـ Request.
 *
 * لو مفيش Token أو Token غير صالح:
 *   - يكمل عادى كـ Guest.
 */
export const optionalAuthMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return next();
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
  } catch {
    // Invalid token
    // Continue as Guest
  }

  next();
};