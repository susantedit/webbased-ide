"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  useAISettings,
  getAIHeaders,
} from "@/features/playground/hooks/useAISettings";
import {
  type AIProvider,
  DEFAULT_MODELS,
} from "@/lib/ai-provider";
import {
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Server,
  Zap,
  Bot,
  ShieldCheck,
} from "lucide-react";

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProviderMeta {
  name: string;
  badge?: string;
  description: string;
  getKeyUrl?: string;
  models: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const PROVIDERS: Record<AIProvider, ProviderMeta> = {
  groq: {
    name: "Groq",
    badge: "Recommended",
    description: "Ultra-fast inference. Excellent for real-time code suggestions and chat.",
    getKeyUrl: "https://console.groq.com/keys",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
    icon: Zap,
  },
  gemini: {
    name: "Google Gemini",
    badge: "Free Tier",
    description: "Google Gemini 2.0 and 1.5 Flash models via Google AI Studio.",
    getKeyUrl: "https://aistudio.google.com/app/apikey",
    models: ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"],
    icon: Sparkles,
  },
  anthropic: {
    name: "Claude (Anthropic)",
    description: "State-of-the-art coding abilities with Claude 3.5 Sonnet.",
    getKeyUrl: "https://console.anthropic.com/settings/keys",
    models: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022"],
    icon: Bot,
  },
  openai: {
    name: "OpenAI",
    description: "GPT-4o and lightweight GPT-4o-mini models.",
    getKeyUrl: "https://platform.openai.com/api-keys",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"],
    icon: Bot,
  },
  grok: {
    name: "xAI Grok",
    badge: "xAI",
    description: "Advanced reasoning and coding capabilities powered by xAI Grok.",
    getKeyUrl: "https://console.x.ai",
    models: ["grok-2-latest", "grok-beta", "grok-vision-beta"],
    icon: Bot,
  },
  ollama: {
    name: "Ollama (Local)",
    badge: "Self-Hosted",
    description: "Run offline models on your own machine or remote server without external keys.",
    models: ["codellama:latest", "llama3.2:latest", "qwen2.5-coder:latest", "deepseek-coder:latest"],
    icon: Server,
  },
};

export function AISettingsModal({ isOpen, onClose }: AISettingsModalProps) {
  const {
    settings,
    setProvider,
    setApiKey,
    setCustomModel,
    setOllamaBaseUrl,
  } = useAISettings();

  const [activeTab, setActiveTab] = useState<AIProvider>(settings.provider);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showOllamaGuide, setShowOllamaGuide] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: "success" | "error" | null;
    message: string;
  }>({ status: null, message: "" });

  const currentProvider = PROVIDERS[activeTab];
  const currentKey = settings.apiKeys[activeTab] || "";
  const currentModel = settings.customModels[activeTab] || DEFAULT_MODELS[activeTab];

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult({ status: null, message: "" });

    try {
      // Build test headers using the tab's current values
      const testHeaders = getAIHeaders({
        provider: activeTab,
        apiKeys: settings.apiKeys,
        customModels: settings.customModels,
        ollamaBaseUrl: settings.ollamaBaseUrl,
      });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...testHeaders,
        },
        body: JSON.stringify({
          message: "Hi, reply with one word: 'Ready'",
          history: [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      setTestResult({
        status: "success",
        message: `Connected successfully! Response: "${data.response?.slice(0, 40)}..."`,
      });
    } catch (err: any) {
      setTestResult({
        status: "error",
        message: err.message || "Connection failed. Check your API key or endpoint.",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSetAsActive = () => {
    setProvider(activeTab);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <div className="flex items-center justify-between pr-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <DialogTitle className="text-xl font-bold">AI Provider & Key Settings</DialogTitle>
            </div>
            {settings.provider === activeTab ? (
              <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/10 text-emerald-400">
                Active Provider
              </Badge>
            ) : null}
          </div>
          <DialogDescription className="text-zinc-400 text-sm">
            Choose an AI provider for code suggestions and assistant chat. You can use your own API key or let the app fall back to server environment variables.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            const providerVal = val as AIProvider;
            setActiveTab(providerVal);
            setTestResult({ status: null, message: "" });
            if (providerVal === "ollama") {
              setShowOllamaGuide(true);
            }
          }}
          className="w-full mt-2"
        >
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 bg-zinc-900 border border-zinc-800 p-1">
            {(Object.keys(PROVIDERS) as AIProvider[]).map((pKey) => {
              const p = PROVIDERS[pKey];
              const Icon = p.icon;
              const hasKey = pKey === "ollama" || Boolean(settings.apiKeys[pKey]);
              const isActive = settings.provider === pKey;

              return (
                <TabsTrigger
                  key={pKey}
                  value={pKey}
                  className="flex items-center gap-1.5 text-xs py-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 relative"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="truncate">{p.name.split(" ")[0]}</span>
                  {isActive && (
                    <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  )}
                  {!isActive && hasKey && pKey !== "ollama" && (
                    <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {(Object.keys(PROVIDERS) as AIProvider[]).map((pKey) => {
            const p = PROVIDERS[pKey];
            return (
              <TabsContent key={pKey} value={pKey} className="space-y-4 pt-4">
                <div className="flex items-start justify-between border-b border-zinc-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-zinc-100">{p.name}</h3>
                      {p.badge && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {p.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{p.description}</p>
                  </div>

                  {p.getKeyUrl ? (
                    <a
                      href={p.getKeyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 shrink-0 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1.5 rounded-md transition-colors"
                    >
                      <span>Get API Key</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : pKey === "ollama" ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowOllamaGuide(true)}
                      className="text-xs border-zinc-800 hover:bg-zinc-800 text-indigo-400 hover:text-indigo-300 h-8"
                    >
                      <span>Setup Guide</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  ) : null}
                </div>

                {pKey !== "ollama" ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`api-key-${pKey}`} className="text-xs font-medium text-zinc-300">
                        {p.name} API Key
                      </Label>
                      <span className="text-[11px] text-zinc-500">
                        {currentKey ? "Key saved locally" : "Optional if set in .env"}
                      </span>
                    </div>

                    <div className="relative">
                      <Input
                        id={`api-key-${pKey}`}
                        type={showKey ? "text" : "password"}
                        placeholder={`Paste your ${p.name} API key...`}
                        value={currentKey}
                        onChange={(e) => setApiKey(pKey, e.target.value.trim())}
                        className="pr-20 bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 font-mono text-xs focus-visible:ring-indigo-500"
                      />
                      <div className="absolute right-1 top-1 flex items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowKey(!showKey)}
                          className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-200"
                        >
                          {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>
                        {currentKey && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setApiKey(pKey, "")}
                            className="h-7 px-2 text-[11px] text-red-400 hover:text-red-300"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/50">
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                          <Server className="h-3.5 w-3.5 text-indigo-400" />
                          Self-Hosting or Local Ollama
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Need local model setup or want to self-host this web IDE?
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setShowOllamaGuide(true)}
                        className="text-xs shrink-0 bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/40"
                      >
                        View Guide & Repo
                      </Button>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="ollama-url" className="text-xs font-medium text-zinc-300">
                        Ollama Base URL
                      </Label>
                      <Input
                        id="ollama-url"
                        type="text"
                        placeholder="http://localhost:11434"
                        value={settings.ollamaBaseUrl}
                        onChange={(e) => setOllamaBaseUrl(e.target.value.trim())}
                        className="bg-zinc-900 border-zinc-800 text-zinc-200 font-mono text-xs focus-visible:ring-indigo-500"
                      />
                      <p className="text-[11px] text-zinc-500">
                        Default is <code className="text-zinc-400">http://localhost:11434</code>. Must enable CORS (<code className="text-zinc-400">OLLAMA_ORIGINS=&quot;*&quot;</code>).
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`model-${pKey}`} className="text-xs font-medium text-zinc-300">
                      Model
                    </Label>
                    <span className="text-[11px] text-zinc-500">Default: {DEFAULT_MODELS[pKey]}</span>
                  </div>

                  <div className="flex gap-2">
                    <select
                      id={`model-select-${pKey}`}
                      value={currentModel}
                      onChange={(e) => setCustomModel(pKey, e.target.value)}
                      className="flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-200 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                    >
                      {p.models.map((m) => (
                        <option key={m} value={m} className="bg-zinc-900 text-zinc-200">
                          {m}
                        </option>
                      ))}
                    </select>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCustomModel(pKey, DEFAULT_MODELS[pKey])}
                      className="shrink-0 text-xs border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    >
                      Reset
                    </Button>
                  </div>
                </div>

                {testResult.status && (
                  <div
                    className={`flex items-start gap-2 p-3 rounded-md text-xs border ${
                      testResult.status === "success"
                        ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                        : "bg-red-950/40 border-red-800 text-red-300"
                    }`}
                  >
                    {testResult.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                    )}
                    <span className="break-all">{testResult.message}</span>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="flex items-center gap-2 rounded-md bg-zinc-900/60 border border-zinc-800/80 p-3 text-[11px] text-zinc-400">
          <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-400" />
          <span>
            API keys are saved in your browser&apos;s <code className="text-zinc-300">localStorage</code>. They are sent directly to the API endpoint and are never written to the database.
          </span>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between w-full border-t border-zinc-800/80 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTestConnection}
            disabled={testing}
            className="border-zinc-800 hover:bg-zinc-900 text-zinc-300"
          >
            {testing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Testing...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>

          <div className="flex items-center gap-2">
            {settings.provider !== activeTab ? (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleSetAsActive}
                className="bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Set {PROVIDERS[activeTab].name} as Active
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onClose}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              >
                Done
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={showOllamaGuide} onOpenChange={setShowOllamaGuide}>
      <DialogContent className="sm:max-w-lg bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-indigo-400" />
            <DialogTitle className="text-lg font-bold">Using Ollama & Self-Hosting</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-400 text-xs">
            Run private and offline AI coding models on your machine or private GPU server.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs text-zinc-300">
          <div className="p-3 rounded-md bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="font-semibold text-zinc-100">1. Install and start Ollama with CORS</div>
            <p className="text-zinc-400 text-[11px]">
              Browsers require CORS headers to connect directly to your local Ollama instance:
            </p>
            <pre className="p-2 rounded bg-black/50 text-[11px] font-mono text-indigo-300 overflow-x-auto">
              OLLAMA_ORIGINS=&quot;*&quot; ollama serve
            </pre>
          </div>

          <div className="p-3 rounded-md bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="font-semibold text-zinc-100">2. Pull a coding model</div>
            <pre className="p-2 rounded bg-black/50 text-[11px] font-mono text-emerald-300 overflow-x-auto">
              ollama pull codellama:latest
              # or
              ollama pull qwen2.5-coder:latest
            </pre>
          </div>

          <div className="p-3 rounded-md bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="font-semibold text-zinc-100">3. Self-Host the Full Web IDE</div>
            <p className="text-zinc-400 text-[11px]">
              For an integrated self-hosted environment, view the official repository on GitHub:
            </p>
            <div className="pt-1">
              <a
                href="https://github.com/susantedit/webbased-ide"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
              >
                <span>https://github.com/susantedit/webbased-ide</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowOllamaGuide(false)}
            className="border-zinc-800 hover:bg-zinc-800 text-zinc-300"
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
