import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import StudentLayout from "@/components/layout/StudentLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError, PageEmpty, VerifiedBadge } from "@/components/common/PageStates";
import { BookOpen, Search, Filter, Clock, GraduationCap } from "lucide-react";

const streamColors = { Science:"chip-lavender", Commerce:"chip-mint", Arts:"chip-yellow", Medical:"chip-peach", Vocational:"chip-orange" };

export default function CoursesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [streamFilter, setStreamFilter] = useState("");
  const [degFilter, setDegFilter] = useState("");
  const { data: courses, loading, error, refetch } = useApiData("/courses");

  if (loading) return <StudentLayout requireAuth={false}><PageLoader message={t("courses_loading")} /></StudentLayout>;
  if (error) return <StudentLayout requireAuth={false}><PageError error={error} onRetry={refetch} /></StudentLayout>;

  const filtered = (courses || []).filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.description || "").toLowerCase().includes(search.toLowerCase());
    const matchStream = !streamFilter || c.stream_name === streamFilter;
    const matchDeg = !degFilter || c.degree_type === degFilter;
    return matchSearch && matchStream && matchDeg;
  });

  const streams = [...new Set((courses || []).map(c => c.stream_name).filter(Boolean))];
  const degTypes = [...new Set((courses || []).map(c => c.degree_type).filter(Boolean))];

  return (
    <StudentLayout requireAuth={false}>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5">
          <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">{t("courses_title")}</h1>
          <p className="text-sm text-[hsl(220,14%,50%)] mt-0.5">{t("courses_subtitle")}</p>
        </div>

        <div className="px-8 py-6 max-w-[1200px]">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,14%,55%)]" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("courses_search")}
                className="w-full pl-9 pr-4 h-10 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none focus:border-[hsl(252,50%,60%)]" />
            </div>
            <select value={streamFilter} onChange={e=>setStreamFilter(e.target.value)}
              className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none">
              <option value="">{t("courses_all_streams")}</option>
              {streams.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={degFilter} onChange={e=>setDegFilter(e.target.value)}
              className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none">
              <option value="">{t("courses_all_degrees")}</option>
              {degTypes.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <PageEmpty message={t("courses_no_match")} icon={BookOpen} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(course => (
                <motion.div key={course.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${streamColors[course.stream_name] || 'chip-blue'}`}>
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <VerifiedBadge isVerified={course.is_verified} lastUpdated={course.last_updated} />
                  </div>
                  <h3 className="font-bold text-sm text-[hsl(226,64%,14%)] leading-tight mb-1">{course.name}</h3>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${streamColors[course.stream_name] || 'chip-blue'}`}>{course.stream_name}</span>
                    <span className="text-[10px] text-[hsl(220,14%,50%)] flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{course.duration}</span>
                    <span className="text-[10px] text-[hsl(220,14%,50%)] flex items-center gap-0.5"><GraduationCap className="h-2.5 w-2.5" />{course.degree_type}</span>
                  </div>
                  <p className="text-xs text-[hsl(220,14%,50%)] line-clamp-2 mb-3">{course.description}</p>
                  <div className="text-xs font-semibold text-[hsl(226,64%,20%)]">{course.avg_fees}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
