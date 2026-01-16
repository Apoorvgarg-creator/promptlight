export type AIProvider = "openai" | "anthropic" | "ollama";

export type Theme = "light" | "dark" | "system";

export type PromptCategory = "coding" | "writing" | "analysis" | "custom";

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  template: string;
  category: PromptCategory;
  isFavorite?: boolean;
}

export interface Settings {
  provider: AIProvider;
  apiKey: string;
  ollamaEndpoint: string;
  model: string;
  hotkey: string;
  theme: Theme;
}
