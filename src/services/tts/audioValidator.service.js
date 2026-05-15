import fs from "fs";
import path from "path";
import constants from "../../common/constants/constant";

class AudioValidatorService {
  static validateTempAudioFile({ filePath }) {
    const config = constants.AI_AUDIO_GENERATION;

    if (!filePath) {
      throw new Error("Audio file path is required.");
    }

    if (!fs.existsSync(filePath)) {
      throw new Error("Audio file does not exist.");
    }

    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      throw new Error("Audio path is not a file.");
    }

    if (stats.size <= 0) {
      throw new Error("Audio file is empty.");
    }

    if (stats.size < config.MIN_AUDIO_BYTES) {
      throw new Error("Audio file is too small and may be corrupted.");
    }

    const extension = path.extname(filePath).replace(".", "").toLowerCase();
    if (extension !== config.EXPECTED_FORMAT) {
      throw new Error("Audio file format is invalid.");
    }

    return {
      bytes: stats.size,
      format: extension,
      mimeType: config.EXPECTED_MIME_TYPE,
    };
  }
}

export default AudioValidatorService;
