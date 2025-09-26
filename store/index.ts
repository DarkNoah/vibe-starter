import { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { create } from "zustand";

// Thread store 保持不变
type ThreadAction = {
  threadId: string;
  message: PromptInputMessage;
  model: string;
};

type ThreadState = {
  createThread: {
    threadId: string;
    message: PromptInputMessage;
    model: string;
  } | null;
  dispatch: (action: ThreadAction) => void;
};

export const useThreadStore = create<ThreadState>((set) => ({
  createThread: null,
  dispatch: (action) => {
    set({ createThread: action });
  },
}));

// 新增：Models store
export type ModelItem = { id: string; name: string };

type ModelsState = {
  models: Array<ModelItem>;
  isLoading: boolean;
  error: string | null;
  setModels: (items: Array<ModelItem>) => void;
  setLoading: (loading: boolean) => void;
  setError: (msg: string | null) => void;
  getModelById: (id: string) => ModelItem | undefined;
};

export const useModelsStore = create<ModelsState>((set, get) => ({
  models: [],
  isLoading: false,
  error: null,
  setModels: (items) => set({ models: items }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (msg) => set({ error: msg }),
  getModelById: (id) => get().models.find((m) => m.id === id),
}));
