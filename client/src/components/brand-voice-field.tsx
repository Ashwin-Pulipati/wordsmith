import { BrandVoice } from "@/lib/branding-client";
import { useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export type BrandingForm = {
  topic: string;
  voice: BrandVoice;
};

type BrandVoiceFieldProps = {
  readonly control: ReturnType<typeof useForm<BrandingForm>>["control"];
};

const VOICE_OPTIONS: { value: BrandVoice; label: string; hint: string }[] = [
  {
    value: "neutral",
    label: "Neutral professional",
    hint: "Clean, modern, versatile.",
  },
  {
    value: "bold_minimalist",
    label: "Bold & minimalist",
    hint: "Short, punchy, decisive.",
  },
  {
    value: "luxury_elegant",
    label: "Luxury & elegant",
    hint: "Premium, refined, aspirational.",
  },
  {
    value: "playful_modern",
    label: "Playful & modern",
    hint: "Upbeat and conversational.",
  },
  {
    value: "corporate",
    label: "Corporate & formal",
    hint: "Serious, B2B-focused tone.",
  },
  {
    value: "tech_data_driven",
    label: "Tech & data-driven",
    hint: "Analytical and precise.",
  },
  {
    value: "gen_z_social",
    label: "Gen-Z social",
    hint: "Casual, friendly, internet-native.",
  },
];


export default function BrandVoiceField({ control }: BrandVoiceFieldProps) {
  return (
    <FormField
      control={control}
      name="voice"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Brand voice</FormLabel>
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                aria-label="Select a brand voice"
                className="w-full"
              >
                <SelectValue placeholder="Pick a style" />
              </SelectTrigger>
              <SelectContent>
                {VOICE_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    title={opt.hint}
                    aria-description={opt.hint}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <p className="text-xs text-muted-foreground mt-1">
            Wordsmith rewrites copy to match this tone.
          </p>
        </FormItem>
      )}
    />
  );
}
