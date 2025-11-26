import GradientShell from "@/components/gradient-shell";
import WordsmithCard from "@/components/wordsmith-card";

export default function WordsmithPage() {
  return (
    <GradientShell>
      <div className="sr-only">
        <h1>Wordsmith - AI branding assistant</h1>
      </div>
      <WordsmithCard />
    </GradientShell>
  );
}
