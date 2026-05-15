import constants from "../../common/constants/constant";

class ToneRotationService {
  static resolveTone({ generationDate } = {}) {
    const tones = constants.AI_SCRIPT_GENERATION.TONE_ROTATION || [];
    if (!tones.length) {
      return "motivational";
    }

    const safeDate = generationDate ? new Date(generationDate) : new Date();
    const timestamp = Number.isNaN(safeDate.getTime())
      ? Date.now()
      : safeDate.getTime();

    const dayNumber = Math.floor(timestamp / (24 * 60 * 60 * 1000));
    const toneIndex = Math.abs(dayNumber) % tones.length;
    return tones[toneIndex];
  }
}

export default ToneRotationService;
