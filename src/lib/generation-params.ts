export interface GenerationParams {
  openAiApiKey: string | null;
  editorTheme: string | null;
  generationType: "create" | "update";
  image: string | null;
  messageHistory?: string[] | undefined;
}
