import { ElevenLabsClient } from "elevenlabs";
import constants from "../../common/constants/constant";

class ElevenLabsService {
  static getClient() {
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured.");
    }

    return new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });
  }

  static async generateSpeech({ text }) {
    const config = constants.AI_AUDIO_GENERATION;
    const client = this.getClient();

    const audioStream = await client.textToSpeech.convert(config.SINGLE_VOICE_ID, {
      text,
      model_id: config.DEFAULT_MODEL_ID,
      output_format: "mp3_44100_128",
    });

    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const audioBuffer = Buffer.concat(chunks);

    return {
      provider: "elevenlabs",
      voiceId: config.SINGLE_VOICE_ID,
      modelId: config.DEFAULT_MODEL_ID,
      audioBuffer,
    };
  }
}

export default ElevenLabsService;
