import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Building2, BookOpen, Award,
  Calendar, BarChart3, LogOut, Users, Briefcase, Library
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OneStopLogo } from "@/components/layout/PublicNavbar";
import LanguageSelector from "@/components/common/LanguageSelector";
import { useAuth } from "@/hooks/useAuth";

const adminNavConfig = [
  { key: "overview",     defaultLabel: "Overview",     href: "/admin",               icon: LayoutDashboard, exact: true },
  { key: "students",     defaultLabel: "Students",     href: "/admin/students",       icon: Users },
  { key: "colleges",     defaultLabel: "Colleges",     href: "/admin/colleges",       icon: Building2 },
  { key: "courses",      defaultLabel: "Courses",      href: "/admin/courses",        icon: BookOpen },
  { key: "careers",      defaultLabel: "Careers",      href: "/admin/careers",        icon: Briefcase },
  { key: "scholarships", defaultLabel: "Scholarships", href: "/admin/scholarships",   icon: Award },
  { key: "timeline",     defaultLabel: "Timeline",     href: "/admin/timeline",       icon: Calendar },
  { key: "resources",    defaultLabel: "Resources",    href: "/admin/resources",      icon: Library },
  { key: "analytics",    defaultLabel: "Analytics",    href: "/admin/analytics",      icon: BarChart3 },
];

export default function AdminSidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <aside className="flex flex-col h-full w-64 bg-white border-r border-[hsl(220,18%,90%)]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[hsl(220,18%,92%)]">
        <OneStopLogo linkTo="/admin" />
        <span className="text-[9px] font-semibold text-[hsl(220,14%,50%)] mt-1.5 block">
          {t("adminPortal", "Admin Portal")}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {adminNavConfig.map((item) => {
          const Icon = item.icon;
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "nav-active"
                  : "text-[hsl(220,14%,45%)] hover:text-[hsl(226,64%,20%)] hover:bg-[hsl(36,20%,95%)]"
              )}
            >
              <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-[hsl(252,50%,45%)]" : "text-[hsl(220,14%,52%)]")} />
              {t(item.key, item.defaultLabel)}
            </Link>
          );
        })}
      </nav>

      {/* Language Switcher */}
      <div className="px-4 py-2 border-t border-[hsl(220,18%,94%)] flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[hsl(220,14%,50%)] uppercase tracking-wider">
          {t("language", "Language")}
        </span>
        <LanguageSelector variant="compact" direction="up" />
      </div>

      {/* Footer */}
      <div className="border-t border-[hsl(220,18%,92%)] p-3">
        <div className="px-3 py-1 text-xs text-[hsl(220,14%,55%)] mb-1 font-medium">{user?.name || "Admin"}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full justify-start gap-2.5 text-[hsl(220,14%,50%)] hover:text-red-600 hover:bg-red-50 px-3 rounded-xl cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          {t("logout", "Logout")}
        </Button>
      </div>
    </aside>
  );
}


