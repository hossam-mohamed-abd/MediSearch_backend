export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export interface MedicineCard {
  name: string;
  activeSubstance: string | null;
  dosageForm: string | null;
  strength: string | null;
  pros: string[];
  cons: string[];
}

export interface AlternativeCard extends MedicineCard {
  reason: string | null;
}

export interface PharmacyLocation {
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  placeId: string | null;
  mapsUrl: string;
  staticMapUrl: string;
}

export type PharmaciesUnavailableReason =
  | "no_city"
  | "not_found"
  | "error"
  | null;

export interface AiChatResult {
  messages: string[];
  medicineCard: MedicineCard | null;
  alternativeCard: AlternativeCard | null;
  searchQuery: string | null;
  nearbyPharmacies: PharmacyLocation[] | null;
  pharmaciesUnavailableReason: PharmaciesUnavailableReason;
}

export interface PromptContext {
  history: ChatMessage[];
  userMessage: string;
}

/** Raw shape the model is asked to return, before we enrich it with real pharmacy data */
export interface RawAiJson {
  messages: string[];
  medicineCard: MedicineCard | null;
  alternativeCard: AlternativeCard | null;
  searchQuery: string | null;
  wantsNearbyPharmacies: boolean;
}
