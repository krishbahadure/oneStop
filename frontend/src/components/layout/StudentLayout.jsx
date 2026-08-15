import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import StudentSidebar from "./StudentSidebar";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { OneStopLogo } from "@/components/layout/PublicNavbar";

export default function StudentLayout({ children, requireAuth = true }) {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(36,33%,97%)]">
        <div className="w-8 h-8 border-3 border-[hsl(252,50%,55%)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: pathname }} replace />;
  }

  return (
    <div className="flex h-screen bg-[hsl(36,33%,97%)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <StudentSidebar />
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
              <StudentSidebar />
            </SheetContent>
          </Sheet>
          <OneStopLogo />
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
