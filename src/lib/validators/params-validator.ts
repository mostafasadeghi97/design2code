import { z } from "zod";

export const ParamsValidator = z.object({
  openAiApiKey: z.string(),
  editorTheme: z.string().nullable(),
  generationType: z.string().nullable(),
  image: z.string(),
  messageHistory: z.array(z.string()).nullable(),
});
