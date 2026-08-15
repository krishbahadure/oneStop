import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, ChevronUp, Check } from "lucide-react";
import { supportedLanguages } from "@/i18n";
import { cn } from "@/lib/utils";

export default function LanguageSelector({
  variant = "default",
  direction = "down",
  className = ""
}) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang =
    supportedLanguages.find((l) => l.code === (i18n.language || "en")) ||
    supportedLanguages[0];

  const handleSelect = (code, e) => {
    e?.stopPropagation();
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isUp = direction === "up";

  if (variant === "compact") {
    return (
      <div
        className={cn("relative inline-block text-left", className)}
        ref={dropdownRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          title="Change language"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[hsl(220,18%,88%)] bg-white/80 hover:bg-[hsl(36,33%,94%)] text-xs font-medium text-[hsl(220,14%,35%)] transition-all shadow-2xs hover:shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[hsl(226,64%,20%)]/20 cursor-pointer"
        >
          <Globe className="h-3.5 w-3.5 text-[hsl(226,64%,20%)] flex-shrink-0" />
          <span className="font-semibold uppercase tracking-wider">{currentLang.code}</span>
          {isUp ? (
            <ChevronUp
              className={cn(
                "h-3 w-3 text-[hsl(220,14%,50%)] transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          ) : (
            <ChevronDown
              className={cn(
                "h-3 w-3 text-[hsl(220,14%,50%)] transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          )}
        </button>

        {isOpen && (
          <div
            className={cn(
              "absolute right-0 z-50 w-44 rounded-xl bg-white border border-[hsl(220,18%,90%)] shadow-xl shadow-black/10 py-1.5 focus:outline-hidden animate-in fade-in duration-150",
              isUp
                ? "bottom-full mb-1.5 origin-bottom zoom-in-95"
                : "top-full mt-1.5 origin-top zoom-in-95"
            )}
          >
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[hsl(220,14%,50%)] border-b border-[hsl(220,18%,94%)] mb-1">
              Select Language
            </div>
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === currentLang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={(e) => handleSelect(lang.code, e)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer",
                    isSelected
                      ? "bg-[hsl(226,64%,20%)]/8 text-[hsl(226,64%,20%)] font-semibold"
                      : "text-[hsl(220,14%,30%)] hover:bg-[hsl(36,33%,96%)]"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="text-xs leading-tight font-medium">{lang.nativeName}</span>
                    <span className="text-[10px] text-[hsl(220,14%,55%)]">{lang.name}</span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-[hsl(226,64%,20%)] flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Default button / dropdown for Navbars & Footers
  return (
    <div
      className={cn("relative inline-block text-left", className)}
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[hsl(220,18%,88%)] bg-white/90 hover:bg-[hsl(36,33%,94%)] text-xs font-medium text-[hsl(220,14%,30%)] transition-all shadow-2xs hover:border-[hsl(226,64%,20%)]/30 focus:outline-hidden focus:ring-2 focus:ring-[hsl(226,64%,20%)]/20 cursor-pointer"
      >
        <Globe className="h-3.5 w-3.5 text-[hsl(226,64%,20%)] flex-shrink-0" />
        <span className="font-semibold text-xs text-[hsl(226,64%,14%)]">{currentLang.nativeName}</span>
        {isUp ? (
          <ChevronUp
            className={cn(
              "h-3.5 w-3.5 text-[hsl(220,14%,50%)] transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        ) : (
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-[hsl(220,14%,50%)] transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        )}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 z-50 w-48 rounded-2xl bg-white border border-[hsl(220,18%,90%)] shadow-2xl shadow-black/10 py-2 focus:outline-hidden animate-in fade-in duration-150",
            isUp
              ? "bottom-full mb-2 origin-bottom zoom-in-95"
              : "top-full mt-2 origin-top zoom-in-95"
          )}
        >
          <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[hsl(220,14%,50%)] border-b border-[hsl(220,18%,94%)] mb-1">
            Language / زبان / भाषा
          </div>
          {supportedLanguages.map((lang) => {
            const isSelected = lang.code === currentLang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={(e) => handleSelect(lang.code, e)}
                className={cn(
                  "w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium transition-colors text-left cursor-pointer",
                  isSelected
                    ? "bg-[hsl(226,64%,20%)]/10 text-[hsl(226,64%,20%)] font-bold"
                    : "text-[hsl(220,14%,30%)] hover:bg-[hsl(36,33%,96%)]"
                )}
              >
                <div className="flex flex-col">
                  <span className="text-xs leading-tight font-semibold text-[hsl(226,50%,15%)]">{lang.nativeName}</span>
                  <span className="text-[10px] text-[hsl(220,14%,50%)]">{lang.name}</span>
                </div>
                {isSelected && <Check className="h-4 w-4 text-[hsl(226,64%,20%)] flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

