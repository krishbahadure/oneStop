import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError } from "@/components/common/PageStates";
import { Button } from "@/components/ui/button";
import { Search, Trash2, CheckCircle, Shield, Plus } from "lucide-react";
import api from "@/api/client";
import toast from "react-hot-toast";

const STREAMS = ["Science","Commerce","Arts","Medical","Vocational"];

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", stream_name:"Science", duration:"3 Years", degree_type:"UG", description:"", eligibility:"", avg_fees:"" });
  const { data: courses, loading, error, refetch } = useApiData("/admin/courses");

  const set = (k,v) => setForm(p => ({...p, [k]:v}));

  const create = async () => {
    if (!form.name) { toast.error("Course name required"); return; }
    const { error: e } = await api.post("/admin/courses", form);
    if (e) toast.error(e); else { toast.success("Course created!"); refetch(); setShowForm(false); }
  };

  const verify = async (id) => {
    const { error: e } = await api.post(`/admin/courses/${id}/verify`);
    if (e) toast.error(e); else { toast.success("Course verified!"); refetch(); }
  };

  const del = async (id) => {
    if (!confirm("Delete this course?")) return;
    const { error: e } = await api.delete(`/admin/courses/${id}`);
    if (e) toast.error(e); else { toast.success("Deleted!"); refetch(); }
  };

  if (loading) return <AdminLayout><PageLoader message="Loading courses…" /></AdminLayout>;
  if (error) return <AdminLayout><PageError error={error} onRetry={refetch} /></AdminLayout>;

  const filtered = (courses || []).filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.stream_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">Courses ({courses?.length || 0})</h1>
            <p className="text-sm text-[hsl(220,14%,50%)] mt-0.5">Manage courses across all streams</p>
          </div>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-[hsl(226,64%,20%)] text-white gap-2 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add Course
          </Button>
        </div>

        <div className="px-8 py-6 max-w-[1100px]">
          {showForm && (
            <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-6 mb-6 space-y-3">
              <h2 className="font-bold text-sm text-[hsl(226,64%,14%)]">Add New Course</h2>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Course name (e.g. B.Sc. Physics)"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none col-span-2" />
                <select value={form.stream_name} onChange={e=>set("stream_name",e.target.value)}
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none">
                  {STREAMS.map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={form.degree_type} onChange={e=>set("degree_type",e.target.value)}
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none">
                  <option value="UG">UG (Undergraduate)</option>
                  <option value="PG">PG (Postgraduate)</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Certificate">Certificate</option>
                </select>
                <input value={form.duration} onChange={e=>set("duration",e.target.value)} placeholder="Duration (e.g. 3 Years)"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none" />
                <input value={form.avg_fees} onChange={e=>set("avg_fees",e.target.value)} placeholder="Avg. fees (e.g. ₹20,000–₹50,000/year)"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none" />
                <input value={form.eligibility} onChange={e=>set("eligibility",e.target.value)} placeholder="Eligibility (e.g. 10+2 with Science)"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none col-span-2" />
                <input value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Description"
                  className="h-10 px-3 border border-[hsl(220,18%,88%)] rounded-lg text-sm focus:outline-none col-span-2" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={create} className="bg-[hsl(226,64%,20%)] text-white text-xs">Add Course</Button>
                <Button size="sm" variant="outline" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
              </div>
            </div>
          )}

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,14%,55%)]" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search courses…"
              className="w-full max-w-md pl-9 pr-4 h-10 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none" />
          </div>

          <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="border-b border-[hsl(220,18%,91%)]">
                <tr className="text-left text-[hsl(220,14%,50%)]">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Stream</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Duration</th>
                  <th className="px-4 py-3 font-semibold">Verified</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(220,18%,95%)]">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-[hsl(220,18%,97%)]">
                    <td className="px-4 py-3 font-semibold text-[hsl(226,64%,14%)] max-w-[200px] truncate">{c.name}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">{c.stream_name}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">{c.degree_type}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">{c.duration}</td>
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
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
