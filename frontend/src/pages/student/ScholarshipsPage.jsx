import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import StudentLayout from "@/components/layout/StudentLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError, PageEmpty } from "@/components/common/PageStates";
import { Search, Award, ExternalLink, CheckCircle, HelpCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScholarshipsPage() {
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const { data: scholarships, loading, error, refetch } = useApiData("/scholarships");

  if (loading) return <StudentLayout><PageLoader message={t("scholarships_loading")} /></StudentLayout>;
  if (error) return <StudentLayout><PageError error={error} onRetry={refetch} /></StudentLayout>;

  const filtered = (scholarships || []).filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.provider || "").toLowerCase().includes(search.toLowerCase())
  );

  const eligStyle = {
    Eligible: "chip-mint",
    "Possibly Eligible": "chip-yellow",
    "Check Criteria": "chip-peach",
  };
  
  const eligIcon = {
    Eligible: CheckCircle,
    "Possibly Eligible": HelpCircle,
    "Check Criteria": AlertCircle,
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Eligible": return t("scholarships_eligible");
      case "Possibly Eligible": return t("scholarships_possibly_eligible");
      case "Check Criteria": return t("scholarships_check_criteria");
      default: return status;
    }
  };

  return (
    <StudentLayout requireAuth={false}>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5">
          <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">{t("scholarships_title")}</h1>
          <p className="text-sm text-[hsl(220,14%,50%)] mt-0.5">{t("scholarships_subtitle")}</p>
        </div>

        <div className="px-8 py-6 max-w-[1200px]">
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,14%,55%)]" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("scholarships_search")}
              className="w-full pl-9 pr-4 h-10 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none focus:border-[hsl(252,50%,60%)]" />
          </div>

          {filtered.length === 0 ? <PageEmpty message={t("scholarships_no_match")} icon={Award} /> : (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map(s => {
                const status = s.eligibilityStatus || "Check Criteria";
                const Icon = eligIcon[status] || HelpCircle;
                return (
                  <motion.div key={s.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
                    className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-5 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 chip-yellow`}>
                        <Award className="h-4 w-4" />
                      </div>
                      <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1", eligStyle[status] || 'chip-peach')}>
                        <Icon className="h-3 w-3" /> {getStatusLabel(status)}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[hsl(226,64%,14%)] leading-tight mb-1">{s.name}</h3>
                    <p className="text-xs text-[hsl(220,14%,50%)] mb-1">{s.provider}</p>
                    <p className="text-xs text-[hsl(220,14%,50%)] line-clamp-2 mb-3 flex-1">{s.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-bold text-[hsl(226,64%,14%)]">{s.amount}</div>
                      {s.deadline && <div className="text-xs text-[hsl(220,14%,50%)]">{t("scholarships_deadline")} {s.deadline}</div>}
                    </div>
                    {s.application_url && (
                      <a href={s.application_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 h-9 border border-[hsl(220,18%,88%)] rounded-lg text-xs font-semibold text-[hsl(226,64%,20%)] hover:bg-[hsl(220,18%,96%)] transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" /> {t("scholarships_apply")}
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
