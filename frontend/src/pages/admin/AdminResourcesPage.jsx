import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError } from "@/components/common/PageStates";
import { Button } from "@/components/ui/button";
import { Search, Trash2, CheckCircle, Shield, Plus } from "lucide-react";
import api from "@/api/client";
import toast from "react-hot-toast";

export default function AdminResourcesPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:"", type:"Video Lecture", subject:"", stream_name:"", url:"", description:"", is_free:true });
  const { data: resources, loading, error, refetch } = useApiData("/admin/resources");

  const set = (k,v) => setForm(p => ({...p, [k]:v}));

  const create = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    const { error: e } = await api.post("/admin/resources", form);
    if (e) toast.error(e); else { toast.success("Resource created!"); refetch(); setShowForm(false); }
  };

  const verify = async (id) => {
    const { error: e } = await api.post(`/admin/resources/${id}/verify`);
    if (e) toast.error(e); else { toast.success("Verified!"); refetch(); }
  };

  const del = async (id) => {
    if (!confirm("Delete this resource?")) return;
    const { error: e } = await api.delete(`/admin/resources/${id}`);
    if (e) toast.error(e); else { toast.success("Deleted!"); refetch(); }
  };

  if (loading) return <AdminLayout><PageLoader /></AdminLayout>;
  if (error) return <AdminLayout><PageError error={error} onRetry={refetch} /></AdminLayout>;

  const filtered = (resources || []).filter(r => !search || r.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">Resources ({resources?.length || 0})</h1>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-[hsl(226,64%,20%)] text-white gap-2 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add Resource
          </Button>
        </div>
        <div className="px-8 py-6 max-w-[1100px]">
          {showForm && (
            <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-6 mb-6 space-y-3">
              <h2 className="font-bold text-sm text-[hsl(226,64%,14%)]">Add New Resource</h2>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Resource title"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none" />
                <select value={form.type} onChange={e=>set("type",e.target.value)}
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none">
                  {["Video Lecture","E-Book","Previous Papers","Study Notes","Mock Test","Article"].map(t => <option key={t}>{t}</option>)}
                </select>
                <input value={form.subject} onChange={e=>set("subject",e.target.value)} placeholder="Subject"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none" />
                <input value={form.stream_name} onChange={e=>set("stream_name",e.target.value)} placeholder="Stream (Science/Commerce/Arts…)"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none" />
                <input value={form.url} onChange={e=>set("url",e.target.value)} placeholder="URL (https://…)"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none col-span-2" />
                <input value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Description"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none col-span-2" />
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_free} onChange={e=>set("is_free",e.target.checked)} />
                  Free resource
                </label>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={create} className="bg-[hsl(226,64%,20%)] text-white text-xs">Add Resource</Button>
                <Button size="sm" variant="outline" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
              </div>
            </div>
          )}

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,14%,55%)]" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search resources…"
              className="w-full max-w-md pl-9 pr-4 h-10 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none" />
          </div>

          <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="border-b border-[hsl(220,18%,91%)]">
                <tr className="text-left text-[hsl(220,14%,50%)]">
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Stream</th>
                  <th className="px-4 py-3 font-semibold">Free</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(220,18%,95%)]">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-[hsl(220,18%,97%)]">
                    <td className="px-4 py-3 font-semibold text-[hsl(226,64%,14%)] max-w-xs truncate">{r.title}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">{r.type}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">{r.stream_name || "—"}</td>
                    <td className="px-4 py-3">{r.is_free ? "✓ Free" : "Paid"}</td>
                    <td className="px-4 py-3">
                      {r.is_verified
                        ? <span className="text-[hsl(158,50%,35%)] font-semibold flex items-center gap-1"><CheckCircle className="h-3 w-3" />Verified</span>
                        : <span className="text-[hsl(220,14%,50%)]">Unverified</span>}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      {!r.is_verified && (
                        <Button size="sm" variant="outline" onClick={() => verify(r.id)} className="h-7 text-xs gap-1">
                          <Shield className="h-3 w-3" /> Verify
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => del(r.id)} className="h-7 text-xs text-red-500 border-red-200 hover:bg-red-50">
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
