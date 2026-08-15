import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import StudentLayout from "@/components/layout/StudentLayout";
import { PrototypeBadge } from "@/components/common/PrototypeBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { useComparison } from "@/hooks/useComparison";
import { getCollegeById } from "@/data/mock/colleges";
import { Building2, X, CheckCircle, XCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CollegeComparePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { compared, removeFromComparison, clearComparison } = useComparison();
  const collegeData = compared.map((id) => getCollegeById(id)).filter(Boolean);

  const rows = [
    { key: "type", label: t("compare_label_type"), render: (c) => c.type },
    { key: "district", label: t("compare_label_district"), render: (c) => c.district },
    { key: "distance", label: t("compare_label_distance"), render: (c) => c.distance },
    { key: "eligibility", label: t("compare_label_eligibility"), render: (c) => c.eligibility },
    { key: "courses", label: t("compare_label_courses"), render: (c) => c.courses.slice(0, 3).join(", ") + (c.courses.length > 3 ? ` +${c.courses.length - 3}` : "") },
    { key: "medium", label: t("compare_label_medium"), render: (c) => c.medium },
    { key: "hostel", label: t("compare_label_hostel"), render: (c) => c.facilities.hostel ? t("compare_available") : t("compare_not_available"), isBoolean: true, boolKey: "hostel" },
    { key: "library", label: t("compare_label_library"), render: (c) => c.facilities.library ? t("compare_available") : t("compare_not_available"), isBoolean: true, boolKey: "library" },
    { key: "labs", label: t("compare_label_labs"), render: (c) => c.facilities.labs ? t("compare_available") : t("compare_not_available"), isBoolean: true, boolKey: "labs" },
    { key: "internet", label: t("compare_label_internet"), render: (c) => c.facilities.internet ? t("compare_available") : t("compare_not_available"), isBoolean: true, boolKey: "internet" },
    { key: "admissionStatus", label: t("compare_label_admission"), render: (c) => c.admissionStatus },
    { key: "established", label: t("compare_label_established"), render: (c) => c.established },
  ];

  if (collegeData.length === 0) {
    return (
      <StudentLayout requireAuth={false}>
        <div className="min-h-full bg-[hsl(36,33%,97%)] p-6">
          <EmptyState
            icon={Building2}
            title={t("compare_no_colleges")}
            description={t("compare_add_colleges")}
            action={<Button onClick={() => navigate("/colleges")} className="bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white font-semibold">{t("compare_browse")}</Button>}
          />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout requireAuth={false}>
      <div className="min-h-full bg-[hsl(36,33%,97%)] pb-10">
        {/* Header */}
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-6 py-6">
          <div className="max-w-6xl mx-auto flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black">{t("compare_title")}</h1>
                <PrototypeBadge />
              </div>
              <p className="text-muted-foreground text-sm">{t("compare_comparing")} {collegeData.length} {t("compare_colleges_side")}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearComparison} className="text-red-600 hover:bg-red-50 hover:border-red-200">
                {t("compare_clear_all")}
              </Button>
              <Button size="sm" className="bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white font-semibold" onClick={() => navigate("/colleges")}>
                <Plus className="mr-1.5 h-3.5 w-3.5" /> {t("compare_add_more")}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Scrollable comparison table */}
          <div className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[hsl(220,18%,91%)]">
                    <th className="text-left p-4 font-semibold text-muted-foreground text-sm w-40">{t("compare_criteria")}</th>
                    {collegeData.map((college) => (
                      <th key={college.id} className="p-4 text-center w-56">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-[hsl(252,60%,96%)] flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-[hsl(252,50%,45%)]" />
                          </div>
                          <span className="font-bold text-sm leading-tight">{college.shortName}</span>
                          <span className="text-xs text-muted-foreground">{college.district}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromComparison(college.id)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </th>
                    ))}
                    {collegeData.length < 3 && (
                      <th className="p-4 text-center w-56">
                        <Button
                          variant="outline"
                          className="border-dashed h-24 w-full flex flex-col gap-1 text-muted-foreground"
                          onClick={() => navigate("/colleges")}
                        >
                          <Plus className="h-5 w-5" />
                          <span className="text-xs">{t("compare_add_college")}</span>
                        </Button>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <motion.tr
                      key={row.key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className={cn("border-b border-[hsl(220,18%,91%)] last:border-0", i % 2 === 0 ? "bg-white" : "bg-[hsl(220,20%,98%)]")}
                    >
                      <td className="p-4 text-sm font-medium text-muted-foreground">{row.label}</td>
                      {collegeData.map((college) => {
                        const value = row.render(college);
                        const isAvailable = row.isBoolean ? college.facilities[row.boolKey] : null;
                        return (
                          <td key={college.id} className="p-4 text-sm text-center">
                            {row.isBoolean ? (
                              <div className="flex items-center justify-center gap-1">
                                {isAvailable
                                  ? <><CheckCircle className="h-4 w-4 text-[hsl(158,50%,40%)]" /><span className="text-emerald-700 text-xs font-medium">{t("compare_yes")}</span></>
                                  : <><XCircle className="h-4 w-4 text-muted-foreground/50" /><span className="text-muted-foreground text-xs">{t("compare_no")}</span></>
                                }
                              </div>
                            ) : (
                              <span className="text-foreground">{value}</span>
                            )}
                          </td>
                        );
                      })}
                      {collegeData.length < 3 && <td />}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* View individual details */}
          <div className="flex flex-wrap gap-3 mt-6">
            {collegeData.map((college) => (
              <Button key={college.id} variant="outline" size="sm" onClick={() => navigate(`/colleges/${college.id}`)}>
                {t("compare_view")} {college.shortName} {t("compare_details")}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
