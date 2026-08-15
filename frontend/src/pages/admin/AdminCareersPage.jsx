import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError } from "@/components/common/PageStates";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash2, CheckCircle, Shield } from "lucide-react";
import api from "@/api/client";
import toast from "react-hot-toast";

export default function AdminCareersPage() {
  const [search, setSearch] = useState("");
  const { data: careers, loading, error, refetch } = useApiData("/admin/careers");

  if (loading) return <AdminLayout><PageLoader /></AdminLayout>;
  if (error) return <AdminLayout><PageError error={error} onRetry={refetch} /></AdminLayout>;

  const filtered = (careers || []).filter(c =>
    !search || c.title?.toLowerCase().includes(search.toLowerCase())
  );

  const verify = async (id) => {
    const { error: e } = await api.post(`/admin/careers/${id}/verify`);
    if (e) toast.error(e); else { toast.success("Career verified!"); refetch(); }
  };

  const del = async (id) => {
    if (!confirm("Delete this career?")) return;
    const { error: e } = await api.delete(`/admin/careers/${id}`);
    if (e) toast.error(e); else { toast.success("Deleted!"); refetch(); }
  };

  return (
    <AdminLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5">
          <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">Careers ({careers?.length || 0})</h1>
        </div>
        <div className="px-8 py-6 max-w-[1100px]">
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,14%,55%)]" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search careers…"
                className="w-full pl-9 pr-4 h-10 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none" />
            </div>
          </div>
          <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="border-b border-[hsl(220,18%,91%)]">
                <tr className="text-left text-[hsl(220,14%,50%)]">
                  <th className="px-4 py-3 font-semibold">Career Title</th>
                  <th className="px-4 py-3 font-semibold">Stream</th>
                  <th className="px-4 py-3 font-semibold">Sector</th>
                  <th className="px-4 py-3 font-semibold">Salary (LPA)</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(220,18%,95%)]">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-[hsl(220,18%,97%)]">
                    <td className="px-4 py-3 font-semibold text-[hsl(226,64%,14%)]">{c.title}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">{c.stream_name}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">{c.sector}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">
                      {((c.salary_min||0)/100000).toFixed(1)}–{((c.salary_max||0)/100000).toFixed(1)}
                    </td>
                    <td className="px-4 py-3">
                      {c.is_verified
                        ? <span className="text-[hsl(158,50%,35%)] font-semibold flex items-center gap-1"><CheckCircle className="h-3 w-3" />Verified</span>
                        : <span className="text-[hsl(220,14%,50%)]">Unverified</span>}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      {!c.is_verified && (
                        <Button size="sm" variant="outline" onClick={() => verify(c.id)} className="h-7 text-xs gap-1">
                          <Shield className="h-3 w-3" /> Verify
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => del(c.id)} className="h-7 text-xs text-red-500 border-red-200 hover:bg-red-50">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
