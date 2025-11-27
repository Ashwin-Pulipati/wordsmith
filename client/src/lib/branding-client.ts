// lib/branding-client.ts
import axios from "axios";

export type BrandVoice =
  | "neutral"
  | "bold_minimalist"
  | "luxury_elegant"
  | "playful_modern"
  | "corporate"
  | "tech_data_driven"
  | "gen_z_social";

export type PromptInsights = {
  message: string;
  severity: "info" | "warning";
  suggestions: string[];
};

export type BrandingResult = {
  prompt: string;
  brandingSnippet: string;
  keywords: string[];
  hashtags: string[];
  voice: BrandVoice;
  promptInsights?: PromptInsights | null;
};

type BrandingApiResponse = {
  branding_text_result: string;
  keywords?: string[];
  hashtags?: string[];
  voice_profile?: BrandVoice;
  prompt_insights?: PromptInsights | null;
};

export interface BrandingClientConfig {
  baseUrl: string;
  timeoutMs?: number;
}

export class BrandingClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor({ baseUrl, timeoutMs = 15000 }: BrandingClientConfig) {
    if (!baseUrl) {
      throw new Error("BrandingClient requires a non-empty baseUrl");
    }
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
  }

  async generateBranding(
    topic: string,
    voice: BrandVoice = "neutral"
  ): Promise<BrandingResult> {
    const cleanTopic = topic.trim();

    if (!cleanTopic) {
      throw new Error("Topic cannot be empty.");
    }

    const { data } = await axios.get<BrandingApiResponse>(this.baseUrl, {
      params: { topic: cleanTopic, voice },
      timeout: this.timeoutMs,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return {
      prompt: cleanTopic,
      brandingSnippet: data.branding_text_result ?? "",
      keywords: data.keywords ?? [],
      hashtags: data.hashtags ?? [],
      voice: data.voice_profile ?? voice,
      promptInsights: data.prompt_insights ?? null,
    };
  }
}
