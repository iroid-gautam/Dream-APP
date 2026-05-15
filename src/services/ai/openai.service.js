import OpenAI from "openai";

class OpenAIService {
  static getClient() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }

    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  static async generateMotivationScript({ systemPrompt, userPrompt }) {
    const client = this.getClient();
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    const temperature = Number(process.env.OPENAI_TEMPERATURE || 0.8);
    const maxTokens = Number(process.env.OPENAI_MAX_TOKENS || 200);

    const response = await client.chat.completions.create({
      model,
      temperature,
      max_tokens: maxTokens,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const text = response?.choices?.[0]?.message?.content || "";
    return {
      text: `${text}`.trim(),
      model,
      provider: "openai",
    };
  }
}

export default OpenAIService;
