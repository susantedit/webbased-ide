import { type NextRequest, NextResponse } from "next/server";
import { resolveAIConfig, callAICompletion, type ChatMessage } from "@/lib/ai-provider";

interface EnhancePromptRequest {
  prompt: string;
  context?: {
    fileName?: string;
    language?: string;
    codeContent?: string;
  };
}

async function generateAIResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  config: ReturnType<typeof resolveAIConfig>
) {
  const systemPrompt = `You are an expert AI coding assistant. You help developers with:
- Code explanations and debugging
- Best practices and architecture advice
- Writing clean, efficient code
- Troubleshooting errors
- Code reviews and optimizations

Always provide clear, practical answers. When showing code, use proper formatting with language-specific syntax.
Keep responses concise but comprehensive. Use code blocks with language specification when providing code examples.`;

  const fullMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  return await callAICompletion({
    messages: fullMessages,
    config,
    temperature: 0.7,
    maxTokens: 1500,
  });
}

async function enhancePrompt(
  request: EnhancePromptRequest,
  config: ReturnType<typeof resolveAIConfig>
) {
  const enhancementPrompt = `You are a prompt enhancement assistant. Take the user's basic prompt and enhance it to be more specific, detailed, and effective for a coding AI assistant.

Original prompt: "${request.prompt}"

Context: ${request.context ? JSON.stringify(request.context, null, 2) : "No additional context"}

Enhanced prompt should:
- Be more specific and detailed
- Include relevant technical context
- Ask for specific examples or explanations
- Be clear about expected output format
- Maintain the original intent

Return only the enhanced prompt, nothing else.`;

  try {
    const response = await callAICompletion({
      messages: [
        { role: "system", content: "You enhance coding prompts. Output only the improved prompt text." },
        { role: "user", content: enhancementPrompt },
      ],
      config,
      temperature: 0.3,
      maxTokens: 600,
    });
    return response.trim() || request.prompt;
  } catch (error) {
    console.error("Prompt enhancement error:", error);
    return request.prompt;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Resolve provider & credentials from headers or body
    const config = resolveAIConfig(req.headers, {
      provider: body.provider,
      apiKey: body.apiKey,
      model: body.model,
      ollamaBaseUrl: body.ollamaBaseUrl,
    });

    // Handle prompt enhancement
    if (body.action === "enhance") {
      const enhancedPrompt = await enhancePrompt(body as EnhancePromptRequest, config);
      return NextResponse.json({ enhancedPrompt });
    }

    // Handle regular chat
    const { message, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    const validHistory = Array.isArray(history)
      ? history.filter(
          (msg: any) =>
            msg &&
            typeof msg === "object" &&
            typeof msg.role === "string" &&
            typeof msg.content === "string" &&
            ["user", "assistant"].includes(msg.role)
        )
      : [];

    const recentHistory = validHistory.slice(-10);
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [
      ...recentHistory,
      { role: "user", content: message },
    ];

    const aiResponse = await generateAIResponse(messages, config);

    if (!aiResponse) {
      throw new Error("Empty response received from AI model");
    }

    return NextResponse.json({
      response: aiResponse,
      provider: config.provider,
      model: config.model,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in AI chat route:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: errorMessage,
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "AI Chat API is running",
    timestamp: new Date().toISOString(),
    info: "Supports Groq, Gemini, Anthropic Claude, OpenAI, xAI Grok, and Ollama.",
  });
}
