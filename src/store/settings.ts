import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Settings, AIProvider, Theme, PromptTemplate } from "../types";

interface SettingsStore extends Settings {
  favorites: string[];
  recentPrompts: string[];
  customPrompts: PromptTemplate[];
  setProvider: (provider: AIProvider) => void;
  setApiKey: (key: string) => void;
  setOllamaEndpoint: (endpoint: string) => void;
  setModel: (model: string) => void;
  setHotkey: (hotkey: string) => void;
  setTheme: (theme: Theme) => void;
  toggleFavorite: (id: string) => void;
  addRecentPrompt: (prompt: string) => void;
  addCustomPrompt: (prompt: PromptTemplate) => void;
  removeCustomPrompt: (id: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      provider: "openai",
      apiKey: "",
      ollamaEndpoint: "http://localhost:11434",
      model: "",
      hotkey: "CommandOrControl+Shift+Space",
      theme: "dark",
      favorites: [],
      recentPrompts: [],
      customPrompts: [],

      setProvider: (provider) => set({ provider }),
      setApiKey: (apiKey) => set({ apiKey }),
      setOllamaEndpoint: (ollamaEndpoint) => set({ ollamaEndpoint }),
      setModel: (model) => set({ model }),
      setHotkey: (hotkey) => set({ hotkey }),
      setTheme: (theme) => set({ theme }),

      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),

      addRecentPrompt: (prompt) =>
        set((state) => ({
          recentPrompts: [
            prompt,
            ...state.recentPrompts.filter((p) => p !== prompt),
          ].slice(0, 10),
        })),

      addCustomPrompt: (prompt) =>
        set((state) => ({
          customPrompts: [...state.customPrompts, prompt],
        })),

      removeCustomPrompt: (id) =>
        set((state) => ({
          customPrompts: state.customPrompts.filter((p) => p.id !== id),
        })),
    }),
    {
      name: "promptlight-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
