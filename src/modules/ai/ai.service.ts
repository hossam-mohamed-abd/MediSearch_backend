import { GeminiService } from "./gemini.service";
import { PromptBuilder } from "./prompt.builder";
import {
  ChatRequest,
  AiChatResult,
  MedicineCard,
  AlternativeCard,
} from "./ai.types";

export class AiService {
  private geminiService = new GeminiService();
  private promptBuilder = new PromptBuilder();

  async chat(request: ChatRequest): Promise<AiChatResult> {
    const message = request.message.trim();

    if (!message) {
      throw new Error("Message is required.");
    }

    const history = (request.history ?? []).slice(-20);

    const prompt = this.promptBuilder.build({
      history,
      userMessage: message,
    });

    const raw = await this.geminiService.generateResponse(prompt);

    return this.parseResponse(raw);
  }

  private parseResponse(raw: string): AiChatResult {
    const cleaned = raw
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    try {
      const parsed = JSON.parse(cleaned);

      const messages: string[] =
        Array.isArray(parsed?.messages) && parsed.messages.length
          ? parsed.messages
              .map((m: unknown) => String(m).trim())
              .filter(Boolean)
          : [];

      return {
        messages: messages.length
          ? messages
          : ["معلش، مقدرتش أجهز رد واضح دلوقتي. جرب تاني."],
        medicineCard: this.parseMedicineCard(parsed?.medicineCard),
        alternativeCard: this.parseAlternativeCard(parsed?.alternativeCard),
        searchQuery:
          typeof parsed?.searchQuery === "string" && parsed.searchQuery.trim()
            ? parsed.searchQuery.trim()
            : null,
      };
    } catch {
      return {
        messages: [cleaned || "معلش، مقدرتش أجهز رد واضح دلوقتي. جرب تاني."],
        medicineCard: null,
        alternativeCard: null,
        searchQuery: null,
      };
    }
  }

  private parseMedicineCard(raw: any): MedicineCard | null {
    if (!raw || typeof raw !== "object" || !raw.name) return null;

    return {
      name: String(raw.name).trim(),
      activeSubstance: this.strOrNull(raw.activeSubstance),
      dosageForm: this.strOrNull(raw.dosageForm),
      strength: this.strOrNull(raw.strength),
      pros: this.strArray(raw.pros),
      cons: this.strArray(raw.cons),
    };
  }

  private parseAlternativeCard(raw: any): AlternativeCard | null {
    const base = this.parseMedicineCard(raw);
    if (!base) return null;

    return {
      ...base,
      reason: this.strOrNull(raw.reason),
    };
  }

  private strOrNull(value: unknown): string | null {
    return typeof value === "string" && value.trim() ? value.trim() : null;
  }

  private strArray(value: unknown): string[] {
    return Array.isArray(value)
      ? value.map((v) => String(v).trim()).filter(Boolean)
      : [];
  }
}
