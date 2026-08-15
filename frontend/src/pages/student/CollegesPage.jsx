import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import StudentLayout from "@/components/layout/StudentLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError, PageEmpty, VerifiedBadge } from "@/components/common/PageStates";
import { Search, Building2, MapPin, Wifi, Star, ArrowRight, GitCompare } from "lucide-react";
import toast from "react-hot-toast";

const COMPARE_KEY = "onestop_comparison";
const MAX_COMPARE = 3;

const DISTRICTS = ["Srinagar","Baramulla","Anantnag","Jammu","Kupwara","Pulwama","Budgam","Bandipora","Ganderbal","Kulgam","Shopian","Doda","Poonch","Rajouri","Udhampur","Kathua","Reasi","Samba","Kishtwar","Ramban"];

export default function CollegesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [hostelOnly, setHostelOnly] = useState(false);
  const { data: colleges, loading, error, refetch } = useApiData("/colleges");

  const [compareIds, setCompareIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]"); } catch { return []; }
  });

  if (loading) return <StudentLayout><PageLoader message="Loading colleges…" /></StudentLayout>;
  if (error) return <StudentLayout><PageError error={error} onRetry={refetch} /></StudentLayout>;

  const filtered = (colleges || []).filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.address || "").toLowerCase().includes(search.toLowerCase());
    const matchDist = !district || c.district === district;
    const matchHostel = !hostelOnly || !!c.hostel_available;
    return matchSearch && matchDist && matchHostel;
  });

  const toggleCompare = (id) => {
    let next;
    if (compareIds.includes(id)) {
      next = compareIds.filter(i => i !== id);
    } else {
      if (compareIds.length >= MAX_COMPARE) { toast.error(`Compare up to ${MAX_COMPARE} colleges only`); return; }
      next = [...compareIds, id];
    }
    setCompareIds(next);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
  };

  return (
    <StudentLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">Government Colleges in J&K</h1>
              <p className="text-sm text-[hsl(220,14%,50%)] mt-0.5">{filtered.length} colleges found · Add up to {MAX_COMPARE} to compare</p>
            </div>
            {compareIds.length > 0 && (
              <Button onClick={() => navigate("/colleges/compare")} className="bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white gap-2">
                <GitCompare className="h-4 w-4" /> Compare ({compareIds.length})
              </Button>
            )}
          </div>
        </div>

        <div className="px-8 py-6 max-w-[1200px]">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,14%,55%)]" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search colleges…"
                className="w-full pl-9 pr-4 h-10 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none focus:border-[hsl(252,50%,60%)]" />
            </div>
            <select value={district} onChange={e=>setDistrict(e.target.value)}
              className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none">
              <option value="">All Districts</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <label className="flex items-center gap-2 h-10 px-4 border border-[hsl(220,18%,88%)] rounded-lg bg-white cursor-pointer text-sm">
              <input type="checkbox" checked={hostelOnly} onChange={e=>setHostelOnly(e.target.checked)} />
              Hostel Available
            </label>
          </div>

          {filtered.length === 0 ? <PageEmpty message="No colleges match your filters." icon={Building2} /> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(college => {
                const inCompare = compareIds.includes(college.id);
                return (
                  <motion.div key={college.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
                    className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-5 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <VerifiedBadge isVerified={college.is_verified} lastUpdated={college.last_updated} />
                          {college.naac_grade && (
                            <span className="text-[9px] font-bold chip-lavender px-2 py-0.5 rounded-full">NAAC {college.naac_grade}</span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm text-[hsl(226,64%,14%)] leading-tight">{college.name}</h3>
                      </div>
                      {college.admission_status === "Applications Open" && (
                        <span className="text-[9px] font-semibold chip-mint px-2 py-0.5 rounded-full flex-shrink-0 ml-2">Open</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-[hsl(220,14%,50%)] mb-3">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{college.district}</span>
                      {college.hostel_available ? (
                        <span className="ml-auto flex items-center gap-0.5 text-[10px] font-semibold text-[hsl(158,50%,40%)]"><Wifi className="h-2.5 w-2.5" />Hostel</span>
                      ) : null}
                    </div>

                    <p className="text-xs text-[hsl(220,14%,50%)] line-clamp-2 mb-4 flex-1">{college.description}</p>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => navigate(`/colleges/${college.id}`)}>
                        View Details
                      </Button>
                      <Button variant="outline" size="sm"
                        className={`text-xs px-3 ${inCompare ? 'bg-[hsl(226,64%,20%)] text-white border-transparent' : ''}`}
                        onClick={() => toggleCompare(college.id)}>
                        <GitCompare className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
