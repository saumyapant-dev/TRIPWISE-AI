/**
 * Gemini Service Client Adapter
 *
 * NOTE: Direct client-side Gemini AI generation has been migrated to the secure
 * backend API (/api/trips/generate and /api/chat) to ensure that Google API keys
 * are NEVER bundled or exposed in the frontend client bundle.
 */
import { generateTrip, chatWithAI } from "./api.js";

export const generateItinerary = generateTrip;
export const askConcierge = chatWithAI;

export default {
  generateItinerary,
  askConcierge,
};