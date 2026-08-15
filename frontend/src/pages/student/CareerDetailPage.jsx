import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StudentLayout from "@/components/layout/StudentLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { getCareerById } from "@/data/mock/careers";
import { courses } from "@/data/mock/courses";
import { ArrowRight, ArrowLeft, Briefcase, CheckCircle, Building2, TrendingUp } from "lucide-react";

export default function CareerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const career = getCareerById(id);

  if (!career) {
    return (
      <StudentLayout>
        <EmptyState icon={Briefcase} title="Career not found" action={<Button onClick={() => navigate("/careers")}>Back to Careers</Button>} className="min-h-screen" />
      </StudentLayout>
    );
  }

  const relatedCourseData = career.relevantCourses.map((id) => courses.find((c) => c.id === id)).filter(Boolean);

  return (
    <StudentLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)] pb-10">
        {/* Header */}
        <div className="bg-gradient-to-br from-teal-900 to-blue-800 text-white px-6 py-10">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" size="sm" onClick={() => navigate("/careers")} className="text-white/70 hover:text-white hover:bg-white/10 mb-4 -ml-2">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Careers
            </Button>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-teal-200 text-xs font-medium uppercase tracking-wide">{career.category}</span>
                <h1 className="text-3xl font-black mt-1 mb-2">{career.name}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={`text-xs ${career.demand === "Very High" ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/30" : "bg-[hsl(252,60%,96%)]0/20 text-[hsl(220,14%,50%)]"}`}>
                    {career.demand} Demand
                  </Badge>
                  <span className="text-teal-200 text-sm">💰 {career.salary}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Overview */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6">
            <h2 className="text-lg font-bold mb-3">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">{career.overview}</p>
            <div className="mt-4 pt-4 border-t border-[hsl(220,18%,91%)]">
              <h3 className="text-sm font-semibold mb-2">Career Progression</h3>
              <p className="text-sm text-muted-foreground">{career.careerPath}</p>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6">
            <h2 className="text-lg font-bold mb-4">Key Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {career.skills.map((s) => (
                <span key={s} className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm border border-teal-100 font-medium">{s}</span>
              ))}
            </div>
          </motion.div>

          {/* Relevant Courses */}
          {relatedCourseData.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6">
              <h2 className="text-lg font-bold mb-4">Relevant Courses to Study</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {relatedCourseData.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/courses/${c.id}`)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[hsl(220,18%,91%)] hover:border-[hsl(252,50%,75%)] cursor-pointer hover:bg-[hsl(252,60%,96%)]/30 transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[hsl(252,60%,96%)] flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">📚</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.duration} · {c.stream}</div>
                    </div>
                    <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Pathway Visual */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-teal-600" /> Opportunities</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Government */}
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-100">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold text-sm text-teal-900">Government Opportunities</span>
                </div>
                <ul className="space-y-1">
                  {career.governmentOpportunities.map((j) => (
                    <li key={j} className="text-xs text-teal-800 flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-teal-400" />{j}</li>
                  ))}
                </ul>
              </div>
              {/* Private */}
              <div className="p-4 rounded-xl bg-[hsl(252,60%,96%)] border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="h-4 w-4 text-[hsl(252,50%,45%)]" />
                  <span className="font-semibold text-sm text-blue-900">Private Sector</span>
                </div>
                <ul className="space-y-1">
                  {career.privateJobs.map((j) => (
                    <li key={j} className="text-xs text-blue-800 flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-blue-400" />{j}</li>
                  ))}
                </ul>
              </div>
              {/* Higher Studies */}
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🎓</span>
                  <span className="font-semibold text-sm text-purple-900">Higher Studies</span>
                </div>
                <ul className="space-y-1">
                  {career.higherStudies.map((j) => (
                    <li key={j} className="text-xs text-purple-800 flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-purple-400" />{j}</li>
                  ))}
                </ul>
              </div>
              {/* Entrepreneurship */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🚀</span>
                  <span className="font-semibold text-sm text-amber-900">Entrepreneurship</span>
                </div>
                <ul className="space-y-1">
                  {career.entrepreneurship.map((j) => (
                    <li key={j} className="text-xs text-[hsl(44,50%,28%)] flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-amber-400" />{j}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </StudentLayout>
  );
}



