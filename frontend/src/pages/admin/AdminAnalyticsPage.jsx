import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, AreaChart, Area } from "recharts";
import AdminLayout from "@/components/layout/AdminLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError } from "@/components/common/PageStates";

const COLORS = ["hsl(252,50%,55%)", "hsl(158,50%,40%)", "hsl(44,70%,45%)", "hsl(210,70%,45%)", "hsl(22,70%,50%)", "hsl(280,50%,50%)"];

const cardCls = "bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-5";

export default function AdminAnalyticsPage() {
  const { data, loading, error, refetch } = useApiData("/admin/analytics");

  if (loading) return <AdminLayout><PageLoader message="Loading analytics..." /></AdminLayout>;
  if (error) return <AdminLayout><PageError error={error} onRetry={refetch} /></AdminLayout>;

  const d = data || {};

  const streamData = (d.streamRanking || []).map(s => ({ name: s.name, score: s.total }));
  const districtData = (d.districtDistribution || []).map(dist => ({ name: dist.district || "Unassigned", count: dist.count }));

  const summaryPie = [
    { name: "Assessments Done", value: d.assessmentCompletions || 0 },
    { name: "Assessments Pending", value: Math.max(0, (d.totalStudents || 0) - (d.assessmentCompletions || 0)) },
  ];

  return (
    <AdminLayout>
      <div className="p-6 bg-[hsl(36,33%,97%)] min-h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">Analytics & Insights</h1>
          <p className="text-[hsl(220,14%,45%)] text-sm">Real-time Higher Education Department statistics and student data</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={cardCls}>
            <div className="text-xs text-[hsl(220,14%,50%)]">Total Students</div>
            <div className="text-2xl font-black text-[hsl(226,64%,14%)] mt-1">{d.totalStudents || 0}</div>
          </div>
          <div className={cardCls}>
            <div className="text-xs text-[hsl(220,14%,50%)]">Assessment Rate</div>
            <div className="text-2xl font-black text-[hsl(158,50%,35%)] mt-1">{d.assessmentRate || 0}%</div>
          </div>
          <div className={cardCls}>
            <div className="text-xs text-[hsl(220,14%,50%)]">Colleges Listed</div>
            <div className="text-2xl font-black text-[hsl(226,64%,14%)] mt-1">{d.totalColleges || 0}</div>
          </div>
          <div className={cardCls}>
            <div className="text-xs text-[hsl(220,14%,50%)]">Courses Listed</div>
            <div className="text-2xl font-black text-[hsl(252,50%,45%)] mt-1">{d.totalCourses || 0}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Stream Interest */}
          <div className={cardCls}>
            <h3 className="font-bold text-[hsl(226,64%,14%)] mb-1">Student Interest by Stream</h3>
            <p className="text-xs text-[hsl(220,14%,55%)] mb-4">Cumulative assessment aptitude score</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={streamData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" fill="hsl(252,50%,55%)" radius={[6, 6, 0, 0]}>
                  {streamData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Assessment Completion */}
          <div className={cardCls}>
            <h3 className="font-bold text-[hsl(226,64%,14%)] mb-1">Assessment Completion Rate</h3>
            <p className="text-xs text-[hsl(220,14%,55%)] mb-4">Completed vs. Pending assessments</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={summaryPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {summaryPie.map((_, index) => (
                    <Cell key={`pie-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* District Breakdown */}
          {districtData.length > 0 && (
            <div className={`${cardCls} lg:col-span-2`}>
              <h3 className="font-bold text-[hsl(226,64%,14%)] mb-1">Students by District</h3>
              <p className="text-xs text-[hsl(220,14%,55%)] mb-4">Distribution across J&K districts</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={districtData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(210,70%,45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
