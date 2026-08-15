import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StudentLayout from "@/components/layout/StudentLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { getCourseById } from "@/data/mock/courses";
import { ArrowRight, BookOpen, ArrowLeft, CheckCircle, Briefcase, Building2, TrendingUp, Lightbulb } from "lucide-react";

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const course = getCourseById(id);

  if (!course) {
    return (
      <StudentLayout requireAuth={false}>
        <EmptyState icon={BookOpen} title={t("course_det_not_found")} description={t("course_det_not_found_desc")} action={<Button onClick={() => navigate("/courses")}>{t("course_det_back")}</Button>} className="min-h-screen" />
      </StudentLayout>
    );
  }

  return (
    <StudentLayout requireAuth={false}>
      <div className="min-h-full bg-[hsl(36,33%,97%)] pb-10">
        {/* Header */}
        <div className="bg-white px-6 py-10">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/courses")}
              className="text-[hsl(220,14%,50%)] hover:text-foreground mb-4 -ml-2"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> {t("course_det_back")}
            </Button>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[hsl(252,50%,95%)] flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-7 w-7 text-[hsl(252,50%,45%)]" />
              </div>
              <div>
                <h1 className="text-3xl font-black mb-2">{course.name}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[hsl(220,14%,50%)] text-sm">⏱ {course.duration}</span>
                  <span className="w-1 h-1 rounded-full bg-[hsl(220,18%,88%)]" />
                  <span className="text-[hsl(220,14%,50%)] text-sm">📚 {course.stream}</span>
                  <span className="w-1 h-1 rounded-full bg-[hsl(220,18%,88%)]" />
                  <span className="text-[hsl(220,14%,50%)] text-sm">🏛 {course.level}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {course.careerAreas.map((a) => (
                    <span key={a} className="text-xs px-2.5 py-1 bg-[hsl(220,18%,95%)] rounded-full border border-[hsl(220,18%,88%)]">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Overview */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6">
            <h2 className="text-lg font-bold mb-3">{t("course_det_overview")}</h2>
            <p className="text-muted-foreground leading-relaxed">{course.description}</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[hsl(220,18%,91%)]">
              <div>
                <span className="text-xs text-muted-foreground">{t("course_det_eligibility")}</span>
                <p className="text-sm font-medium mt-0.5">{course.eligibility}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">{t("course_det_fees")}</span>
                <p className="text-sm font-medium mt-0.5">{course.fees}</p>
              </div>
            </div>
          </motion.div>

          {/* What You'll Study */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[hsl(252,50%,45%)]" /> {t("course_det_study")}
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {course.subjects.map((s) => (
                <div key={s} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" /> {t("course_det_skills")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {course.skills.map((s) => (
                <span key={s} className="px-3 py-1.5 bg-[hsl(252,60%,96%)] text-[hsl(226,64%,20%)] rounded-full text-sm border border-blue-100 font-medium">{s}</span>
              ))}
            </div>
          </motion.div>

          {/* Career Pathway Visual */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-600" /> {t("course_det_career_pathway")}
            </h2>
            {/* Visual flow */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-8">
              {[course.shortName, t("course_det_core_skills"), t("course_det_career_options"), t("course_det_future_growth")].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className={`px-4 py-3 rounded-xl text-sm font-semibold text-center min-w-[110px] ${
                    i === 0 ? "bg-blue-600 text-white" :
                    i === 1 ? "bg-teal-100 text-teal-700 border border-teal-200" :
                    i === 2 ? "bg-purple-100 text-purple-700 border border-purple-200" :
                    "bg-amber-100 text-amber-700 border border-amber-200"
                  }`}>
                    {step}
                  </div>
                  {i < 3 && <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                </div>
              ))}
            </div>

            {/* Career Outcomes */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Private Jobs */}
              <div className="p-4 rounded-xl bg-[hsl(252,60%,96%)] border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="h-4 w-4 text-[hsl(252,50%,45%)]" />
                  <span className="font-semibold text-sm text-blue-900">{t("course_det_pvt_jobs")}</span>
                </div>
                <ul className="space-y-1">
                  {course.careerOutcomes.private.map((j) => (
                    <li key={j} className="text-xs text-blue-800 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-blue-400" />{j}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Government */}
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-100">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold text-sm text-teal-900">{t("course_det_gov_routes")}</span>
                </div>
                <ul className="space-y-1">
                  {course.careerOutcomes.government.map((j) => (
                    <li key={j} className="text-xs text-teal-800 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-teal-400" />{j}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Higher Studies */}
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🎓</span>
                  <span className="font-semibold text-sm text-purple-900">{t("course_det_higher_studies")}</span>
                </div>
                <ul className="space-y-1">
                  {course.careerOutcomes.higherStudies.map((j) => (
                    <li key={j} className="text-xs text-purple-800 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-purple-400" />{j}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Entrepreneurship */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🚀</span>
                  <span className="font-semibold text-sm text-amber-900">{t("course_det_entrepreneurship")}</span>
                </div>
                <ul className="space-y-1">
                  {course.careerOutcomes.entrepreneurship.map((j) => (
                    <li key={j} className="text-xs text-[hsl(44,50%,28%)] flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-amber-400" />{j}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <div className="text-center">
            <Button
              size="lg"
              className="bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white font-semibold"
              onClick={() => navigate("/colleges")}
            >
              {t("course_det_find_colleges")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
