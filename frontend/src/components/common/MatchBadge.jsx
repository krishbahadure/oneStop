import { cn } from "@/lib/utils";

export function MatchBadge({ score }) {
  const color =
    score >= 85
      ? "chip-lavender"
      : score >= 70
      ? "chip-mint"
      : "chip-yellow";

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold", color)}>
      {score}% Match
    </span>
  );
}
