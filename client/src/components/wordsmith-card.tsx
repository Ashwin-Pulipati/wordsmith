"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import {
  BrandingResult
} from "@/lib/branding-client";
import BrandVoiceField, { BrandingForm } from "./brand-voice-field";
import useBrandingClient from "@/hooks/use-branding-client";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import SamplePromptPanel, { SAMPLE_PROMPTS } from "./sample-prompt-panel";
import PromptInsightsBox from "./prompt-insights-box";
import ResultSection from "./result-section";

const TOPIC_LIMIT = 100; 

function isMeaningfulTopic(raw: string): boolean {
  const topic = raw.trim();

  if (!topic) return false;
  if (topic.length < 3) return false;

  const letters = topic.replace(/[^a-z]/gi, "");
  if (!letters) return false;

  const totalLen = topic.length;
  const nonLetters = totalLen - letters.length;
 
  if (totalLen >= 12 && nonLetters / totalLen > 0.4) {
    return false;
  }
  
  if (
    letters.length >= 6 &&
    new Set(letters.toLowerCase().split("")).size <= 2
  ) {
    return false;
  }
  
  const tokens = topic.toLowerCase().split(/\s+/).filter(Boolean);

  const wordLikeTokens = tokens.filter((t) => /[a-z]/.test(t));

  const hasRealWord = wordLikeTokens.some((token) => {
    const t = token.replace(/[^a-z]/g, "");
    if (t.length < 3 || t.length > 40) return false;
    const vowels = (t.match(/[aeiou]/g) || []).length;
    return vowels >= 1;
  });

  if (!hasRealWord) return false;

  return true;
}

export default function WordsmithCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BrandingResult | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<BrandingForm>({
    defaultValues: { topic: "", voice: "neutral" },
    mode: "onChange",
  });

  const brandingClient = useBrandingClient();
  const { copied, message: copyMessage, handleCopy } = useCopyFeedback();

  const watchedTopic = form.watch("topic") ?? "";
  const hasTopicError = !!form.formState.errors.topic;
  const isDisabled = isLoading || !watchedTopic.trim() || hasTopicError;

  const applySamplePrompt = useCallback(
    (sample: (typeof SAMPLE_PROMPTS)[number]) => {
      form.setValue("topic", sample.topic, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      form.setValue("voice", sample.voice, {
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [form]
  );

  const onSubmit = form.handleSubmit(async ({ topic, voice }) => {
    setServerError(null);
    setResult(null);

    if (!brandingClient) {
      setServerError("Configuration error. Please contact support.");
      return;
    }

    setIsLoading(true);

    try {
      const branding = await brandingClient.generateBranding(topic, voice);
      setResult(branding);
    } catch (e: unknown) {
      console.error("Branding error:", e);
      if (axios.isAxiosError(e) && e.response?.status === 400) {
        const detail = (e.response.data as any)?.detail ?? "Topic is invalid.";
        setServerError(detail);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Card className="w-full max-w-2xl border border-border/80 shadow-lg shadow-primary/5">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Branding assistant
            </p>
            <CardTitle className="mt-1 text-2xl font-semibold leading-tight">
              <span className="text-gradient">Wordsmith</span>
            </CardTitle>
            <CardDescription className="mt-2 max-w-[28rem] text-sm">
              Tell me what your brand is about and I&apos;ll generate short
              branding copy, keywords, and social-ready hashtags tailored to
              your brand voice.
            </CardDescription>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="secondary"
                className="text-xs font-medium px-3 py-1"
                aria-label="Wordsmith is powered by AI"
              >
                AI-powered
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Powered securely by OpenAI APIs</TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>

      <div aria-live="polite" className="sr-only">
        {copyMessage}
      </div>

      <Form {...form}>
        <form
          onSubmit={onSubmit}
          noValidate
          aria-busy={isLoading ? "true" : "false"}
        >
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              rules={{
                required: "Please enter a brand topic.",
                maxLength: {
                  value: TOPIC_LIMIT,
                  message: `Topic must be ${TOPIC_LIMIT} characters or fewer.`,
                },
                validate: {
                  meaningful: (value) =>
                    !value ||
                    isMeaningfulTopic(value) ||
                    "Please enter a short, descriptive brand topic (e.g. 'specialty coffee roastery' or 'AI finance coach').",
                },
              }}
              render={({ field }) => {
                const remaining = TOPIC_LIMIT - (field.value?.length ?? 0);
                const helperId = "wordsmith-topic-help";
                const counterId = "wordsmith-topic-counter";

                return (
                  <FormItem>
                    <FormLabel className="flex justify-between gap-2">
                      <span>Brand topic</span>
                      <span
                        id={counterId}
                        className="text-xs text-muted-foreground"
                      >
                        {Math.max(0, remaining)} characters left
                      </span>
                    </FormLabel>
                    <FormControl>
                      <InputGroup
                        aria-label="Tell Wordsmith what your brand is about"
                        aria-describedby={`${helperId} ${counterId}`}
                      >
                        <InputGroupAddon align="inline-start">
                          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            Prompt
                          </span>
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          maxLength={TOPIC_LIMIT}
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck={false}
                          placeholder="e.g. specialty coffee roastery"
                        />
                      </InputGroup>
                    </FormControl>
                    <p
                      id={helperId}
                      className="text-xs text-muted-foreground mt-1"
                    >
                      Keep it short and specific — up to {TOPIC_LIMIT}{" "}
                      characters.
                    </p>
                    <FormMessage />
                  
                    <SamplePromptPanel onApply={applySamplePrompt} />
                  </FormItem>
                );
              }}
            />

            <BrandVoiceField control={form.control} />

            <PromptInsightsBox result={result} />

            {isLoading && (
              <div
                className="rounded-lg border bg-secondary/70 px-3 py-2 text-sm text-secondary-foreground flex items-center gap-2"
                role="status"
                aria-live="polite"
              >
                <span className="inline-flex size-2 rounded-full bg-primary animate-pulse" />
                Generating copy, keywords, and hashtags…
              </div>
            )}

            {serverError && !isLoading && (
              <p className="text-sm text-destructive" role="alert">
                {serverError}
              </p>
            )}

            {result && !isLoading && (
              <ResultSection
                result={result}
                copied={copied}
                onCopy={handleCopy}
              />
            )}
          </CardContent>

          <CardFooter className="mt-2 flex flex-col gap-3">
            <Button
              type="submit"
              size="lg"
              disabled={isDisabled}
              aria-disabled={isDisabled ? "true" : "false"}
              className={cn(
                "w-full text-primary-foreground",
                "bg-[linear-gradient(120deg,_theme(colors.primary),_theme(colors.chart-2),_theme(colors.chart-4))]",
                "hover:bg-[linear-gradient(120deg,_theme(colors.primary/90),_theme(colors.chart-2/90),_theme(colors.chart-4/90))]"
              )}
            >
              {isLoading ? "Thinking…" : "Generate copy"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Built for real-world campaigns. Accessible, keyboard-friendly, and
              screen-reader aware.
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}