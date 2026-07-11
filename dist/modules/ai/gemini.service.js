"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const gemini_1 = require("../../config/gemini");
class GeminiService {
    async generateResponse(prompt) {
        const response = await gemini_1.gemini.models.generateContent({
            model: gemini_1.GEMINI_MODEL,
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: prompt,
                        },
                    ],
                },
            ],
        });
        return response.text ?? "Sorry, I couldn't generate a response.";
    }
}
exports.GeminiService = GeminiService;
