import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import StudentLayout from "@/components/layout/StudentLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError } from "@/components/common/PageStates";
import { Map, CheckCircle, Circle, Loader2, ArrowRight } from "lucide-react";
import api from "@/api/client";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const catColors = {
  Profile:     "bg-[hsl(252,60%,94%)] text-[hsl(252,50%,40%)]",
  Assessment:  "bg-[hsl(158,50%,91%)] text-[hsl(158,50%,30%)]",
  Course:      "bg-[hsl(44,90%,92%)] text-[hsl(44,70%,30%)]",
  Career:      "bg-[hsl(22,80%,92%)] text-[hsl(22,60%,35%)]",
  College:     "bg-[hsl(220,60%,94%)] text-[hsl(220,50%,35%)]",
  Scholarship: "bg-[hsl(280,50%,93%)] text-[hsl(280,40%,40%)]",
};

export default function RoadmapPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useApiData("/roadmap");
  const [updating, setUpdating] = useState(null);

  const statusStyles = {
    completed:   { icon: CheckCircle, chip: "chip-mint", label: t("roadmap_status_completed") },
    in_progress: { icon: Loader2,     chip: "chip-yellow", label: t("roadmap_status_in_progress") },
    pending:     { icon: Circle,      chip: "chip-blue",  label: t("roadmap_status_pending") },
  };

  if (loading) return <StudentLayout><PageLoader message={t("roadmap_loading")} /></StudentLayout>;
  if (error) return <StudentLayout><PageError error={error} onRetry={refetch} /></StudentLayout>;

  const { items = [], progressPct = 0, completed = 0, total = 0 } = data || {};

  const updateStatus = async (id, status) => {
    setUpdating(id);
    const { error: err } = await api.put(`/roadmap/${id}`, { status });
    setUpdating(null);
    if (err) { toast.error(err); return; }
    toast.success(t("roadmap_step_updated"));
    refetch();
  };

  return (
    <StudentLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[hsl(226,64%,14%)] flex items-center gap-2">
                <Map className="h-5 w-5 text-[hsl(252,50%,45%)]" /> {t("roadmap_title")}
              </h1>
              <p className="text-sm text-[hsl(220,14%,50%)] mt-0.5">{t("roadmap_subtitle")}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-[hsl(226,64%,14%)]">{progressPct}%</div>
              <div className="text-xs text-[hsl(220,14%,50%)]">{completed}/{total} {t("roadmap_steps_complete")}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full h-2.5 rounded-full bg-[hsl(220,18%,93%)] overflow-hidden">
            <motion.div className="h-full rounded-full bg-[hsl(252,50%,55%)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6 }} />
          </div>
        </div>

        <div className="px-8 py-8 max-w-[800px]">
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[hsl(220,18%,91%)]" />

            <div className="space-y-4">
              {items.map((item, i) => {
                const style = statusStyles[item.status] || statusStyles.pending;
                const Icon = style.icon;
                const catColor = catColors[item.category] || catColors.Profile;
                const isUpdating = updating === item.id;

                return (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn("relative bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-5 ml-12 transition-all",
                      item.status === 'completed' ? 'opacity-70' : '')}>
                    {/* Circle on timeline */}
                    <div className={cn("absolute -left-[2.75rem] top-5 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center", style.chip)}>
                      {isUpdating
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Icon className={cn("h-3.5 w-3.5", item.status === 'in_progress' && 'animate-spin')} />}
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-black text-[hsl(220,14%,55%)]">{t("roadmap_step")} {item.step_number}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${catColor}`}>{t(item.category)}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${style.chip}`}>{style.label}</span>
                        </div>
                        <h3 className="font-bold text-sm text-[hsl(226,64%,14%)] leading-tight">{item.title}</h3>
                        <p className="text-xs text-[hsl(220,14%,50%)] mt-1 leading-relaxed">{item.description}</p>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        {item.link && (
                          <Button size="sm" variant="outline"
                            onClick={() => navigate(item.link)}
                            className="text-xs gap-1 border-[hsl(220,18%,88%)] text-[hsl(226,64%,20%)] h-8">
                            {t("roadmap_go")} <ArrowRight className="h-3 w-3" />
                          </Button>
                        )}
                        {item.status !== 'completed' && (
                          <Button size="sm"
                            onClick={() => updateStatus(item.id, item.status === 'in_progress' ? 'completed' : 'in_progress')}
                            disabled={isUpdating}
                            className="text-xs bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white h-8">
                            {item.status === 'in_progress' ? t("roadmap_mark_done") : t("roadmap_start")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-[hsl(220,14%,50%)]">
              {t("roadmap_footer_text")}
            </p>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
