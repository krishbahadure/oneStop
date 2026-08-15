import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function MatchBadge({ score }) {
  const { t } = useTranslation();
  const color =
    score >= 85
      ? "chip-lavender"
      : score >= 70
      ? "chip-mint"
      : "chip-yellow";

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold", color)}>
      {score}% {t("match_label", "Match")}
    </span>
  );
}
