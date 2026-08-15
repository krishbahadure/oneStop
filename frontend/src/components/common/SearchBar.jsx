import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function SearchBar({ placeholder, value, onChange, className }) {
  const { t } = useTranslation();
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,14%,55%)] pointer-events-none" />
      <Input
        type="text"
        placeholder={placeholder || t("search_placeholder", "Search...")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-10 bg-[hsl(36,25%,98%)] border-[hsl(220,18%,88%)] focus:border-[hsl(252,50%,55%)] rounded-xl placeholder:text-[hsl(220,14%,60%)]"
      />
    </div>
  );
}
