import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import StudentLayout from "@/components/layout/StudentLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError, PageEmpty } from "@/components/common/PageStates";
import { Calendar, Search, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TimelinePage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const { t } = useTranslation();
  const { data: events, loading, error, refetch } = useApiData("/timeline");

  if (loading) return <StudentLayout><PageLoader message={t("timeline_loading")} /></StudentLayout>;
  if (error) return <StudentLayout><PageError error={error} onRetry={refetch} /></StudentLayout>;

  const filtered = (events || []).filter(e => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || e.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const categories = [...new Set((events || []).map(e => e.category).filter(Boolean))];

  const groups = {
    due_soon: filtered.filter(e => e.computedStatus === 'due_soon'),
    upcoming: filtered.filter(e => e.computedStatus === 'upcoming'),
    completed: filtered.filter(e => e.computedStatus === 'completed'),
  };

  const statusStyles = {
    completed: "chip-peach opacity-70",
    due_soon: "chip-orange",
    upcoming: "chip-blue",
  };
  
  const statusLabel = {
    completed: t("timeline_status_completed"),
    due_soon: t("timeline_status_due_soon"),
    upcoming: t("timeline_status_upcoming"),
  };

  function EventCard({ event }) {
    const parts = (event.displayDate || "").split(" ");
    return (
      <div className={cn("bg-white border border-[hsl(220,18%,91%)] rounded-xl p-4 flex gap-4", event.computedStatus === 'completed' && 'opacity-60')}>
        <div className={`flex flex-col items-center justify-center rounded-xl w-12 h-12 flex-shrink-0 ${statusStyles[event.computedStatus] || 'chip-blue'}`}>
          <span className="text-[8px] font-bold uppercase leading-none">{parts[1] || ""}</span>
          <span className="text-lg font-black leading-none">{parts[0] || ""}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="font-bold text-sm text-[hsl(226,64%,14%)]">{event.title}</h3>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusStyles[event.computedStatus] || 'chip-blue'}`}>
              {statusLabel[event.computedStatus] || event.computedStatus}
            </span>
          </div>
          <p className="text-xs text-[hsl(220,14%,50%)] mt-0.5 leading-relaxed">{event.description}</p>
          {event.daysLeft >= 0 && event.daysLeft <= 14 && (
            <p className="text-xs font-semibold text-[hsl(22,80%,40%)] mt-1">{event.daysLeft} {t("timeline_days_remaining")}</p>
          )}
          {event.category && (
            <span className="mt-1 inline-block text-[10px] bg-[hsl(220,18%,95%)] text-[hsl(220,14%,40%)] px-2 py-0.5 rounded-md">{t(`timeline_cat_${event.category}`, event.category)}</span>
          )}

        </div>
      </div>
    );
  }

  return (
    <StudentLayout requireAuth={false}>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5">
          <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">{t("timeline_title")}</h1>
          <p className="text-sm text-[hsl(220,14%,50%)] mt-0.5">{t("timeline_subtitle")}</p>
        </div>

        <div className="px-8 py-6 max-w-[900px] space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,14%,55%)]" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("timeline_search")}
                className="w-full pl-9 pr-4 h-10 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none focus:border-[hsl(252,50%,60%)]" />
            </div>
            <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}
              className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none">
              <option value="">{t("timeline_all_cat")}</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? <PageEmpty message={t("timeline_no_match")} icon={Calendar} /> : (
            <>
              {groups.due_soon.length > 0 && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                  <h2 className="font-bold text-sm text-[hsl(22,80%,40%)] mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> {t("timeline_status_due_soon")}
                  </h2>
                  <div className="space-y-3">
                    {groups.due_soon.map(e => <EventCard key={e.id} event={e} />)}
                  </div>
                </motion.div>
              )}
              {groups.upcoming.length > 0 && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                  <h2 className="font-bold text-sm text-[hsl(226,64%,14%)] mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> {t("timeline_status_upcoming")}
                  </h2>
                  <div className="space-y-3">
                    {groups.upcoming.map(e => <EventCard key={e.id} event={e} />)}
                  </div>
                </motion.div>
              )}
              {groups.completed.length > 0 && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                  <h2 className="font-bold text-sm text-[hsl(220,14%,55%)] mb-3">{t("timeline_status_completed")}</h2>
                  <div className="space-y-3">
                    {groups.completed.map(e => <EventCard key={e.id} event={e} />)}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
