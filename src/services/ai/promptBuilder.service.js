import constants from "../../common/constants/constant";

class PromptBuilderService {
  static buildPrompts({
    username,
    dream,
    godWhispers,
    preferredLanguage,
    tone,
  } = {}) {
    const config = constants.AI_SCRIPT_GENERATION;
    const language = preferredLanguage || "en";
    const whisperLine = (Array.isArray(godWhispers) ? godWhispers : []).join(", ");

    const systemPrompt = [
      "You are an emotional motivational coach.",
      "Generate short spoken motivation scripts.",
      "Sound human, emotional, and natural.",
      "Avoid robotic language and avoid cringe motivation.",
      "Keep output concise and suitable for text-to-speech.",
      "Do not use poetry, hashtags, markdown, or bullet points.",
      "Focus on discipline, hope, purpose, and action.",
      `Keep under ${config.MAX_SCRIPT_WORDS} words.`,
    ].join(" ");

    const userPrompt = [
      `User Name: ${username || "User"}`,
      `Dream: ${dream || "Not provided"}`,
      `God Whispers: ${whisperLine || "Not provided"}`,
      `Today's tone: ${tone || "motivational"}`,
      `Preferred language: ${language}`,
      "Generate a fresh new motivational message that should not sound repetitive.",
    ].join("\n");

    const cappedUserPrompt = userPrompt.slice(0, config.MAX_PROMPT_CHARACTERS);

    return {
      systemPrompt,
      userPrompt: cappedUserPrompt,
    };
  }
}

export default PromptBuilderService;
