import { Request, Response } from "express";

import { PharmacyProfileService } from "./pharmacy-profile.service";

const service =
  new PharmacyProfileService();

export class PharmacyProfileController {

  getProfile = async (
    req: Request,
    res: Response,
  ) => {

    try {

      const userId =
        BigInt(req.user!.id);

      const data =
        await service.getProfile(userId);

      return res.json({
        success: true,
        data,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }

  };

  updateProfile = async (
    req: Request,
    res: Response,
  ) => {

    try {

      const userId =
        BigInt(req.user!.id);

      const data =
        await service.updateProfile(
          userId,
          req.body,
        );

      return res.json({
        success: true,
        data,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }

  };

}