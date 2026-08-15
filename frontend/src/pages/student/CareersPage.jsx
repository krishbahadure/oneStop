import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StudentLayout from "@/components/layout/StudentLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError, PageEmpty, VerifiedBadge } from "@/components/common/PageStates";
import { Button } from "@/components/ui/button";
import { Search, Briefcase, TrendingUp, IndianRupee } from "lucide-react";

const streamColors = { Science:"chip-lavender", Commerce:"chip-mint", Arts:"chip-yellow", Medical:"chip-peach", Vocational:"chip-orange" };

export default function CareersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [streamFilter, setStreamFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const { data: careers, loading, error, refetch } = useApiData("/careers");

  if (loading) return <StudentLayout><PageLoader message="Loading careers…" /></StudentLayout>;
  if (error) return <StudentLayout><PageError error={error} onRetry={refetch} /></StudentLayout>;

  const filtered = (careers || []).filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase());
    const matchStream = !streamFilter || c.stream_name === streamFilter;
    const matchSector = !sectorFilter || c.sector === sectorFilter;
    return matchSearch && matchStream && matchSector;
  });

  const streams = [...new Set((careers || []).map(c => c.stream_name).filter(Boolean))];

  return (
    <StudentLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5">
          <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">Career Explorer</h1>
          <p className="text-sm text-[hsl(220,14%,50%)] mt-0.5">Explore career paths available to J&K students with salary ranges and step-by-step guidance</p>
        </div>

        <div className="px-8 py-6 max-w-[1200px]">
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,14%,55%)]" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search careers…"
                className="w-full pl-9 pr-4 h-10 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none focus:border-[hsl(252,50%,60%)]" />
            </div>
            <select value={streamFilter} onChange={e=>setStreamFilter(e.target.value)}
              className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none">
              <option value="">All Streams</option>
              {streams.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={sectorFilter} onChange={e=>setSectorFilter(e.target.value)}
              className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none">
              <option value="">All Sectors</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Both">Both</option>
            </select>
          </div>

          {filtered.length === 0 ? <PageEmpty message="No careers match your filters." icon={Briefcase} /> : (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map(career => (
                <motion.div key={career.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
                  onClick={() => navigate(`/careers/${career.id}`)}
                  className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${streamColors[career.stream_name] || 'chip-blue'}`}>{career.stream_name}</span>
                        <span className="text-[10px] text-[hsl(220,14%,50%)]">{career.sector}</span>
                      </div>
                      <h3 className="font-bold text-base text-[hsl(226,64%,14%)]">{career.title}</h3>
                    </div>
                    <VerifiedBadge isVerified={career.is_verified} lastUpdated={career.last_updated} />
                  </div>
                  <p className="text-xs text-[hsl(220,14%,50%)] line-clamp-2 mb-4">{career.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-semibold text-[hsl(158,50%,35%)]">
                      <IndianRupee className="h-3 w-3" />
                      {((career.salary_min||0)/100000).toFixed(1)}–{((career.salary_max||0)/100000).toFixed(1)} LPA
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${career.growth_outlook === 'High' ? 'chip-mint' : 'chip-yellow'}`}>
                      {career.growth_outlook} Growth
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
