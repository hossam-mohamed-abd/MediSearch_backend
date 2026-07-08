"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const gemini_service_1 = require("./gemini.service");
const prompt_builder_1 = require("./prompt.builder");
const user_location_service_1 = require("./user-location.service");
const pharmacy_locator_service_1 = require("./pharmacy-locator.service");
const ai_repository_1 = require("./ai.repository");
class AiService {
    geminiService = new gemini_service_1.GeminiService();
    promptBuilder = new prompt_builder_1.PromptBuilder();
    userLocationService = new user_location_service_1.UserLocationService();
    pharmacyLocatorService = new pharmacy_locator_service_1.PharmacyLocatorService();
    repository = new ai_repository_1.AiRepository();
    async chat(request, userId, ipAddress) {
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
        let nearbyPharmacies = null;
        let pharmaciesUnavailableReason = null;
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
    async resolveNearbyPharmacies(userId) {
        if (!userId) {
            return { pharmacies: null, reason: "no_city" };
        }
        try {
            const area = await this.userLocationService.resolveUserArea(userId);
            if (!area) {
                return { pharmacies: null, reason: "no_city" };
            }
            const areaQuery = this.userLocationService.areaToQueryString(area);
            const pharmacies = await this.pharmacyLocatorService.findNearby(areaQuery, 3);
            if (!pharmacies.length) {
                return { pharmacies: null, reason: "not_found" };
            }
            return { pharmacies, reason: null };
        }
        catch (error) {
            console.error("Failed to resolve nearby pharmacies:", error);
            return { pharmacies: null, reason: "error" };
        }
    }
    parseResponse(raw) {
        const cleaned = raw
            .trim()
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/```$/i, "")
            .trim();
        try {
            const parsed = JSON.parse(cleaned);
            const messages = Array.isArray(parsed?.messages) && parsed.messages.length
                ? parsed.messages
                    .map((m) => String(m).trim())
                    .filter(Boolean)
                : [];
            return {
                messages: messages.length
                    ? messages
                    : ["معلش، مقدرتش أجهز رد واضح دلوقتي. جرب تاني."],
                medicineCard: this.parseMedicineCard(parsed?.medicineCard),
                alternativeCard: this.parseAlternativeCard(parsed?.alternativeCard),
                searchQuery: typeof parsed?.searchQuery === "string" && parsed.searchQuery.trim()
                    ? parsed.searchQuery.trim()
                    : null,
                wantsNearbyPharmacies: parsed?.wantsNearbyPharmacies === true,
            };
        }
        catch {
            return {
                messages: [cleaned || "معلش، مقدرتش أجهز رد واضح دلوقتي. جرب تاني."],
                medicineCard: null,
                alternativeCard: null,
                searchQuery: null,
                wantsNearbyPharmacies: false,
            };
        }
    }
    parseMedicineCard(raw) {
        if (!raw || typeof raw !== "object" || !raw.name)
            return null;
        return {
            name: String(raw.name).trim(),
            activeSubstance: this.strOrNull(raw.activeSubstance),
            dosageForm: this.strOrNull(raw.dosageForm),
            strength: this.strOrNull(raw.strength),
            pros: this.strArray(raw.pros),
            cons: this.strArray(raw.cons),
        };
    }
    parseAlternativeCard(raw) {
        const base = this.parseMedicineCard(raw);
        if (!base)
            return null;
        return {
            ...base,
            reason: this.strOrNull(raw.reason),
        };
    }
    strOrNull(value) {
        return typeof value === "string" && value.trim() ? value.trim() : null;
    }
    strArray(value) {
        return Array.isArray(value)
            ? value.map((v) => String(v).trim()).filter(Boolean)
            : [];
    }
}
exports.AiService = AiService;
