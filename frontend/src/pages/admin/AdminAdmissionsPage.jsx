import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AdminLayout from "@/components/layout/AdminLayout";
import { PrototypeBadge } from "@/components/common/PrototypeBadge";
import { admissions as initialAdmissions } from "@/data/mock/admissions";
import { Calendar, Plus, Pencil, Trash2, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminAdmissionsPage() {
  const [list, setList] = useState(initialAdmissions);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ event: "", description: "", date: "", colleges: "" });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!form.event || !form.date) { toast.error("Event name and date required"); return; }
    const d = new Date(form.date);
    const display = d.toLocaleDateString("en-IN", { month: "short", day: "2-digit" });
    setList((p) => [{
      id: `adm-${Date.now()}`,
      event: form.event,
      description: form.description,
      date: form.date,
      displayDate: display,
      displayYear: d.getFullYear().toString(),
      type: "start",
      colleges: form.colleges ? [form.colleges] : ["All"],
      courses: ["All"],
      district: "All",
      status: "upcoming",
      daysLeft: Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24)),
      important: false,
    }, ...p]);
    setForm({ event: "", description: "", date: "", colleges: "" });
    setOpen(false);
    toast.success("Admission event added");
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-[hsl(36,33%,97%)] min-h-full">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-[hsl(226,64%,14%)]">Admissions</h1>
              <PrototypeBadge />
            </div>
            <p className="text-[hsl(220,14%,45%)] text-sm">Manage admission timeline events</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white gap-2"><Plus className="h-4 w-4" /> Add Event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Admission Event</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-1.5"><Label>Event Name</Label><Input placeholder="e.g. Application Opens" value={form.event} onChange={(e) => set("event", e.target.value)} /></div>
                <div className="space-y-1.5"><Label>Description</Label><Input placeholder="Brief description" value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
                <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} /></div>
                <div className="space-y-1.5"><Label>College (optional)</Label><Input placeholder="All or specific college" value={form.colleges} onChange={(e) => set("colleges", e.target.value)} /></div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleAdd} className="bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white flex-1">Add Event</Button>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {list.map((ev) => (
            <div key={ev.id} className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-blue-500 text-[9px] font-bold">{ev.displayDate?.split(" ")[0]}</span>
                <span className="text-blue-700 text-base font-black">{ev.displayDate?.split(" ")[1]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{ev.event}</p>
                  {ev.important && <Badge className="bg-red-100 text-red-700 text-[10px] py-0">Important</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{ev.description}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {ev.daysLeft <= 10 && <span className="text-xs text-red-600 font-semibold flex items-center gap-0.5"><Clock className="h-3 w-3" />{ev.daysLeft}d</span>}
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-blue-600" onClick={() => toast.success("Edit coming soon")}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-red-600" onClick={() => { setList((p) => p.filter((x) => x.id !== ev.id)); toast.success("Event removed"); }}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}



