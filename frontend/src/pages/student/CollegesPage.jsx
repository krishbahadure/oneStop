import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import StudentLayout from "@/components/layout/StudentLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError, PageEmpty, VerifiedBadge } from "@/components/common/PageStates";
import { Search, Building2, MapPin, Wifi, Star } from "lucide-react";

const DISTRICTS = ["Srinagar","Baramulla","Anantnag","Jammu","Kupwara","Pulwama","Budgam","Bandipora","Ganderbal","Kulgam","Shopian","Doda","Poonch","Rajouri","Udhampur","Kathua","Reasi","Samba","Kishtwar","Ramban"];

export default function CollegesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [hostelOnly, setHostelOnly] = useState(false);
  const { data: colleges, loading, error, refetch } = useApiData("/colleges");

  if (loading) return <StudentLayout requireAuth={false}><PageLoader message={t("colleges_loading")} /></StudentLayout>;
  if (error) return <StudentLayout requireAuth={false}><PageError error={error} onRetry={refetch} /></StudentLayout>;

  const filtered = (colleges || []).filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.address || "").toLowerCase().includes(search.toLowerCase());
    const matchDist = !district || c.district === district;
    const matchHostel = !hostelOnly || !!c.hostel_available;
    return matchSearch && matchDist && matchHostel;
  });

  return (
    <StudentLayout requireAuth={false}>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5">
          <div>
            <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">{t("colleges_title")}</h1>
            <p className="text-sm text-[hsl(220,14%,50%)] mt-0.5">{filtered.length} {t("colleges_found")}</p>
          </div>
        </div>

        <div className="px-8 py-6 max-w-[1200px]">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,14%,55%)]" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("colleges_search")}
                className="w-full pl-9 pr-4 h-10 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none focus:border-[hsl(252,50%,60%)]" />
            </div>
            <select value={district} onChange={e=>setDistrict(e.target.value)}
              className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none">
              <option value="">{t("colleges_all_districts")}</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <label className="flex items-center gap-2 h-10 px-4 border border-[hsl(220,18%,88%)] rounded-lg bg-white cursor-pointer text-sm">
              <input type="checkbox" checked={hostelOnly} onChange={e=>setHostelOnly(e.target.checked)} />
              {t("colleges_hostel")}
            </label>
          </div>

          {filtered.length === 0 ? <PageEmpty message={t("colleges_no_match")} icon={Building2} /> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(college => (
                <motion.div key={college.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
                  className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-5 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <VerifiedBadge isVerified={college.is_verified} lastUpdated={college.last_updated} />
                        {college.naac_grade && (
                          <span className="text-[9px] font-bold chip-lavender px-2 py-0.5 rounded-full">{t("colleges_naac")} {college.naac_grade}</span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-[hsl(226,64%,14%)] leading-tight">{college.name}</h3>
                    </div>
                    {college.admission_status === "Applications Open" && (
                      <span className="text-[9px] font-semibold chip-mint px-2 py-0.5 rounded-full flex-shrink-0 ml-2">{t("colleges_open")}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-[hsl(220,14%,50%)] mb-3">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{college.district}</span>
                    {college.hostel_available ? (
                      <span className="ml-auto flex items-center gap-0.5 text-[10px] font-semibold text-[hsl(158,50%,40%)]"><Wifi className="h-2.5 w-2.5" />{t("colleges_hostel_badge")}</span>
                    ) : null}
                  </div>

                  <p className="text-xs text-[hsl(220,14%,50%)] line-clamp-2 mb-4 flex-1">{college.description}</p>

                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => navigate(`/colleges/${college.id}`)}>
                    {t("colleges_view_details")}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
