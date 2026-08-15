import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError } from "@/components/common/PageStates";
import { Button } from "@/components/ui/button";
import { Search, Trash2, CheckCircle, Shield, Plus, MapPin } from "lucide-react";
import api from "@/api/client";
import toast from "react-hot-toast";

const DISTRICTS = ["Srinagar","Baramulla","Anantnag","Jammu","Kupwara","Pulwama","Budgam","Bandipora","Ganderbal","Kulgam","Shopian","Doda","Poonch","Rajouri","Udhampur","Kathua","Reasi","Samba","Kishtwar","Ramban"];

export default function AdminCollegesPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", district:"", address:"", naac_grade:"", affiliated_to:"", hostel_available:false, admission_status:"Applications Closed", description:"" });
  const { data: colleges, loading, error, refetch } = useApiData("/admin/colleges");

  const set = (k,v) => setForm(p => ({...p, [k]:v}));

  const create = async () => {
    if (!form.name || !form.district) { toast.error("Name and district required"); return; }
    const { error: e } = await api.post("/admin/colleges", form);
    if (e) toast.error(e); else { toast.success("College added!"); refetch(); setShowForm(false); }
  };

  const verify = async (id) => {
    const { error: e } = await api.post(`/admin/colleges/${id}/verify`);
    if (e) toast.error(e); else { toast.success("College verified!"); refetch(); }
  };

  const del = async (id) => {
    if (!confirm("Delete this college?")) return;
    const { error: e } = await api.delete(`/admin/colleges/${id}`);
    if (e) toast.error(e); else { toast.success("Deleted!"); refetch(); }
  };

  if (loading) return <AdminLayout><PageLoader message="Loading colleges…" /></AdminLayout>;
  if (error) return <AdminLayout><PageError error={error} onRetry={refetch} /></AdminLayout>;

  const filtered = (colleges || []).filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.district?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">Colleges ({colleges?.length || 0})</h1>
            <p className="text-sm text-[hsl(220,14%,50%)] mt-0.5">Manage government colleges in J&K</p>
          </div>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-[hsl(226,64%,20%)] text-white gap-2 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add College
          </Button>
        </div>

        <div className="px-8 py-6 max-w-[1200px]">
          {showForm && (
            <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-6 mb-6 space-y-3">
              <h2 className="font-bold text-sm text-[hsl(226,64%,14%)]">Add New College</h2>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="College name"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none col-span-2" />
                <select value={form.district} onChange={e=>set("district",e.target.value)}
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none">
                  <option value="">Select District</option>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
                <input value={form.affiliated_to} onChange={e=>set("affiliated_to",e.target.value)} placeholder="Affiliated to (University)"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none" />
                <select value={form.naac_grade} onChange={e=>set("naac_grade",e.target.value)}
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none">
                  <option value="">NAAC Grade (optional)</option>
                  {["A+","A","B++","B+","B","C"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <select value={form.admission_status} onChange={e=>set("admission_status",e.target.value)}
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none">
                  <option value="Applications Open">Applications Open</option>
                  <option value="Applications Closed">Applications Closed</option>
                  <option value="Merit List Released">Merit List Released</option>
                </select>
                <input value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Description (optional)"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none col-span-2" />
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.hostel_available} onChange={e=>set("hostel_available",e.target.checked)} />
                  Hostel Available
                </label>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={create} className="bg-[hsl(226,64%,20%)] text-white text-xs">Add College</Button>
                <Button size="sm" variant="outline" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
              </div>
            </div>
          )}

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,14%,55%)]" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or district…"
              className="w-full max-w-md pl-9 pr-4 h-10 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none" />
          </div>

          <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="border-b border-[hsl(220,18%,91%)]">
                <tr className="text-left text-[hsl(220,14%,50%)]">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">District</th>
                  <th className="px-4 py-3 font-semibold">NAAC</th>
                  <th className="px-4 py-3 font-semibold">Hostel</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Verified</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(220,18%,95%)]">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-[hsl(220,18%,97%)]">
                    <td className="px-4 py-3 font-semibold text-[hsl(226,64%,14%)] max-w-[220px] truncate">{c.name}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.district}</span>
                    </td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">{c.naac_grade || "—"}</td>
                    <td className="px-4 py-3">{c.hostel_available ? "✓" : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.admission_status === 'Applications Open' ? 'chip-mint' : 'chip-peach'}`}>
                        {c.admission_status === 'Applications Open' ? 'Open' : 'Closed'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {c.is_verified
                        ? <span className="text-[hsl(158,50%,35%)] font-semibold flex items-center gap-1"><CheckCircle className="h-3 w-3" />Yes</span>
                        : <span className="text-[hsl(220,14%,50%)]">No</span>}
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
            {filtered.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-[hsl(220,14%,50%)]">No colleges found.</div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
