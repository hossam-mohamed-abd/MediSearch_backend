import { gemini, GEMINI_MODEL } from "../../config/gemini";

export class GeminiService {
  async generateResponse(prompt: string): Promise<string> {
    const response = await gemini.models.generateContent({
      model: GEMINI_MODEL,

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
