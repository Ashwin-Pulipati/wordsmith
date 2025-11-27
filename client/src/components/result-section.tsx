import { CopiedState, CopyType } from "@/hooks/use-copy-feedback";
import { BrandingResult } from "@/lib/branding-client";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type ResultSectionProps = {
  readonly result: BrandingResult;
  readonly copied: CopiedState;
  readonly onCopy: (type: CopyType, value: string | number, text: string) => void;
};

export default function ResultSection({ result, copied, onCopy }: ResultSectionProps) {
  const resultHeadingId = "wordsmith-result-heading";

  const snippetLines =
    result.brandingSnippet
      ?.split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 2) ?? [];

  return (
    <section
      aria-labelledby={resultHeadingId}
      className="mt-1 space-y-4 rounded-lg border bg-secondary/70 px-3 py-3"
    >
      <h2 id={resultHeadingId} className="text-sm font-semibold sr-only">
        Branding result
      </h2>

      {/* Snippets */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Branding snippets</h3>
        {snippetLines.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No snippets returned. Try a different topic.
          </p>
        ) : (
          <div className="grid gap-2">
            {snippetLines.map((snippet, index) => (
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
                  onClick={() => onCopy("snippet", index, snippet)}
                  aria-label={
                    copied.type === "snippet" && copied.value === index
                      ? "Branding snippet copied"
                      : "Copy branding snippet"
                  }
                >
                  {copied.type === "snippet" && copied.value === index ? (
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
        )}
      </div>

      {/* Keywords */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">Keywords</h3>
        {result.keywords.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No keywords returned for this topic.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {result.keywords.map((kw) => (
              <Button
                key={kw}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onCopy("keyword", kw, kw)}
                aria-label={
                  copied.type === "keyword" && copied.value === kw
                    ? `Keyword "${kw}" copied`
                    : `Copy keyword "${kw}"`
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
        )}
      </div>

      {/* Hashtags */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">Suggested hashtags</h3>
        {result.hashtags.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No hashtags generated for this topic.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {result.hashtags.map((tag) => (
              <Button
                key={tag}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onCopy("hashtag", tag, tag)}
                aria-label={
                  copied.type === "hashtag" && copied.value === tag
                    ? `Hashtag "${tag}" copied`
                    : `Copy hashtag "${tag}"`
                }
                className={cn(
                  "h-7 px-3 rounded-full text-xs inline-flex items-center gap-1.5",
                  "bg-accent/40 hover:bg-accent/70"
                )}
              >
                <span>{tag}</span>
                {copied.type === "hashtag" && copied.value === tag ? (
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
        )}
      </div>
    </section>
  );
}
