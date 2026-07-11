import { Request, Response } from "express";

import pharmacyAuthService from "./pharmacy-auth.service";

import { serializeBigInt } from "../../utils/bigintSerializer";

class PharmacyAuthController {
  async login(req: Request, res: Response) {
    try {
      const result = await pharmacyAuthService.login(req.body);

      const isProduction = process.env.NODE_ENV === "production";

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json(
        serializeBigInt({
          success: true,
          user: result.user,
        }),
      );
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async profile(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const profile = await pharmacyAuthService.profile(
        BigInt(req.userId),
      );

      return res.json(
        serializeBigInt({
          success: true,
          data: profile,
        }),
      );
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logout(req: Request, res: Response) {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.json({
      success: true,
      message: "Logged out successfully.",
    });
  }
}

export default new PharmacyAuthController();