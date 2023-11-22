import { openaiClient } from "@/lib/openai";

import { NextRequest } from "next/server";

import { OpenAIStream, StreamingTextResponse } from "ai";
import { ParamsValidator } from "@/lib/validators/params-validator";
import { buildMessages } from "@/lib/prompt";

export const maxDuration = 180;

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { openAiApiKey, editorTheme, generationType, image, messageHistory } =
      ParamsValidator.parse(body);

    var messages = buildMessages(image);

    if (generationType === "update" && messageHistory) {
      messageHistory.forEach((message, index) => {
        if (index % 2 === 0) {
          messages.push({
            role: "assistant",
            content: message,
          });
        } else {
          messages.push({ role: "user", content: message });
        }
      });
    }

    if (openAiApiKey === "sk-...") {
      return new Response("Invalid API key", { status: 401 });
    }

    const openai = openaiClient(openAiApiKey);

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      temperature: 0,
      stream: true,
      max_tokens: 4096,
      messages: messages,
    });

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {},
    });

    return new StreamingTextResponse(stream);
  } catch (e) {
    console.error(e);
    return new Response("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};
