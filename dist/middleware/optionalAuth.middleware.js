"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthMiddleware = void 0;
const verifyToken_1 = require("../utils/verifyToken");
/**
 * Like authMiddleware, but never blocks the request. If a valid token is
 * present, req.userId is set so downstream code can personalize the response
 * (e.g. ranking pharmacies by the user's city). If not, the request proceeds
 * as an anonymous/guest request with req.userId left undefined.
 */
const optionalAuthMiddleware = (req, _res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token)
            return next();
        const payload = (0, verifyToken_1.verifyToken)(token);
        req.userId = payload.userId;
    }
    catch {
        // Invalid/expired token — treat as a guest rather than failing the request.
    }
    next();
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
