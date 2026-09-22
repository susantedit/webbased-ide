"use client";

import { useState, useEffect, useCallback } from "react";
import { type AIProvider, DEFAULT_MODELS } from "@/lib/ai-provider";

export interface AISettingsState {
  provider: AIProvider;
  apiKeys: Record<string, string>;
  customModels: Record<string, string>;
  ollamaBaseUrl: string;
}

const STORAGE_KEY = "vibecode_ai_settings_v1";

const DEFAULT_SETTINGS: AISettingsState = {
  provider: "groq",
  apiKeys: {
    groq: "",
    gemini: "",
    anthropic: "",
    openai: "",
    grok: "",
  },
  customModels: {
    groq: DEFAULT_MODELS.groq,
    gemini: DEFAULT_MODELS.gemini,
    anthropic: DEFAULT_MODELS.anthropic,
    openai: DEFAULT_MODELS.openai,
    grok: DEFAULT_MODELS.grok,
    ollama: DEFAULT_MODELS.ollama,
  },
  ollamaBaseUrl: "http://localhost:11434",
};

/**
 * Pure helper to read stored AI settings from localStorage
 */
export function getStoredAISettings(): AISettingsState {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      provider: parsed.provider || DEFAULT_SETTINGS.provider,
      apiKeys: { ...DEFAULT_SETTINGS.apiKeys, ...(parsed.apiKeys || {}) },
      customModels: { ...DEFAULT_SETTINGS.customModels, ...(parsed.customModels || {}) },
      ollamaBaseUrl: parsed.ollamaBaseUrl || DEFAULT_SETTINGS.ollamaBaseUrl,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Helper to produce request headers for /api/chat and /api/code-suggestion
 */
export function getAIHeaders(settings?: Partial<AISettingsState>): Record<string, string> {
  const current = settings ? { ...getStoredAISettings(), ...settings } : getStoredAISettings();
  const activeProvider = current.provider;
  const key = current.apiKeys?.[activeProvider] || "";
  const model = current.customModels?.[activeProvider] || DEFAULT_MODELS[activeProvider] || "";
  const ollamaUrl = current.ollamaBaseUrl || "http://localhost:11434";

  const headers: Record<string, string> = {
    "x-ai-provider": activeProvider,
  };

  if (key) {
    headers["x-ai-key"] = key;
  }
  if (model) {
    headers["x-ai-model"] = model;
  }
  if (activeProvider === "ollama" && ollamaUrl) {
    headers["x-ollama-url"] = ollamaUrl;
  }

  return headers;
}

export function useAISettings() {
  const [settings, setSettings] = useState<AISettingsState>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = getStoredAISettings();
    setSettings(stored);
    setIsLoaded(true);
  }, []);

  const saveSettings = useCallback((newSettings: AISettingsState) => {
    setSettings(newSettings);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
        // Dispatch custom event so other components listening on same tab update immediately
        window.dispatchEvent(new Event("vibecode_ai_settings_updated"));
      } catch (err) {
        console.error("Failed to save AI settings to localStorage", err);
      }
    }
  }, []);

  // Sync across tabs or intra-page listeners
  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getStoredAISettings());
    };
    window.addEventListener("vibecode_ai_settings_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("vibecode_ai_settings_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const setProvider = useCallback(
    (provider: AIProvider) => {
      saveSettings({ ...settings, provider });
    },
    [settings, saveSettings]
  );

  const setApiKey = useCallback(
    (provider: string, key: string) => {
      saveSettings({
        ...settings,
        apiKeys: { ...settings.apiKeys, [provider]: key },
      });
    },
    [settings, saveSettings]
  );

  const setCustomModel = useCallback(
    (provider: string, model: string) => {
      saveSettings({
        ...settings,
        customModels: { ...settings.customModels, [provider]: model },
      });
    },
    [settings, saveSettings]
  );

  const setOllamaBaseUrl = useCallback(
    (url: string) => {
      saveSettings({ ...settings, ollamaBaseUrl: url });
    },
    [settings, saveSettings]
  );

  const resetSettings = useCallback(() => {
    saveSettings(DEFAULT_SETTINGS);
  }, [saveSettings]);

  return {
    settings,
    isLoaded,
    setProvider,
    setApiKey,
    setCustomModel,
    setOllamaBaseUrl,
    resetSettings,
    getHeaders: () => getAIHeaders(settings),
  };
}
