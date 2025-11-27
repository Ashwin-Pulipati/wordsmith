import axios, { AxiosError } from "axios";

export type BrandingResult = {
  prompt: string;
  brandingSnippet: string;
  keywords: string[];
};

type BrandingApiResponse = {
  branding_text_result: string;
  keywords?: string[];
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

  async generateBranding(topic: string): Promise<BrandingResult> {
    const cleanTopic = topic.trim();

    if (!cleanTopic) {
      throw new Error("Topic cannot be empty.");
    }

    try {
      const { data } = await axios.get<BrandingApiResponse>(this.baseUrl, {
        params: { topic: cleanTopic },
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
      };
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 400) {
        throw new Error("Topic is invalid. Try a shorter phrase.");
      }
      throw new Error("Something went wrong while generating branding.");
    }
  }
}
