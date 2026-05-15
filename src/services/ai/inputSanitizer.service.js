import constants from "../../common/constants/constant";

const sanitizePlainText = (value = "") => {
  return `${value}`
    .replace(/<[^>]*>/g, " ")
    .replace(/[{}<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const removeBlockedPatterns = (value = "", blockedPatterns = []) => {
  let sanitized = value;

  blockedPatterns.forEach((pattern) => {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "gi");
    sanitized = sanitized.replace(regex, " ");
  });

  return sanitized.replace(/\s+/g, " ").trim();
};

const clampText = (value = "", limit = 0) => {
  if (!limit || value.length <= limit) {
    return value;
  }

  return value.slice(0, limit).trim();
};

class InputSanitizerService {
  static sanitizeGoalInput({ username, dream, godWhispers, preferredLanguage } = {}) {
    const config = constants.AI_SCRIPT_GENERATION;
    const blockedPatterns = config.BLOCKED_INPUT_PATTERNS || [];

    const cleanedUsername = clampText(
      removeBlockedPatterns(sanitizePlainText(username || ""), blockedPatterns),
      config.MAX_GOAL_NAME_LENGTH
    );

    const cleanedDream = clampText(
      removeBlockedPatterns(sanitizePlainText(dream || ""), blockedPatterns),
      config.MAX_DREAM_LENGTH
    );

    const whisperItems = Array.isArray(godWhispers) ? godWhispers : [];
    const cleanedWhispers = whisperItems
      .slice(0, config.MAX_WHISPERS)
      .map((item) => sanitizePlainText(item))
      .map((item) => removeBlockedPatterns(item, blockedPatterns))
      .map((item) => clampText(item, config.MAX_WHISPER_LENGTH))
      .filter(Boolean);

    return {
      username: cleanedUsername,
      dream: cleanedDream,
      godWhispers: cleanedWhispers,
      preferredLanguage: sanitizePlainText(preferredLanguage || "en") || "en",
    };
  }
}

export default InputSanitizerService;
