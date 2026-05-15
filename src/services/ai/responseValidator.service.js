import constants from "../../common/constants/constant";

const countWords = (text = "") => {
  if (!text.trim()) {
    return 0;
  }

  return text.trim().split(/\s+/).length;
};

class ResponseValidatorService {
  static validateScript({ text }) {
    const config = constants.AI_SCRIPT_GENERATION;
    const normalized = `${text || ""}`.replace(/\s+/g, " ").trim();

    if (!normalized) {
      throw new Error("AI response is empty.");
    }

    if (normalized.length > config.MAX_SCRIPT_CHARACTERS) {
      throw new Error("AI response exceeds allowed character limit.");
    }

    const wordCount = countWords(normalized);
    if (wordCount > config.MAX_SCRIPT_WORDS) {
      throw new Error("AI response exceeds allowed word limit.");
    }

    const blockedOutputPatterns = config.BLOCKED_OUTPUT_PATTERNS || [];
    const hasBlockedPattern = blockedOutputPatterns.some((pattern) =>
      normalized.toLowerCase().includes(`${pattern}`.toLowerCase())
    );

    if (hasBlockedPattern) {
      throw new Error("AI response contains blocked formatting or patterns.");
    }

    return normalized;
  }
}

export default ResponseValidatorService;
