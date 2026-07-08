import { GeminiService } from "./gemini.service";
import { PromptBuilder } from "./prompt.builder";
import { UserLocationService } from "./user-location.service";
import { PharmacyLocatorService } from "./pharmacy-locator.service";
import {
  ChatRequest,
  AiChatResult,
  MedicineCard,
  AlternativeCard,
  RawAiJson,
  PharmaciesUnavailableReason,
} from "./ai.types";
import { AiRepository } from "./ai.repository";

export class AiService {
  private geminiService = new GeminiService();
  private promptBuilder = new PromptBuilder();
  private userLocationService = new UserLocationService();
  private pharmacyLocatorService = new PharmacyLocatorService();
  private repository = new AiRepository();

  async chat(
    request: ChatRequest,
    userId: bigint | null,
    ipAddress: string | null,
  ): Promise<AiChatResult> {
    const message = request.message.trim();
    if (message.length >= 2) {
      await this.repository.createSearchLog(message, userId, ipAddress);
    }
    if (!message) {
      throw new Error("Message is required.");
    }

    const history = (request.history ?? []).slice(-20);

    const prompt = this.promptBuilder.build({
      history,
      userMessage: message,
    });

    const raw = await this.geminiService.generateResponse(prompt);
    const parsed = this.parseResponse(raw);

    let nearbyPharmacies: AiChatResult["nearbyPharmacies"] = null;
    let pharmaciesUnavailableReason: PharmaciesUnavailableReason = null;

    if (parsed.wantsNearbyPharmacies) {
      const result = await this.resolveNearbyPharmacies(userId);
      nearbyPharmacies = result.pharmacies;
      pharmaciesUnavailableReason = result.reason;
    }

    return {
      messages: parsed.messages,
      medicineCard: parsed.medicineCard,
      alternativeCard: parsed.alternativeCard,
      searchQuery: parsed.searchQuery,
      nearbyPharmacies,
      pharmaciesUnavailableReason,
    };
  }

  private async resolveNearbyPharmacies(userId: bigint | null): Promise<{
    pharmacies: AiChatResult["nearbyPharmacies"];
    reason: PharmaciesUnavailableReason;
  }> {
    if (!userId) {
      return { pharmacies: null, reason: "no_city" };
    }

    try {
      const area = await this.userLocationService.resolveUserArea(userId);

      if (!area) {
        return { pharmacies: null, reason: "no_city" };
      }

      const areaQuery = this.userLocationService.areaToQueryString(area);
      const pharmacies = await this.pharmacyLocatorService.findNearby(
        areaQuery,
        3,
      );

      if (!pharmacies.length) {
        return { pharmacies: null, reason: "not_found" };
      }

      return { pharmacies, reason: null };
    } catch (error) {
      console.error("Failed to resolve nearby pharmacies:", error);
      return { pharmacies: null, reason: "error" };
    }
  }

  private parseResponse(raw: string): RawAiJson {
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
        wantsNearbyPharmacies: parsed?.wantsNearbyPharmacies === true,
      };
    } catch {
      return {
        messages: [cleaned || "معلش، مقدرتش أجهز رد واضح دلوقتي. جرب تاني."],
        medicineCard: null,
        alternativeCard: null,
        searchQuery: null,
        wantsNearbyPharmacies: false,
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
