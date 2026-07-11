import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: number;

      email?: string;

      role: string;

      pharmacyId?: number;

      staffRole?: string;
    }

    interface Request {
      /**
       * Legacy Support
       * Existing code already uses req.userId
       */
      userId?: number;

      /**
       * User Role
       * customer | pharmacy | admin
       */
      role?: string;

      /**
       * Pharmacy ID
       * Exists only for pharmacy accounts
       */
      pharmacyId?: number;

      /**
       * owner | manager | employee
       */
      staffRole?: string;

      /**
       * Legacy object
       */
      user?: UserPayload;
    }
  }
}

export {};