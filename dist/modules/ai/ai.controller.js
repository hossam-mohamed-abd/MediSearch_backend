"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const ai_service_1 = require("./ai.service");
const aiService = new ai_service_1.AiService();
class AiController {
    chat = async (req, res) => {
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
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };
}
exports.AiController = AiController;
