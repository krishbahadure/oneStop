import { useState } from "react";
import { motion } from "framer-motion";
import StudentLayout from "@/components/layout/StudentLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError, PageEmpty } from "@/components/common/PageStates";
import { Search, Library, ExternalLink, BookOpen } from "lucide-react";

const typeColors = {
  "Video Lecture": "chip-lavender",
  "E-Book": "chip-mint",
  "Previous Papers": "chip-yellow",
  "Study Notes": "chip-blue",
  "Mock Test": "chip-orange",
  "Article": "chip-peach",
};

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { data: resources, loading, error, refetch } = useApiData("/resources");

  if (loading) return <StudentLayout><PageLoader message="Loading resources…" /></StudentLayout>;
  if (error) return <StudentLayout><PageError error={error} onRetry={refetch} /></StudentLayout>;

  const types = [...new Set((resources || []).map(r => r.type).filter(Boolean))];
  const filtered = (resources || []).filter(r => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || r.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <StudentLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5">
          <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">Learning Resources</h1>
          <p className="text-sm text-[hsl(220,14%,50%)] mt-0.5">Free & curated resources for J&K students — videos, e-books, previous papers & more</p>
        </div>

        <div className="px-8 py-6 max-w-[1200px]">
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,14%,55%)]" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search resources…"
                className="w-full pl-9 pr-4 h-10 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none focus:border-[hsl(252,50%,60%)]" />
            </div>
            <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}
              className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none">
              <option value="">All Types</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? <PageEmpty message="No resources match your search." icon={Library} /> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(r => (
                <motion.div key={r.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
                  className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-5 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[r.type] || 'chip-blue'}`}>
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {r.is_free ? <span className="text-[9px] font-bold chip-mint px-2 py-0.5 rounded-full">Free</span> : null}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${typeColors[r.type] || 'chip-blue'}`}>{r.type}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-[hsl(226,64%,14%)] leading-tight mb-1 flex-1">{r.title}</h3>
                  {r.subject && <p className="text-xs text-[hsl(220,14%,50%)] mb-1">{r.subject} · {r.stream_name}</p>}
                  <p className="text-xs text-[hsl(220,14%,50%)] line-clamp-2 mb-4">{r.description}</p>
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 h-9 border border-[hsl(220,18%,88%)] rounded-lg text-xs font-semibold text-[hsl(226,64%,20%)] hover:bg-[hsl(220,18%,96%)] transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" /> Access Resource
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
