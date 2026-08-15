import { useState } from "react";
import { Menu, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[hsl(36,33%,97%)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-[hsl(220,18%,91%)]">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 text-[hsl(226,64%,20%)]">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-white" onClick={() => setOpen(false)}>
              <AdminSidebar />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[hsl(226,64%,20%)] flex items-center justify-center">
              <GraduationCap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-black text-sm text-[hsl(226,64%,14%)]">ONE STOP Admin</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
