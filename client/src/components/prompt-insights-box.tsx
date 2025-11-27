import { BrandingResult } from "@/lib/branding-client";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

type PromptInsightsProps = {
  readonly result: BrandingResult | null;
};

export default function PromptInsightsBox({ result }: PromptInsightsProps) {
  if (!result?.promptInsights) return null;

  const { message, severity, suggestions } = result.promptInsights;

  return (
    <div
      className={cn(
        "rounded-md border px-3 py-2 text-xs flex gap-2 items-start",
        severity === "warning"
          ? "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
          : "bg-secondary/70 text-secondary-foreground"
      )}
      aria-live="polite"
    >
      <Sparkles className="mt-[1px] h-3.5 w-3.5 shrink-0" />
      <div className="space-y-1">
        <p className="font-semibold">Prompt tip</p>
        <p>{message}</p>
        {suggestions?.length > 0 && (
          <ul className="list-disc pl-4 space-y-0.5">
            {suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}