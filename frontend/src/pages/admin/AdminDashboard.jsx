import AdminLayout from "@/components/layout/AdminLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError } from "@/components/common/PageStates";
import { Users, BookOpen, Building2, Award, BarChart2, CheckCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { data, loading, error, refetch } = useApiData("/admin/analytics");
  const navigate = useNavigate();

  if (loading) return <AdminLayout><PageLoader message="Loading analytics…" /></AdminLayout>;
  if (error) return <AdminLayout><PageError error={error} onRetry={refetch} /></AdminLayout>;

  const d = data || {};

  const stats = [
    { label: "Total Students", value: d.totalStudents || 0, icon: Users, chip: "chip-lavender", path: "/admin/students" },
    { label: "Assessment Rate", value: `${d.assessmentRate || 0}%`, icon: BarChart2, chip: "chip-mint", sub: `${d.assessmentCompletions || 0} completions` },
    { label: "Profile Rate", value: `${d.profileRate || 0}%`, icon: CheckCircle, chip: "chip-yellow", sub: `${d.profileCompletions || 0} completions` },
    { label: "Total Colleges", value: d.totalColleges || 0, icon: Building2, chip: "chip-blue", path: "/admin/colleges" },
    { label: "Total Courses", value: d.totalCourses || 0, icon: BookOpen, chip: "chip-orange", path: "/admin/courses" },
    { label: "Total Scholarships", value: d.totalScholarships || 0, icon: Award, chip: "chip-peach", path: "/admin/scholarships" },
  ];

  return (
    <AdminLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5">
          <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">Admin Dashboard</h1>
          <p className="text-sm text-[hsl(220,14%,50%)] mt-0.5">One Stop J&K — content and student management</p>
        </div>

        <div className="px-8 py-6 max-w-[1200px]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {stats.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} onClick={s.path ? () => navigate(s.path) : undefined}
                  className={`bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-5 ${s.path ? 'cursor-pointer hover:shadow-md' : ''} transition-all`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.chip}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-xs text-[hsl(220,14%,50%)] mb-1">{s.label}</div>
                  <div className="text-3xl font-black text-[hsl(226,64%,14%)]">{s.value}</div>
                  {s.sub && <div className="text-xs text-[hsl(220,14%,55%)] mt-0.5">{s.sub}</div>}
                </div>
              );
            })}
          </div>

          {/* Top Streams by assessment interest */}
          {(d.streamRanking || []).length > 0 && (
            <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-6 mb-6">
              <h2 className="font-bold text-[hsl(226,64%,14%)] mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[hsl(252,50%,45%)]" /> Student Interest by Stream
              </h2>
              <div className="space-y-3">
                {d.streamRanking.map((s, i) => {
                  const max = d.streamRanking[0]?.total || 1;
                  const pct = Math.round((s.total / max) * 100);
                  const chips = ["chip-lavender","chip-mint","chip-yellow","chip-orange","chip-peach"];
                  return (
                    <div key={s.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-[hsl(226,64%,14%)]">{s.name}</span>
                        <span className="text-[hsl(220,14%,50%)]">Score: {s.total}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[hsl(220,18%,93%)] overflow-hidden">
                        <div className={`h-full rounded-full ${chips[i % chips.length]}`} style={{width:`${pct}%`,background:'hsl(252,50%,55%)'}} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label:"Manage Students", path:"/admin/students", chip:"chip-lavender" },
              { label:"Manage Colleges", path:"/admin/colleges", chip:"chip-blue" },
              { label:"Manage Courses", path:"/admin/courses", chip:"chip-orange" },
              { label:"Manage Careers", path:"/admin/careers", chip:"chip-mint" },
              { label:"Scholarships", path:"/admin/scholarships", chip:"chip-yellow" },
              { label:"Resources", path:"/admin/resources", chip:"chip-peach" },
              { label:"Timeline Events", path:"/admin/timeline", chip:"chip-orange" },
              { label:"Analytics", path:"/admin/analytics", chip:"chip-lavender" },
            ].map(l => (
              <button key={l.path} onClick={() => navigate(l.path)}
                className="bg-white border border-[hsl(220,18%,91%)] rounded-xl p-4 text-left hover:shadow-md transition-all group">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${l.chip} mb-2 inline-block`}>{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
