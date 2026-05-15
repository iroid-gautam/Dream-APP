import constants from "../../common/constants/constant";

class TTSSanitizerService {
  static sanitize(text = "") {
    const config = constants.AI_AUDIO_GENERATION;

    let sanitized = `${text || ""}`;
    sanitized = sanitized.replace(config.REMOVE_MARKDOWN_REGEX, " ");
    sanitized = sanitized.replace(config.REMOVE_SYMBOLS_REGEX, " ");
    sanitized = sanitized.replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}]/gu,
      " "
    );
    sanitized = sanitized.replace(config.REPEATED_PUNCTUATION_REGEX, "$1");
    sanitized = sanitized.replace(/\s+/g, " ").trim();

    if (sanitized.length > config.MAX_TEXT_LENGTH_FOR_TTS) {
      sanitized = sanitized.slice(0, config.MAX_TEXT_LENGTH_FOR_TTS).trim();
    }

    return sanitized;
  }
}

export default TTSSanitizerService;
