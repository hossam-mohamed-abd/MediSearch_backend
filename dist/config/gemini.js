"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEMINI_MODEL = exports.gemini = void 0;
const genai_1 = require("@google/genai");
exports.gemini = new genai_1.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
exports.GEMINI_MODEL = "gemini-3.5-flash";
