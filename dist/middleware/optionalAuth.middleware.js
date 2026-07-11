"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthMiddleware = void 0;
const verifyToken_1 = require("../utils/verifyToken");
/**
 * Optional Authentication
 *
 * لو فيه Token صحيح:
 *   - يضيف بيانات المستخدم للـ Request.
 *
 * لو مفيش Token أو Token غير صالح:
 *   - يكمل عادى كـ Guest.
 */
const optionalAuthMiddleware = (req, _res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return next();
        }
        const payload = (0, verifyToken_1.verifyToken)(token);
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
    }
    catch {
        // Invalid token
        // Continue as Guest
    }
    next();
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
