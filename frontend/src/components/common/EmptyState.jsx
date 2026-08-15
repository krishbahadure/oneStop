import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function EmptyState({ icon: Icon, title, description, action, className }) {
  const { t } = useTranslation();
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl chip-lavender flex items-center justify-center mb-5">
          <Icon className="h-8 w-8" />
        </div>
      )}
      <h3 className="text-base font-bold text-[hsl(226,64%,14%)] mb-2">{title || t("pagestates_no_results", "No results found")}</h3>
      {description && <p className="text-[hsl(220,14%,50%)] text-sm max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
