import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import StudentLayout from "@/components/layout/StudentLayout";
import { useAuth } from "@/hooks/useAuth";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError } from "@/components/common/PageStates";
import {
  ArrowRight, BookOpen, Briefcase, Building2, Calendar,
  Award, Library, ClipboardList, AlertCircle, Star,
  BookMarked, MapPin, Brain, Map,
} from "lucide-react";


const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
});

const recConfig = [
  { matchChip: "chip-lavender", progressClass: "progress-lavender" },
  { matchChip: "chip-mint",     progressClass: "progress-mint"     },
  { matchChip: "chip-yellow",   progressClass: "progress-yellow"   },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useApiData("/progress");

  const features = [
    { icon: Brain,      title: t("landing_feature1_title"),  desc: t("landing_feature1_desc"),       chip: "chip-lavender" },
    { icon: Star,       title: t("landing_feature2_title"),    desc: t("landing_feature2_desc"),                 chip: "chip-mint" },
    { icon: Map,        title: t("landing_feature3_title"),         desc: t("landing_feature3_desc"),                  chip: "chip-blue" },
    { icon: Building2,  title: t("landing_feature4_title"),       desc: t("landing_feature4_desc"),         chip: "chip-yellow" },
    { icon: Award,      title: t("landing_feature6_title"),                    desc: t("landing_feature6_desc"),            chip: "chip-peach" },
    { icon: Calendar,   title: t("landing_feature7_title"),              desc: t("landing_feature7_desc"),        chip: "chip-orange" },
    { icon: BookMarked, title: t("landing_feature8_title"),              desc: t("landing_feature8_desc"), chip: "chip-lavender" },
  ];


  if (loading) return <StudentLayout><PageLoader message={t("dash_loading")} /></StudentLayout>;
  if (error) return <StudentLayout><PageError error={error} onRetry={refetch} /></StudentLayout>;

  const {
    progress = {},
    assessmentCompleted,
    recommendations,
    nearbyColleges = [],
    upcomingEvents = [],
    scholarshipsTotal = 0,
  } = data || {};

  const topCourses = recommendations?.topCourses?.slice(0, 3) || [];

  const statCards = [
    { label: t("dash_assessment_score"), value: assessmentCompleted ? t("dash_done") : t("dash_pending"), sub: assessmentCompleted ? t("dash_completed") : t("dash_take_now"), icon: ClipboardList, chip: "chip-lavender" },
    { label: t("dash_recommended_courses"), value: topCourses.length || "–", sub: t("dash_best_matches"), icon: BookOpen, chip: "chip-mint" },
    { label: t("dash_colleges_shortlisted"), value: progress.colleges_shortlisted || 0, sub: t("dash_colleges_sub"), icon: Building2, chip: "chip-yellow" },
    { label: t("dash_scholarships_available"), value: `${scholarshipsTotal}+`, sub: t("dash_check_eligibility"), icon: Award, chip: "chip-blue" },
  ];

  return (
    <StudentLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        {/* TOP BAR */}
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">
                {t("dash_welcome")}, {user?.name?.split(" ")[0] || "Student"} 👋
              </h1>
              <p className="text-sm text-[hsl(220,14%,50%)] mt-0.5">{t("dash_overview")}</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 max-w-[1200px]">
          {/* Assessment prompt */}
          {!assessmentCompleted && (
            <motion.div {...fadeUp(0)} className="mb-5 bg-[hsl(44,90%,96%)] border border-[hsl(44,70%,84%)] rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-[hsl(44,70%,38%)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[hsl(44,50%,25%)]">{t("dash_complete_assessment_title")}</p>
                <p className="text-xs text-[hsl(44,40%,40%)] mt-0.5">{t("dash_complete_assessment_desc")}</p>
              </div>
              <Button size="sm" onClick={() => navigate("/assessment")} className="bg-[hsl(44,70%,38%)] hover:bg-[hsl(44,70%,30%)] text-white text-xs flex-shrink-0">
                {t("dash_take_now")}
              </Button>
            </motion.div>
          )}

          {/* STAT CARDS */}
          <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            {statCards.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.chip}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-xs text-[hsl(220,14%,50%)] mb-1">{s.label}</div>
                  <div className="text-2xl font-black text-[hsl(226,64%,14%)]">{s.value}</div>
                  <div className="text-xs text-[hsl(220,14%,55%)]">{s.sub}</div>
                </div>
              );
            })}
          </motion.div>

          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recommended Courses */}
              {topCourses.length > 0 && (
                <motion.div {...fadeUp(0.1)}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-[hsl(226,64%,14%)]">{t("dash_recommended_for_you")}</h2>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/recommendations")} className="text-[hsl(252,50%,45%)] hover:text-[hsl(252,50%,35%)] text-xs font-semibold gap-1 pr-0">
                      {t("dash_view_all")} <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {topCourses.map((course, i) => {
                      const cfg = recConfig[i] || recConfig[0];
                      return (
                        <div key={course.id} className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-4 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.matchChip}`}>
                              <BookOpen className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] font-semibold text-[hsl(220,14%,55%)]">{t("dash_best_match")}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[hsl(226,64%,14%)] leading-tight">{course.name}</div>
                            <div className="text-xs text-[hsl(220,14%,50%)] mt-0.5">{t("dash_match_score")}</div>
                            <div className="text-xl font-black text-[hsl(226,64%,20%)] mt-0.5">{course.matchPercent || 0}%</div>
                          </div>
                          <div className="h-1.5 rounded-full bg-[hsl(220,18%,94%)] overflow-hidden">
                            <div className={`h-full rounded-full ${cfg.progressClass}`} style={{ width: `${course.matchPercent || 0}%` }} />
                          </div>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/courses/${course.id}`)} className="w-full text-xs border-[hsl(220,18%,88%)] text-[hsl(226,64%,20%)] hover:bg-[hsl(36,25%,96%)] font-semibold">
                           {t("explore")}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Features Section */}
              <motion.div {...fadeUp(0.15)}>
                <h2 className="font-bold text-[hsl(226,64%,14%)] mb-4">{t("dash_features_heading")}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.title} className="bg-white border border-[hsl(220,18%,91%)] rounded-xl p-4 flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${f.chip}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-[hsl(226,64%,14%)] leading-tight">{f.title}</div>
                          <div className="text-xs text-[hsl(220,14%,50%)] mt-1 leading-relaxed">{f.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right 1/3 */}
            <div className="space-y-5">
              {/* Nearby Colleges */}
              <motion.div {...fadeUp(0.12)}>
                <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-[hsl(226,64%,14%)]">{t("dash_nearby_colleges")}</h3>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/colleges")} className="text-[hsl(252,50%,45%)] text-xs p-0 h-auto font-semibold gap-1">
                      {t("dash_view_all")} <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {nearbyColleges.slice(0, 3).map((college) => (
                      <div key={college.id} onClick={() => navigate(`/colleges/${college.id}`)} className="cursor-pointer group">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[hsl(226,64%,14%)] leading-tight group-hover:text-[hsl(252,50%,45%)] transition-colors">{college.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPin className="h-2.5 w-2.5 text-[hsl(220,14%,55%)]" />
                              <p className="text-[10px] text-[hsl(220,14%,55%)]">{college.district}</p>
                            </div>
                          </div>
                          {college.admission_status === "Applications Open" && (
                            <span className="text-[9px] font-semibold bg-[hsl(158,50%,91%)] text-[hsl(158,50%,35%)] px-2 py-0.5 rounded-full flex-shrink-0">{t("dash_open")}</span>
                          )}
                        </div>
                        <div className="mt-2 border-b border-[hsl(220,18%,94%)]" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Upcoming Deadlines */}
              {upcomingEvents.length > 0 && (
                <motion.div {...fadeUp(0.16)}>
                  <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-sm text-[hsl(226,64%,14%)]">{t("dash_upcoming_deadlines")}</h3>
                      <Button variant="ghost" size="sm" onClick={() => navigate("/timeline")} className="text-[hsl(252,50%,45%)] text-xs p-0 h-auto font-semibold gap-1">
                        {t("dash_view_all")} <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {upcomingEvents.slice(0, 3).map((event, i) => {
                        const colors = ["chip-blue", "chip-yellow", "chip-mint"];
                        const cc = colors[i % colors.length];
                        const parts = (event.displayDate || "").split(" ");
                        return (
                          <div key={event.id} className="flex items-start gap-3">
                            <div className={`flex flex-col items-center justify-center rounded-xl w-10 h-10 flex-shrink-0 ${cc}`}>
                              <span className="text-[8px] font-bold uppercase leading-none">{parts[1] || ""}</span>
                              <span className="text-sm font-black leading-none">{parts[0] || ""}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[hsl(226,64%,14%)] leading-tight">{event.title}</p>
                              <p className="text-[10px] text-[hsl(220,14%,50%)] mt-0.5">{event.description?.slice(0, 50)}</p>
                              {event.daysLeft >= 0 && event.daysLeft <= 14 && (
                                <p className="text-[10px] font-semibold text-[hsl(22,80%,45%)] mt-0.5">{event.daysLeft} {t("dash_days_left")}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Links */}
              <motion.div {...fadeUp(0.2)}>
                <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-5">
                  <h3 className="font-bold text-sm text-[hsl(226,64%,14%)] mb-3">{t("dash_quick_links")}</h3>
                  <div className="space-y-2">
                    {[
                      { label: t("roadmap", "My Roadmap"), path: "/roadmap", chip: "chip-lavender" },
                      { label: t("scholarships", "Scholarships"), path: "/scholarships", chip: "chip-mint" },
                      { label: t("resources", "Resources"), path: "/resources", chip: "chip-yellow" },
                    ].map(link => (
                      <button key={link.path} onClick={() => navigate(link.path)}
                        className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[hsl(220,18%,96%)] transition-colors group">
                        <span className="text-xs font-medium text-[hsl(226,64%,14%)]">{link.label}</span>
                        <ArrowRight className="h-3 w-3 text-[hsl(220,14%,55%)] group-hover:text-[hsl(252,50%,45%)] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
