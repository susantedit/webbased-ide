export type AIProvider = "groq" | "gemini" | "anthropic" | "openai" | "grok" | "ollama";

export interface AIConfig {
  provider?: AIProvider;
  apiKey?: string;
  model?: string;
  ollamaBaseUrl?: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  groq: "llama-3.3-70b-versatile",
  gemini: "gemini-2.0-flash",
  anthropic: "claude-3-5-sonnet-20241022",
  openai: "gpt-4o-mini",
  grok: "grok-2-latest",
  ollama: "codellama:latest",
};

/**
 * Resolve provider and API key from request headers/options and fallback to environment variables.
 */
export function resolveAIConfig(reqHeaders?: Headers, overrides?: Partial<AIConfig>): {
  provider: AIProvider;
  apiKey: string;
  model: string;
  ollamaBaseUrl: string;
} {
  const headerProvider = (reqHeaders?.get("x-ai-provider") || overrides?.provider) as AIProvider | undefined;
  const headerKey = reqHeaders?.get("x-ai-key") || overrides?.apiKey || "";
  const headerModel = reqHeaders?.get("x-ai-model") || overrides?.model || "";
  const headerOllamaUrl = reqHeaders?.get("x-ollama-url") || overrides?.ollamaBaseUrl || "";

  const validProviders: AIProvider[] = ["groq", "gemini", "anthropic", "openai", "grok", "ollama"];

  // Determine provider: Client header -> Server env AI_PROVIDER -> Autodetect from configured server keys -> fallback "groq" -> "ollama"
  let provider: AIProvider = "groq";

  if (headerProvider && validProviders.includes(headerProvider)) {
    provider = headerProvider;
  } else if (process.env.AI_PROVIDER && validProviders.includes(process.env.AI_PROVIDER as AIProvider)) {
    provider = process.env.AI_PROVIDER as AIProvider;
  } else if (process.env.GROQ_API_KEY) {
    provider = "groq";
  } else if (process.env.GEMINI_API_KEY) {
    provider = "gemini";
  } else if (process.env.OPENAI_API_KEY) {
    provider = "openai";
  } else if (process.env.GROK_API_KEY || process.env.XAI_API_KEY) {
    provider = "grok";
  } else if (process.env.ANTHROPIC_API_KEY) {
    provider = "anthropic";
  } else {
    provider = "ollama";
  }

  // Resolve API key: Client header > Provider-specific env variable
  let apiKey = headerKey;
  if (!apiKey) {
    switch (provider) {
      case "groq":
        apiKey = process.env.GROQ_API_KEY || "";
        break;
      case "gemini":
        apiKey = process.env.GEMINI_API_KEY || "";
        break;
      case "anthropic":
        apiKey = process.env.ANTHROPIC_API_KEY || "";
        break;
      case "openai":
        apiKey = process.env.OPENAI_API_KEY || "";
        break;
      case "grok":
        apiKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY || "";
        break;
      case "ollama":
        apiKey = "";
        break;
    }
  }

  const model = headerModel || process.env.AI_MODEL || DEFAULT_MODELS[provider];
  const ollamaBaseUrl = headerOllamaUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434";

  return { provider, apiKey, model, ollamaBaseUrl };
}

/**
 * Execute chat completion across any supported provider.
 */
export async function callAICompletion({
  messages,
  config,
  temperature = 0.7,
  maxTokens = 1500,
}: {
  messages: ChatMessage[];
  config: { provider: AIProvider; apiKey: string; model: string; ollamaBaseUrl: string };
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const { provider, apiKey, model, ollamaBaseUrl } = config;

  if (provider !== "ollama" && !apiKey) {
    const envName = `${provider.toUpperCase()}_API_KEY`;
    throw new Error(
      `No API key configured for ${provider.toUpperCase()}. Please add your API key in AI Settings or set ${envName} in your environment variables.`
    );
  }

  const controller = new AbortController();
  const timeoutMs = provider === "ollama" ? 25000 : 20000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    switch (provider) {
      case "groq": {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model || DEFAULT_MODELS.groq,
            messages,
            temperature,
            max_tokens: maxTokens,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`Groq API error (${res.status}): ${errBody}`);
        }

        const data = await res.json();
        return data.choices?.[0]?.message?.content || "";
      }

      case "openai": {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model || DEFAULT_MODELS.openai,
            messages,
            temperature,
            max_tokens: maxTokens,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`OpenAI API error (${res.status}): ${errBody}`);
        }

        const data = await res.json();
        return data.choices?.[0]?.message?.content || "";
      }

      case "grok": {
        const res = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model || DEFAULT_MODELS.grok,
            messages,
            temperature,
            max_tokens: maxTokens,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`xAI Grok error (${res.status}): ${errBody}`);
        }

        const data = await res.json();
        return data.choices?.[0]?.message?.content || "";
      }

      case "gemini": {
        // Google Gemini supports OpenAI-compatible API endpoint
        const res = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model || DEFAULT_MODELS.gemini,
            messages,
            temperature,
            max_tokens: maxTokens,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`Google Gemini API error (${res.status}): ${errBody}`);
        }

        const data = await res.json();
        return data.choices?.[0]?.message?.content || "";
      }

      case "anthropic": {
        // Separate system messages for Anthropic messages API
        const systemMessage = messages.find((m) => m.role === "system")?.content || "";
        const userAndAssistantMessages = messages
          .filter((m) => m.role !== "system")
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }));

        // Anthropic requires the first message in messages array to be user
        if (userAndAssistantMessages.length === 0 || userAndAssistantMessages[0].role !== "user") {
          userAndAssistantMessages.unshift({ role: "user", content: "Hello" });
        }

        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: model || DEFAULT_MODELS.anthropic,
            max_tokens: maxTokens,
            temperature,
            ...(systemMessage ? { system: systemMessage } : {}),
            messages: userAndAssistantMessages,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`Anthropic Claude API error (${res.status}): ${errBody}`);
        }

        const data = await res.json();
        const firstTextBlock = data.content?.find((c: any) => c.type === "text");
        return firstTextBlock?.text || "";
      }

      case "ollama": {
        const normalizedBase = (ollamaBaseUrl || "http://localhost:11434").replace(/\/$/, "");
        const res = await fetch(`${normalizedBase}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: model || DEFAULT_MODELS.ollama,
            messages,
            stream: false,
            options: {
              temperature,
              num_predict: maxTokens,
            },
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`Ollama error (${res.status}): ${errBody}`);
        }

        const data = await res.json();
        return data.message?.content || "";
      }

      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error(`Request timed out waiting for ${provider.toUpperCase()} to respond.`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
