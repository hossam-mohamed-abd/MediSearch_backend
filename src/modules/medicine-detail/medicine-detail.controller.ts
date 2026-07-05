import { Request, Response } from "express";
import { MedicineDetailService } from "./medicine-detail.service";

const service = new MedicineDetailService();

export class MedicineDetailController {
  getDetail = async (req: Request, res: Response) => {
    try {
      const rawId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (!rawId || isNaN(Number(rawId))) {
        return res.status(400).json({
          success: false,
          message: "Invalid drug id.",
        });
      }

      const drugId = BigInt(rawId);

      const userId = req.userId ? BigInt(req.userId) : null;

      const result = await service.getDrugDetail(drugId, userId);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Medicine not found.",
        });
      }

      return res.json({
        success: true,
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
