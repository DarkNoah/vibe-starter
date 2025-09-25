export type Provider = {
  id: string;
  name: string;
  icon: string;
  providerType: ProviderType | string;
  apiKey: string;
  baseUrl?: string;
  models: ProviderModel[];
  isActive: boolean;
  metadata: any;
  settings: any;
};

export type ProviderModel = {
  id: string;
  name: string;
  isActive: boolean;
};
export const ProviderTypes = {
  openai: "OpenAI",
  deepseek: "DeepSeek",
  google: "Google",
  anthropic: "Anthropic",
  gateway: "Gateway",
};
export type ProviderType = keyof typeof ProviderTypes;
