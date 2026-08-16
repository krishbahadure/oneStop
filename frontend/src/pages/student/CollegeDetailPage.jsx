import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StudentLayout from "@/components/layout/StudentLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { PrototypeBadge } from "@/components/common/PrototypeBadge";
import { getCollegeById } from "@/data/mock/colleges";
import { cn } from "@/lib/utils";
import {
  Building2, ArrowLeft, MapPin, ArrowRight,
  Wifi, BookOpen, Home, FlaskConical, Dumbbell, Coffee,
  CheckCircle, XCircle, Calendar
} from "lucide-react";

export default function CollegeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const college = getCollegeById(id);

  if (!college) {
    return (
      <StudentLayout requireAuth={false}>
        <EmptyState icon={Building2} title={t("college_det_not_found")} action={<Button onClick={() => navigate("/colleges")}>{t("college_det_back")}</Button>} className="min-h-screen" />
      </StudentLayout>
    );
  }

  const facilityIcons = {
    hostel: { icon: Home, label: t("facility_hostel") },
    library: { icon: BookOpen, label: t("facility_library") },
    labs: { icon: FlaskConical, label: t("facility_labs") },
    internet: { icon: Wifi, label: t("facility_internet") },
    sports: { icon: Dumbbell, label: t("facility_sports") },
    canteen: { icon: Coffee, label: t("facility_canteen") },
  };

  return (
    <StudentLayout requireAuth={false}>
      <div className="min-h-full bg-[hsl(36,33%,97%)] pb-10">
        {/* Header */}
        <div className="bg-white px-6 py-10">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" size="sm" onClick={() => navigate("/colleges")} className="text-[hsl(220,14%,50%)] hover:text-foreground mb-4 -ml-2">
              <ArrowLeft className="mr-1 h-4 w-4" /> {t("college_det_back")}
            </Button>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[hsl(252,50%,95%)] flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-7 w-7 text-[hsl(252,50%,45%)]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-black leading-tight">{college.name}</h1>
                    <PrototypeBadge />
                  </div>
                  <div className="flex items-center gap-1.5 text-[hsl(220,14%,50%)] text-sm">
                    <MapPin className="h-3.5 w-3.5" /> {college.district} · {college.distance}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`text-xs ${college.admissionStatus === "Applications Open" ? "bg-emerald-500/20 text-emerald-700 border border-emerald-200" : "bg-[hsl(220,18%,93%)] text-[hsl(220,14%,50%)]"}`}>
                      {college.admissionStatus}
                    </Badge>
                    <span className="text-[hsl(220,14%,50%)] text-xs">{t("colleges_est")} {college.established}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Overview */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6">
            <h2 className="text-lg font-bold mb-3">{t("college_det_about")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{college.description}</p>
            <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-[hsl(220,18%,91%)]">
              <div>
                <span className="text-xs text-muted-foreground">{t("college_det_affiliated")}</span>
                <p className="text-sm font-medium mt-0.5">{college.affiliatedTo}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">{t("college_det_medium")}</span>
                <p className="text-sm font-medium mt-0.5">{college.medium}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">{t("college_det_students")}</span>
                <p className="text-sm font-medium mt-0.5">{college.totalStudents}</p>
              </div>
            </div>
          </motion.div>

          {/* Courses & Cutoffs */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{t("college_det_courses_offered")}</h2>
              <PrototypeBadge />
            </div>
            <div className="space-y-3">
              {college.courses.map((course) => (
                <div key={course} className="flex items-center justify-between py-2.5 border-b border-[hsl(220,18%,91%)] last:border-0">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{course}</span>
                  </div>
                  {college.previousCutoff?.[course] && (
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">{t("college_det_prev_cutoff")}</span>
                      <p className="text-sm font-bold text-[hsl(226,64%,20%)]">{college.previousCutoff[course]}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-[hsl(220,18%,91%)]">
              {t("college_det_cutoff_disclaimer")}
            </p>
          </motion.div>

          {/* Facilities */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6">
            <h2 className="text-lg font-bold mb-4">{t("college_det_facilities")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(facilityIcons).map(([key, { icon: Icon, label }]) => {
                const available = college.facilities[key];
                return (
                  <div key={key} className={cn("flex items-center gap-2.5 p-3 rounded-xl border", available ? "bg-emerald-50 border-emerald-100" : "bg-muted/50 border-[hsl(220,18%,91%)] opacity-60")}>
                    <Icon className={cn("h-4 w-4 flex-shrink-0", available ? "text-[hsl(158,50%,35%)]" : "text-muted-foreground")} />
                    <span className={cn("text-sm font-medium", available ? "text-emerald-900" : "text-muted-foreground")}>{label}</span>
                    {available
                      ? <CheckCircle className="ml-auto h-4 w-4 text-[hsl(158,50%,40%)]" />
                      : <XCircle className="ml-auto h-4 w-4 text-muted-foreground/50" />
                    }
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Eligibility */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6">
            <h2 className="text-lg font-bold mb-3">{t("college_det_eligibility_adm")}</h2>
            <div className="bg-[hsl(252,60%,96%)] rounded-xl p-4 border border-blue-100">
              <p className="text-sm text-blue-900 font-medium">{college.eligibility}</p>
            </div>
          </motion.div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3">
            <Button
              className="bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white font-semibold gap-2"
              onClick={() => navigate("/timeline")}
            >
              <Calendar className="h-4 w-4" />
              {t("college_det_view_timeline")}
            </Button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
