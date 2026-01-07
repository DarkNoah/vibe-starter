import { createGateway, gateway } from "ai";
import { Provider, ProviderModel } from "@/types/provider";
import { OpenAI } from "openai";
import { GoogleGenAI } from "@google/genai";

import { createOpenAI } from "@ai-sdk/openai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import { ProviderV2, LanguageModelV2 } from "@ai-sdk/provider";
import { loadProvidersFromEnv } from "./config";

export class ProviderManager {
  public providers: Record<string, any>;

  constructor() {
    this.providers = {};
    this.init();
  }

  async init() {
    const nextProviders = loadProvidersFromEnv();
    const map: Record<string, Provider> = {};
    nextProviders.forEach((provider) => {
      map[provider.id] = provider;
    });
    this.providers = map;
  }

  async getAvailableModels(): Promise<{ id: string; name: string }[]> {
    let providers: Provider[] = [];
    if (Object.keys(this.providers).length > 0) {
      providers = Object.values(this.providers).filter((x) => x.isActive);
    } else {
      await this.init();
      providers = Object.values(this.providers).filter((x) => x.isActive);
    }
    const models: { id: string; name: string }[] = [];
    providers.forEach((x) => {
      x.models
        .filter((y: any) => y.isActive)
        .forEach((y: any) => {
          models.push({ id: `${y.id}@${x.id}`, name: y.name });
        });
    });
    return models;
  }

  async getProviderV2(providerId: string): Promise<ProviderV2 | undefined> {
    const provider = await this.getProvider(providerId);
    switch (provider?.providerType) {
      case "openai":
        const openai = createOpenAI({
          apiKey: provider?.apiKey,
          baseURL: provider?.baseUrl,
        });
        return openai;
      case "deepseek":
        const deepseek = createDeepSeek({
          apiKey: provider?.apiKey,
          baseURL: provider?.baseUrl,
        });
        return deepseek;
      case "google":
        const goole = createGoogleGenerativeAI({
          apiKey: provider?.apiKey,
          baseURL: provider?.baseUrl,
        });
        return goole;
      case "gateway":
        const gateway = createGateway({
          apiKey: provider?.apiKey,
          baseURL: provider?.baseUrl,
        });
        return gateway;
      case "anthropic":
        const anthropic = createAnthropic({
          apiKey: provider?.apiKey,
          baseURL: provider?.baseUrl,
        });
        return anthropic;
      default:
        return undefined;
    }
  }

  async getLanguageModel(
    modelId: string
  ): Promise<LanguageModelV2 | undefined> {
    if (!modelId.includes("@")) return undefined;
    const providerId = modelId.split("@")[1];
    const languageModelId = modelId.split("@")[0];
    const provider = await this.getProviderV2(providerId);
    return provider?.languageModel(languageModelId);
  }

  getModelList = async (
    providerId: string
  ): Promise<ProviderModel[] | null> => {
    const provider = await this.getProvider(providerId);
    if (!provider) return null;

    // Prefer saved models stored under metadata.models (array).
    // Fallback to single selected model stored under provider.models.
    const savedModels: Array<{ id: string; name: string; isActive: boolean }> =
      provider?.models ?? [];

    if (provider?.providerType == "openai") {
      const openai = new OpenAI({
        apiKey: provider.apiKey,
        baseURL: provider.baseUrl || undefined,
      });
      const list = await openai.models.list();
      const items = (list?.data ?? []).map((x: any) => {
        const model = savedModels.find((z) => z.id === x.id || z.name === x.id);
        return {
          id: x.id,
          name: model?.name || x.id,
          isActive: model?.isActive || false,
        } as ProviderModel;
      });
      return items.sort((a: ProviderModel, b: ProviderModel) =>
        a.name.localeCompare(b.name)
      );
    } else if (provider?.providerType == "deepseek") {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${provider.apiKey}`,
        },
      };

      const url = "https://api.deepseek.com/models";
      const res = await fetch(url, options);
      const models = await res.json();
      const items = (models?.data ?? []).map((x: any) => {
        const model = savedModels.find((z) => z.id === x.id || z.name === x.id);
        return {
          id: x.id,
          name: model?.name || x.id,
          isActive: model?.isActive || false,
        } as ProviderModel;
      });
      return items.sort((a: ProviderModel, b: ProviderModel) =>
        a.name.localeCompare(b.name)
      );
    } else if (provider?.providerType == "google") {
      const ai = new GoogleGenAI({ apiKey: provider.apiKey });
      const res = await ai.models.list({
        config: {
          pageSize: 100,
        },
      });
      return res.page
        .filter((x: any) => x.supportedActions.includes("generateContent"))
        .map((x: any) => {
          const id = x.name.split("/")[1];
          const model = savedModels.find((z) => z.id === id);
          return {
            id: id,
            name: model?.name || x.displayName,
            isActive: model?.isActive || false,
          } as ProviderModel;
        })
        .sort((a: ProviderModel, b: ProviderModel) =>
          a.name.localeCompare(b.name)
        );
    } else if (provider?.providerType == "gateway") {
      const availableModels = await gateway.getAvailableModels();
      return availableModels.models
        .filter((x: any) => x.modelType == "language")
        .map((x: any) => {
          const model = savedModels.find((z) => z.id === x.id);
          return {
            id: x.id,
            name: model?.name || x.name,
            isActive: model?.isActive || false,
          } as ProviderModel;
        })
        .sort((a: ProviderModel, b: ProviderModel) =>
          a.name.localeCompare(b.name)
        );
    }
    // Fallback: return any saved models or empty array
    return savedModels as ProviderModel[];
  };

  getProvider = async (
    providerId: string,
    refresh: boolean = false
  ): Promise<any> => {
    if (refresh || !this.providers[providerId]) {
      await this.init();
    }
    return this.providers[providerId] ?? null;
  };
}

// const providerManager = new ProviderManager();

// export default providerManager;

let providerManager: ProviderManager | null = null;

export const getProviderManager = () => {
  if (!providerManager) {
    providerManager = new ProviderManager();
  }
  return providerManager;
};
