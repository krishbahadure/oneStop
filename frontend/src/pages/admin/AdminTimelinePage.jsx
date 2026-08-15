import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError } from "@/components/common/PageStates";
import { Button } from "@/components/ui/button";
import { Search, Trash2, CheckCircle, Shield, Plus, Calendar } from "lucide-react";
import api from "@/api/client";
import toast from "react-hot-toast";

export default function AdminTimelinePage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:"", description:"", event_date:"", category:"Admission", status:"upcoming" });
  const { data: events, loading, error, refetch } = useApiData("/admin/timeline");

  const set = (k,v) => setForm(p => ({...p, [k]:v}));

  const create = async () => {
    if (!form.title || !form.event_date) { toast.error("Title and date required"); return; }
    const { error: e } = await api.post("/admin/timeline", form);
    if (e) toast.error(e); else { toast.success("Event created!"); refetch(); setShowForm(false); setForm({ title:"", description:"", event_date:"", category:"Admission", status:"upcoming" }); }
  };

  const verify = async (id) => {
    const { error: e } = await api.post(`/admin/timeline/${id}/verify`);
    if (e) toast.error(e); else { toast.success("Verified!"); refetch(); }
  };

  const del = async (id) => {
    if (!confirm("Delete this event?")) return;
    const { error: e } = await api.delete(`/admin/timeline/${id}`);
    if (e) toast.error(e); else { toast.success("Deleted!"); refetch(); }
  };

  if (loading) return <AdminLayout><PageLoader /></AdminLayout>;
  if (error) return <AdminLayout><PageError error={error} onRetry={refetch} /></AdminLayout>;

  const filtered = (events || []).filter(e => !search || e.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">Timeline Events ({events?.length || 0})</h1>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-[hsl(226,64%,20%)] text-white gap-2 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add Event
          </Button>
        </div>
        <div className="px-8 py-6 max-w-[1000px]">
          {showForm && (
            <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-6 mb-6 space-y-3">
              <h2 className="font-bold text-sm text-[hsl(226,64%,14%)]">Add New Event</h2>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Event title"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none" />
                <input type="date" value={form.event_date} onChange={e=>set("event_date",e.target.value)}
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none" />
                <select value={form.category} onChange={e=>set("category",e.target.value)}
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none">
                  {["Admission","Exam","Result","Registration","Scholarship","Other"].map(c => <option key={c}>{c}</option>)}
                </select>
                <input value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Description (optional)"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={create} className="bg-[hsl(226,64%,20%)] text-white text-xs">Create Event</Button>
                <Button size="sm" variant="outline" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
              </div>
            </div>
          )}

          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,14%,55%)]" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events…"
                className="w-full pl-9 pr-4 h-10 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none" />
            </div>
          </div>

          <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="border-b border-[hsl(220,18%,91%)]">
                <tr className="text-left text-[hsl(220,14%,50%)]">
                  <th className="px-4 py-3 font-semibold">Event</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(220,18%,95%)]">
                {filtered.map(e => (
                  <tr key={e.id} className="hover:bg-[hsl(220,18%,97%)]">
                    <td className="px-4 py-3 font-semibold text-[hsl(226,64%,14%)] max-w-xs truncate">{e.title}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">{e.event_date}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">{e.category}</td>
                    <td className="px-4 py-3">
                      {e.is_verified
                        ? <span className="text-[hsl(158,50%,35%)] font-semibold flex items-center gap-1"><CheckCircle className="h-3 w-3" />Verified</span>
                        : <span className="text-[hsl(220,14%,50%)]">Draft</span>}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      {!e.is_verified && (
                        <Button size="sm" variant="outline" onClick={() => verify(e.id)} className="h-7 text-xs gap-1">
                          <Shield className="h-3 w-3" /> Verify
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => del(e.id)} className="h-7 text-xs text-red-500 border-red-200 hover:bg-red-50">
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
