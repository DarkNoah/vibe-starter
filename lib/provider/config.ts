import { Provider, ProviderModel } from "@/types/provider";

const parseModels = (
  raw: string | undefined,
  fallback: string[]
): ProviderModel[] => {
  const ids = (raw ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const modelIds = ids.length > 0 ? ids : fallback;
  return modelIds.map((id) => ({ id, name: id, isActive: true }));
};

const env = (key: string) => {
  const value = process.env[key];
  return value?.trim() || undefined;
};

export const loadProvidersFromEnv = (): Provider[] => {
  const providers: Provider[] = [];

  const openaiKey = env("OPENAI_API_KEY");
  if (openaiKey) {
    providers.push({
      id: "openai",
      name: "OpenAI",
      icon: "",
      providerType: "openai",
      apiKey: openaiKey,
      baseUrl: env("OPENAI_BASE_URL"),
      models: parseModels(env("OPENAI_MODELS"), ["gpt-4o-mini"]),
      isActive: true,
      metadata: {},
      settings: {},
    });
  }

  const deepseekKey = env("DEEPSEEK_API_KEY");
  if (deepseekKey) {
    providers.push({
      id: "deepseek",
      name: "DeepSeek",
      icon: "",
      providerType: "deepseek",
      apiKey: deepseekKey,
      baseUrl: env("DEEPSEEK_BASE_URL"),
      models: parseModels(env("DEEPSEEK_MODELS"), ["deepseek-chat"]),
      isActive: true,
      metadata: {},
      settings: {},
    });
  }

  const googleKey = env("GOOGLE_API_KEY");
  if (googleKey) {
    providers.push({
      id: "google",
      name: "Google",
      icon: "",
      providerType: "google",
      apiKey: googleKey,
      baseUrl: env("GOOGLE_BASE_URL"),
      models: parseModels(env("GOOGLE_MODELS"), ["gemini-1.5-flash"]),
      isActive: true,
      metadata: {},
      settings: {},
    });
  }

  const anthropicKey = env("ANTHROPIC_API_KEY");
  if (anthropicKey) {
    providers.push({
      id: "anthropic",
      name: "Anthropic",
      icon: "",
      providerType: "anthropic",
      apiKey: anthropicKey,
      baseUrl: env("ANTHROPIC_BASE_URL"),
      models: parseModels(env("ANTHROPIC_MODELS"), ["claude-3-5-sonnet-20240620"]),
      isActive: true,
      metadata: {},
      settings: {},
    });
  }

  return providers;
};
