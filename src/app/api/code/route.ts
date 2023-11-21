import { openaiClient } from "@/lib/openai";

import { NextRequest } from "next/server";

import { OpenAIStream, StreamingTextResponse } from "ai";
import { ParamsValidator } from "@/lib/validators/params-validator";
import { buildMessages } from "@/lib/prompt";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    console.log(body);

    console.log("before parse");

    const { openAiApiKey, editorTheme, generationType, image, messageHistory } =
      ParamsValidator.parse(body);

    console.log("after parse");

    var messages = buildMessages(image);

    if (generationType === "update" && messageHistory) {
      console.log("update");
      // loop through messageHistory and if % 2 === 0, then it's an ai message otherwise it's a user message { role: "user", content: { type: "text", text: "hello" } }

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

    const openai = openaiClient(openAiApiKey);

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      temperature: 0,
      stream: true,
      max_tokens: 4096,
      messages: messages,
    });

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        console.log(completion);
      },
    });

    return new StreamingTextResponse(stream);
  } catch (e) {
    console.log("error error error");
    // console.log(e);
    return new Response("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};
