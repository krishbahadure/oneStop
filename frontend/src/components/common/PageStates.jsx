// Shared loading, error, and empty state components
import { RefreshCw, WifiOff, AlertCircle, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function PageLoader({ message }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
      <div className="w-8 h-8 border-3 border-[hsl(252,50%,55%)] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[hsl(220,14%,50%)]">{message || t("pagestates_no_results", "Loading...")}</p>
    </div>
  );
}

export function PageError({ error, onRetry }) {
  const { t } = useTranslation();
  const isOffline = error?.toLowerCase().includes("offline");
  const Icon = isOffline ? WifiOff : AlertCircle;
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-6 text-center">
      <div className="w-12 h-12 rounded-2xl chip-peach flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold text-[hsl(226,64%,14%)] text-sm">
          {isOffline ? t("pagestates_offline", "You're offline") : t("pagestates_error", "Something went wrong")}
        </p>
        <p className="text-xs text-[hsl(220,14%,50%)] mt-1 max-w-xs">{error || t("pagestates_load_failed", "Failed to load data.")}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} className="gap-2 text-xs">
          <RefreshCw className="h-3.5 w-3.5" /> {t("pagestates_try_again", "Try again")}
        </Button>
      )}
    </div>
  );
}

export function PageEmpty({ message, icon: Icon = SearchX }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[30vh] gap-3 text-center px-6">
      <div className="w-12 h-12 rounded-2xl chip-blue flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-[hsl(220,14%,50%)]">{message || t("pagestates_no_results", "No results found")}</p>
    </div>
  );
}

export function VerifiedBadge({ isVerified, lastUpdated }) {
  const { t } = useTranslation();
  if (!isVerified) return null;
  const date = lastUpdated ? new Date(lastUpdated).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit' }) : null;
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-md chip-mint">
      ✓ {t("pagestates_verified", "Verified")}{date ? ` · ${date}` : ''}
    </span>
  );
}
