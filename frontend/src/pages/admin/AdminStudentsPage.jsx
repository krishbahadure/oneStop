import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError } from "@/components/common/PageStates";
import { Users, Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");
  const { data: students, loading, error, refetch } = useApiData("/admin/students");

  if (loading) return <AdminLayout><PageLoader message="Loading students…" /></AdminLayout>;
  if (error) return <AdminLayout><PageError error={error} onRetry={refetch} /></AdminLayout>;

  const filtered = (students || []).filter(s =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)]">
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-8 py-5">
          <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">Students ({students?.length || 0})</h1>
          <p className="text-sm text-[hsl(220,14%,50%)] mt-0.5">All registered students</p>
        </div>
        <div className="px-8 py-6 max-w-[1200px]">
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220,14%,55%)]" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email…"
              className="w-full pl-9 pr-4 h-10 border border-[hsl(220,18%,88%)] rounded-lg text-sm bg-white focus:outline-none" />
          </div>
          <div className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="border-b border-[hsl(220,18%,91%)]">
                <tr className="text-left text-[hsl(220,14%,50%)]">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">District</th>
                  <th className="px-4 py-3 font-semibold">Profile</th>
                  <th className="px-4 py-3 font-semibold">Assessment</th>
                  <th className="px-4 py-3 font-semibold">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(220,18%,95%)]">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-[hsl(220,18%,97%)]">
                    <td className="px-4 py-3 font-semibold text-[hsl(226,64%,14%)]">{s.name}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">{s.email}</td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">{s.district || "—"}</td>
                    <td className="px-4 py-3">
                      {s.profile_completed
                        ? <span className="flex items-center gap-1 text-[hsl(158,50%,35%)] font-semibold"><CheckCircle className="h-3 w-3" /> Done</span>
                        : <span className="flex items-center gap-1 text-[hsl(22,80%,40%)]"><XCircle className="h-3 w-3" /> Pending</span>}
                    </td>
                    <td className="px-4 py-3">
                      {s.assessment_at
                        ? <span className="flex items-center gap-1 text-[hsl(158,50%,35%)] font-semibold"><CheckCircle className="h-3 w-3" /> Done</span>
                        : <span className="text-[hsl(220,14%,50%)]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-[hsl(220,14%,40%)]">{new Date(s.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-[hsl(220,14%,50%)]">No students found.</div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
