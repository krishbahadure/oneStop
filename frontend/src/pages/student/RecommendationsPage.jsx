import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import StudentLayout from "@/components/layout/StudentLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError } from "@/components/common/PageStates";
import { BookOpen, Briefcase, Star, TrendingUp, ArrowRight, BarChart2 } from "lucide-react";

const fadeUp = (d = 0) => ({ initial:{opacity:0,y:16}, animate:{opacity:1,y:0}, transition:{duration:0.35,delay:d} });

const streamColors = {
  Science: "chip-lavender", Commerce: "chip-mint", Arts: "chip-yellow",
  Medical: "chip-peach", Vocational: "chip-orange",
};

const recConfig = [
  { matchChip:"chip-lavender", progressClass:"progress-lavender" },
  { matchChip:"chip-mint",     progressClass:"progress-mint" },
  { matchChip:"chip-yellow",   progressClass:"progress-yellow" },
];

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useApiData("/recommendations");

  if (loading) return <StudentLayout><PageLoader message={t("rec_loading")} /></StudentLayout>;
  if (error) return <StudentLayout><PageError error={error} onRetry={refetch} /></StudentLayout>;

  const { streams = [], courses = [], careers = [] } = data || {};
  const topStreams = streams.slice(0, 3);
  const topCourses = courses.slice(0, 6);
  const topCareers = careers.slice(0, 4);

  return (
    <StudentLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5">
          <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">{t("rec_title")}</h1>
          <p className="text-sm text-[hsl(220,14%,50%)] mt-0.5">{t("rec_subtitle")}</p>
        </div>

        <div className="px-8 py-6 max-w-[1200px] space-y-8">
          {/* Streams */}
          <motion.div {...fadeUp(0.05)}>
            <h2 className="font-bold text-[hsl(226,64%,14%)] mb-4 flex items-center gap-2">
              <BarChart2 className="h-4.5 w-4.5 text-[hsl(252,50%,45%)]" /> {t("rec_streams")}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {topStreams.map((stream, i) => {
                const chipClass = streamColors[stream.streamName] || "chip-blue";
                return (
                  <div key={stream.streamId} className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${chipClass}`}>{stream.streamName}</div>
                      {i === 0 && <span className="text-[10px] font-bold chip-lavender px-2 py-0.5 rounded-full">{t("rec_best_match")}</span>}
                    </div>
                    <p className="text-xs text-[hsl(220,14%,50%)] mb-3 leading-relaxed">{stream.description}</p>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[hsl(220,14%,55%)]">{t("rec_match_score")}</span>
                        <span className="font-bold text-[hsl(226,64%,20%)]">{stream.matchPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[hsl(220,18%,93%)] overflow-hidden">
                        <div className="h-full rounded-full bg-[hsl(252,50%,55%)]" style={{width:`${stream.matchPercent}%`}} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      {stream.matchReasons.map((r, ri) => (
                        <div key={ri} className="flex items-start gap-1.5 text-[10px] text-[hsl(220,14%,45%)]">
                          <span className="text-[hsl(158,50%,40%)] font-bold mt-0.5">✓</span> {r}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {stream.careers?.slice(0, 3).map(c => (
                        <span key={c} className="text-[10px] px-2 py-0.5 bg-[hsl(220,18%,95%)] text-[hsl(220,14%,40%)] rounded-md">{c}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Courses */}
          <motion.div {...fadeUp(0.1)}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[hsl(226,64%,14%)] flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-[hsl(252,50%,45%)]" /> {t("rec_courses")}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/courses")} className="text-[hsl(252,50%,45%)] text-xs gap-1 pr-0">
                {t("rec_view_all")} <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {topCourses.map((course, i) => {
                const cfg = recConfig[i % recConfig.length];
                return (
                  <div key={course.id} className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/courses/${course.id}`)}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.matchChip}`}>{course.stream_name}</span>
                      {course.isRecommended && <span className="text-[9px] font-bold chip-mint px-2 py-0.5 rounded-full">{t("rec_recommended")}</span>}
                    </div>
                    <h3 className="font-bold text-sm text-[hsl(226,64%,14%)] leading-tight mb-1">{course.name}</h3>
                    <p className="text-xs text-[hsl(220,14%,50%)] mb-2">{course.duration} · {course.degree_type}</p>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[hsl(220,14%,55%)]">{t("rec_match")}</span>
                      <span className="font-bold text-[hsl(226,64%,20%)]">{course.matchPercent}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[hsl(220,18%,93%)] overflow-hidden">
                      <div className={`h-full rounded-full ${cfg.progressClass}`} style={{width:`${course.matchPercent}%`}} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Careers */}
          <motion.div {...fadeUp(0.15)}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[hsl(226,64%,14%)] flex items-center gap-2">
                <Briefcase className="h-4.5 w-4.5 text-[hsl(252,50%,45%)]" /> {t("rec_careers")}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/careers")} className="text-[hsl(252,50%,45%)] text-xs gap-1 pr-0">
                {t("rec_explore_all")} <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {topCareers.map((career) => (
                <div key={career.id} className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/careers/${career.id}`)}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-[hsl(226,64%,14%)]">{career.title}</h3>
                      <p className="text-xs text-[hsl(220,14%,50%)]">{career.stream_name} · {career.sector}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${career.matchPercent >= 70 ? 'chip-mint' : 'chip-yellow'}`}>{career.matchPercent}%</span>
                  </div>
                  <p className="text-xs text-[hsl(220,14%,50%)] line-clamp-2 mb-3">{career.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[hsl(158,50%,35%)]">
                      ₹{((career.salary_min || 0) / 100000).toFixed(1)}–{((career.salary_max || 0) / 100000).toFixed(1)} LPA
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${career.growth_outlook === 'High' ? 'chip-mint' : 'chip-yellow'}`}>
                      {career.growth_outlook} {t("rec_growth")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </StudentLayout>
  );
}
