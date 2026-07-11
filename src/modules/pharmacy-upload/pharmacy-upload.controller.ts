import { Request, Response } from "express";

import { PharmacyUploadService } from "./pharmacy-upload.service";

const service =
  new PharmacyUploadService();

export class PharmacyUploadController {

  upload = async (
    req: Request,
    res: Response,
  ) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "CSV file is required.",
        });
      }

      const result =
        await service.upload(
          BigInt(req.user!.id),
          req.file,
        );

      return res.json({
        success: true,
        message: "Inventory uploaded successfully.",
        ...result,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };

}