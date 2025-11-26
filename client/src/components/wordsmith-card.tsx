"use client";

import * as React from "react";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Copy, Check } from "lucide-react";

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

type BrandingResponse = {
  prompt: string;
  brandingSnippet: string;
  keywords: string[];
};

type BrandingForm = {
  topic: string;
};


export default function WordsmithCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BrandingResponse | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const [copied, setCopied] = useState<{
    type: "snippet" | "keyword" | null;
    value: string | number | null;
  }>({
    type: null,
    value: null,
  });

  const form = useForm<BrandingForm>({
    defaultValues: { topic: "" },
    mode: "onSubmit",
  });

  const watchedTopic = form.watch("topic") ?? "";
  const isDisabled = isLoading || !watchedTopic.trim();

  const handleCopy = async ({
    text,
    type,
    value,
  }: {
    text: string;
    type: "snippet" | "keyword";
    value: string | number;
  }) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ type, value });
      setTimeout(() => setCopied({ type: null, value: null }), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const onSubmit = form.handleSubmit(async ({ topic }) => {
    setServerError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const cleanTopic = topic.trim();

      const { data } = await axios.get<{
        branding_text_result: string;
        keywords: string[];
      }>(`${process.env.NEXT_PUBLIC_BASE_URL}`, {
        params: { topic: cleanTopic },
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      setResult({
        prompt: cleanTopic,
        brandingSnippet: data.branding_text_result,
        keywords: data.keywords ?? [],
      });
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error("API Error:", e.response ?? e);
        if (e.response?.status === 400) {
          setServerError("Topic is invalid. Try a shorter phrase.");
        } else {
          setServerError("Something went wrong. Please try again.");
        }
      } else {
        console.error("Non-API Error:", e);
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Card className="w-full max-w-md border border-border/80 shadow-lg shadow-primary/5">
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
              Tell me what your brand is about and I&apos;ll generate a short
              branding snippet and a set of keywords you can reuse across your
              campaigns.
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

      <Form {...form}>
        <form onSubmit={onSubmit} noValidate>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              rules={{
                required: "Please enter a brand topic.",
                maxLength: {
                  value: 32,
                  message: "Topic must be 32 characters or fewer.",
                },
              }}
              render={({ field }) => {
                const remaining = 32 - (field.value?.length ?? 0);
                return (
                  <FormItem>
                    <FormLabel className="flex justify-between gap-2">
                      Brand topic
                      <span className="text-xs text-muted-foreground">
                        {Math.max(0, remaining)} characters left
                      </span>
                    </FormLabel>
                    <FormControl>
                      <InputGroup aria-label="Tell Wordsmith what your brand is about">
                        <InputGroupAddon align="inline-start">
                          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            Prompt
                          </span>
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          maxLength={64} // hard cap, RHF still enforces 32
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck={false}
                          placeholder="e.g. specialty coffee roastery"
                        />
                      </InputGroup>
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Keep it short and specific — up to 32 characters.
                    </p>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {isLoading && (
              <div
                className="rounded-lg border bg-secondary/70 px-3 py-2 text-sm text-secondary-foreground flex items-center gap-2"
                role="status"
                aria-live="polite"
              >
                <span className="inline-flex size-2 rounded-full bg-primary animate-pulse" />
                Generating copy and keywords…
              </div>
            )}

            {serverError && !isLoading && (
              <p className="text-sm text-destructive" role="alert">
                {serverError}
              </p>
            )}

            {result && !isLoading && (
              <section
                aria-label="Branding result"
                className="mt-1 space-y-4 rounded-lg border bg-secondary/70 px-3 py-3"
              >
                {/* BRANDING SNIPPETS AS CARDS WITH COPY BUTTONS */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Branding snippets</h3>
                  <div className="grid gap-2">
                    {result.brandingSnippet
                      .split(/\r?\n/)
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .slice(0, 2) // up to 2 snippets
                      .map((snippet, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between gap-3 rounded-md border bg-card/60 px-3 py-2"
                        >
                          <p className="text-sm leading-relaxed">{snippet}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            onClick={() =>
                              handleCopy({
                                text: snippet,
                                type: "snippet",
                                value: index,
                              })
                            }
                            aria-label={
                              copied.type === "snippet" &&
                              copied.value === index
                                ? "Snippet copied"
                                : "Copy snippet"
                            }
                          >
                            {copied.type === "snippet" &&
                            copied.value === index ? (
                              <>
                                <Check className="size-4" />
                                <span className="sr-only">Copied</span>
                              </>
                            ) : (
                              <Copy className="size-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* KEYWORDS WITH INDIVIDUAL COPY BUTTONS */}
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Keywords</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {result.keywords.map((kw) => (
                      <Button
                        key={kw}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleCopy({
                            text: kw,
                            type: "keyword",
                            value: kw,
                          })
                        }
                        aria-label={
                          copied.type === "keyword" && copied.value === kw
                            ? `Keyword ${kw} copied`
                            : `Copy keyword ${kw}`
                        }
                        className={cn(
                          "h-7 px-3 rounded-full text-xs inline-flex items-center gap-1.5",
                          "bg-accent/40 hover:bg-accent/70"
                        )}
                      >
                        <span>{kw}</span>
                        {copied.type === "keyword" && copied.value === kw ? (
                          <>
                            <Check className="size-3.5" />
                            <span className="sr-only">Copied</span>
                          </>
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </CardContent>

          <CardFooter className="mt-2 flex flex-col gap-3">
            <Button
              type="submit"
              size="lg"
              disabled={isDisabled}
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

