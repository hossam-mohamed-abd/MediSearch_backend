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

export interface AiChatResult {
  messages: string[];
  medicineCard: MedicineCard | null;
  alternativeCard: AlternativeCard | null;
  searchQuery: string | null;
}

export interface PromptContext {
  history: ChatMessage[];
  userMessage: string;
}