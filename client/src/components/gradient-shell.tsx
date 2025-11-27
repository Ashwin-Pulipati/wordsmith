import { cn } from "@/lib/utils";


export default function GradientShell({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={cn(
        "flex items-center justify-center",
        "bg-background text-foreground",
        "bg-[radial-gradient(circle_at_top,_theme(colors.chart-1/12),_transparent_55%)]",
        "dark:bg-[radial-gradient(circle_at_top,_theme(colors.chart-3/14),_transparent_55%)]"
      )}
    >
      {children}
    </main>
  );
}