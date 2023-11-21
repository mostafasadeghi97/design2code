import OpenAI from "openai";

export function openaiClient(apiKey: string): OpenAI {
  return new OpenAI({
    apiKey: apiKey,
  });
}
