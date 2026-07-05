import { Request, Response } from "express";
import { AiService } from "./ai.service";

const aiService = new AiService();

export class AiController {
  chat = async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body;

      const userId = req.userId ? BigInt(req.userId) : null;

      const result = await aiService.chat({ message, history }, userId);

      return res.json({
        success: true,
        messages: result.messages,
        medicineCard: result.medicineCard,
        alternativeCard: result.alternativeCard,
        searchQuery: result.searchQuery,
        nearbyPharmacies: result.nearbyPharmacies,
        pharmaciesUnavailableReason: result.pharmaciesUnavailableReason,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
}
