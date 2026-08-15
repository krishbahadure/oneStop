import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError } from "@/components/common/PageStates";
import { Button } from "@/components/ui/button";
import { Search, Trash2, CheckCircle, Shield, Plus, ExternalLink } from "lucide-react";
import api from "@/api/client";
import toast from "react-hot-toast";

export default function AdminScholarshipsPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", provider:"", amount:"", description:"", deadline:"", application_url:"" });
  const { data: scholarships, loading, error, refetch } = useApiData("/admin/scholarships");

  const set = (k,v) => setForm(p => ({...p, [k]:v}));

  const create = async () => {
    if (!form.name) { toast.error("Scholarship name required"); return; }
    const { error: e } = await api.post("/admin/scholarships", form);
    if (e) toast.error(e); else { toast.success("Scholarship created!"); refetch(); setShowForm(false); }
  };

  const verify = async (id) => {
    const { error: e } = await api.post(`/admin/scholarships/${id}/verify`);
    if (e) toast.error(e); else { toast.success("Verified!"); refetch(); }
  };

  const del = async (id) => {
    if (!confirm("Delete this scholarship?")) return;
    const { error: e } = await api.delete(`/admin/scholarships/${id}`);
    if (e) toast.error(e); else { toast.success("Deleted!"); refetch(); }
  };

  if (loading) return <AdminLayout><PageLoader message="Loading scholarships…" /></AdminLayout>;
  if (error) return <AdminLayout><PageError error={error} onRetry={refetch} /></AdminLayout>;

  const filtered = (scholarships || []).filter(s =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.provider?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">Scholarships ({scholarships?.length || 0})</h1>
            <p className="text-sm text-[hsl(220,14%,50%)] mt-0.5">Manage scholarship listings for J&K students</p>
          </div>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-[hsl(226,64%,20%)] text-white gap-2 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add Scholarship
          </Button>
        </div>

        <div className="px-8 py-6 max-w-[1100px]">
          {showForm && (
            <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-6 mb-6 space-y-3">
              <h2 className="font-bold text-sm text-[hsl(226,64%,14%)]">Add New Scholarship</h2>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Scholarship name"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none col-span-2" />
                <input value={form.provider} onChange={e=>set("provider",e.target.value)} placeholder="Provider (e.g. J&K Social Welfare Dept)"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none" />
                <input value={form.amount} onChange={e=>set("amount",e.target.value)} placeholder="Amount (e.g. ₹10,000/year)"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none" />
                <input value={form.deadline} onChange={e=>set("deadline",e.target.value)} placeholder="Deadline (e.g. 31 Aug 2024)"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none" />
                <input value={form.application_url} onChange={e=>set("application_url",e.target.value)} placeholder="Application URL (https://…)"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none" />
                <input value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Description"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none col-span-2" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={create} className="bg-[hsl(226,64%,20%)] text-white text-xs">Add Scholarship</Button>
                <Button size="sm" variant="outline" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
              </div>
            </div>
          )}

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,14%,55%)]" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search scholarships…"
              className="w-full max-w-md pl-9 pr-4 h-10 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none" />
          </div>

          <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="border-b border-[hsl(220,18%,91%)]">
                <tr className="text-left text-[hsl(220,14%,50%)]">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Provider</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Deadline</th>
                  <th className="px-4 py-3 font-semibold">Verified</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(220,18%,95%)]">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-[hsl(220,18%,97%)]">
                    <td className="px-4 py-3 font-semibold text-[hsl(226,64%,14%)] max-w-[180px] truncate">{s.name}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)] max-w-[140px] truncate">{s.provider}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">{s.amount}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">{s.deadline || "—"}</td>
                    <td className="px-4 py-3">
                      {s.is_verified
                        ? <span className="text-[hsl(158,50%,35%)] font-semibold flex items-center gap-1"><CheckCircle className="h-3 w-3" />Yes</span>
                        : <span className="text-[hsl(220,14%,50%)]">No</span>}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      {!s.is_verified && (
                        <Button size="sm" variant="outline" onClick={() => verify(s.id)} className="h-7 text-xs gap-1">
                          <Shield className="h-3 w-3" /> Verify
                        </Button>
                      )}
                      {s.application_url && (
                        <a href={s.application_url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="h-7 text-xs"><ExternalLink className="h-3 w-3" /></Button>
                        </a>
                      )}
                      <Button size="sm" variant="outline" onClick={() => del(s.id)} className="h-7 text-xs text-red-500 border-red-200 hover:bg-red-50">
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
