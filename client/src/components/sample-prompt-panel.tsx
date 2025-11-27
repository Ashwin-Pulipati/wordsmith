import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { BrandVoice } from "@/lib/branding-client";

type SamplePromptProps = {
  readonly onApply: (sample: (typeof SAMPLE_PROMPTS)[number]) => void;
};

export const SAMPLE_PROMPTS: {
  topic: string;
  voice: BrandVoice;
  label: string;
  helper?: string;
}[] = [
  {
    topic: "specialty coffee roastery",
    voice: "bold_minimalist",
    label: "Specialty coffee roastery",
    helper: "Short, punchy lines for a craft coffee brand.",
  },
  {
    topic: "sustainable athleisure brand",
    voice: "luxury_elegant",
    label: "Sustainable athleisure",
    helper: "Premium, eco-friendly clothing angle.",
  },
  {
    topic: "ai-powered personal finance coach",
    voice: "tech_data_driven",
    label: "AI finance coach",
    helper: "Analytical tone for a fintech product.",
  },
  {
    topic: "boutique real estate agency",
    voice: "corporate",
    label: "Boutique real estate",
    helper: "Trust-focused copy for property services.",
  },
  {
    topic: "remote fitness coaching for busy professionals",
    voice: "playful_modern",
    label: "Remote fitness coaching",
    helper: "Friendly, motivating tone for coaching.",
  },
  {
    topic: "social-first beauty brand",
    voice: "gen_z_social",
    label: "Social-first beauty",
    helper: "Gen-Z, social-media-native vibe.",
  },
];


export default function SamplePromptPanel({ onApply }: SamplePromptProps) {
  return (
    <section
      aria-label="Example brand topics"
      className="rounded-lg border bg-secondary/60 px-3 py-2 space-y-2"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Quick start
        </p>
        <span className="text-[10px] text-muted-foreground">
          Tap a sample to prefill the form
        </span>
      </div>

      <div className="mt-1 flex flex-wrap gap-2">
        {SAMPLE_PROMPTS.map((sample) => (
          <Button
            key={sample.label}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onApply(sample)}
            className={cn(
              "h-7 rounded-full px-3 text-xs inline-flex items-center",
              "bg-background/70 hover:bg-accent/80 hover:border-primary/60",
              "text-foreground"
            )}
            aria-label={`Use sample topic: ${sample.label}`}
          >
            <span className="leading-tight">{sample.label}</span>
          </Button>
        ))}
      </div>
    </section>
  );
}
