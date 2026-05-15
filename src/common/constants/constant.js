import dotenv from "dotenv";
dotenv.config();

module.exports = {
  baseUrl(path = null) {
    let url = `${process.env.BASE_URL}:${process.env.PORT}`;
    if (process.env.IS_SECURE === "true" && process.env.HOST) {
      url = `https://${process.env.HOST}`;
    }

    return url + (path ? `/${path}` : "");
  },

  apiBaseUrl(path = null) {
    let url = `${process.env.BASE_URL}:${process.env.PORT}/api/v1`;
    if (process.env.IS_SECURE === "true" && process.env.HOST) {
      url = `https://${process.env.HOST}/api/v1`;
    }

    return url + (path ? `/${path}` : "");
  },

  JWT: {
    SECRET: process.env.JWT_SECRET || "oauth-service-secret",
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
    REFRESH_EXPIRES_IN_DAYS: Number(process.env.REFRESH_EXPIRES_IN_DAYS || 30),
  },

  EMAIL_UPDATE: {
    OTP_EXPIRES_IN_MINUTES: Number(
      process.env.EMAIL_UPDATE_OTP_EXPIRES_IN_MINUTES || 10
    ),
  },

  OTPTYPE: {
    REGISTRATION_OTP: "registration",
    LOGIN_OTP: "login",
  },

  OTP_TYPE_CODE: {
    REGISTRATION: 1,
    LOGIN: 2,
  },

  OTP_TYPE_CODE_TO_VALUE: {
    1: "registration",
    2: "login",
  },

  AUTH_PROVIDER: {
    LOCAL: "local",
    GOOGLE: "google",
    FACEBOOK: "facebook",
  },

  AI_SCRIPT_GENERATION: {
    MAX_GOAL_NAME_LENGTH: 100,
    MAX_DREAM_LENGTH: 1000,
    MAX_WHISPERS: 10,
    MAX_WHISPER_LENGTH: 50,
    MAX_SCRIPT_WORDS: 120,
    MAX_SCRIPT_CHARACTERS: 800,
    MAX_PROMPT_CHARACTERS: 4000,
    TONE_ROTATION: [
      "emotional",
      "energetic",
      "spiritual",
      "disciplined",
      "inspirational",
    ],
    BLOCKED_INPUT_PATTERNS: [
      "ignore previous instructions",
      "act as system",
      "you are chatgpt",
      "developer mode",
      "jailbreak",
    ],
    BLOCKED_OUTPUT_PATTERNS: ["```", "# ", "**", "__", "<script"],
  },

  AI_AUDIO_GENERATION: {
    TEMP_DIRECTORY: "storage/temp/audio",
    EXPECTED_MIME_TYPE: "audio/mpeg",
    EXPECTED_FORMAT: "mp3",
    MIN_AUDIO_BYTES: 512,
    MAX_TEXT_LENGTH_FOR_TTS: 2000,
    SINGLE_VOICE_ID:
      process.env.ELEVENLABS_DEFAULT_VOICE_ID || "EXAVITQu4vr4xnSDxMaL",
    DEFAULT_MODEL_ID: process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2",
    REMOVE_SYMBOLS_REGEX: /[<>{}\[\]]/g,
    REMOVE_MARKDOWN_REGEX: /(\*\*|__|#|`)/g,
    REPEATED_PUNCTUATION_REGEX: /([!?.,])\1{1,}/g,
  },
};
