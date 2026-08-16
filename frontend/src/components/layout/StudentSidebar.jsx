import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, User, ClipboardList, Star, BookOpen,
  Briefcase, Building2, Award, Calendar, Library,
  LogOut, LogIn, Map,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { OneStopLogo } from "@/components/layout/PublicNavbar";
import LanguageSelector from "@/components/common/LanguageSelector";
import toast from "react-hot-toast";

const navConfig = [
  { key: "dashboard",       defaultLabel: "Dashboard",          href: "/dashboard",        icon: LayoutDashboard },
  { key: "roadmap",         defaultLabel: "My Roadmap",         href: "/roadmap",          icon: Map },
  { key: "profile",         defaultLabel: "My Profile",         href: "/profile",          icon: User },
  { key: "assessment",      defaultLabel: "Assessment",         href: "/assessment",       icon: ClipboardList },
  { key: "recommendations", defaultLabel: "Recommendations",    href: "/recommendations",  icon: Star },
  { key: "courses",         defaultLabel: "Courses",            href: "/courses",          icon: BookOpen },
  { key: "careers",         defaultLabel: "Career Paths",       href: "/careers",          icon: Briefcase },
  { key: "colleges",        defaultLabel: "Colleges",           href: "/colleges",         icon: Building2 },
  { key: "scholarships",    defaultLabel: "Scholarships",       href: "/scholarships",     icon: Award },
  { key: "timeline",        defaultLabel: "Admission Timeline", href: "/timeline",         icon: Calendar },
  { key: "resources",       defaultLabel: "Learning Resources", href: "/resources",        icon: Library },
];

export default function StudentSidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success(t("logout_success", "Logged out successfully"));
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "S";

  return (
    <aside className="flex flex-col h-full w-64 bg-white border-r border-[hsl(220,18%,90%)]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[hsl(220,18%,92%)]">
        <OneStopLogo linkTo="/dashboard" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 hide-scrollbar">
        {navConfig.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

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
              <Icon
                className={cn(
                  "h-4 w-4 flex-shrink-0 transition-colors",
                  active ? "text-[hsl(252,50%,45%)]" : "text-[hsl(220,14%,52%)]"
                )}
              />
              <span className="flex-1 truncate">{t(item.key, item.defaultLabel)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Language Switcher in Sidebar */}
      <div className="px-4 py-2 border-t border-[hsl(220,18%,94%)] flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[hsl(220,14%,50%)] uppercase tracking-wider">
          {t("language", "Language")}
        </span>
        <LanguageSelector variant="compact" direction="up" />
      </div>

      {/* User area */}
      <div className="border-t border-[hsl(220,18%,92%)] p-3 space-y-1">
        {/* Profile row */}
        <div 
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors",
            !user ? "cursor-pointer hover:bg-[hsl(36,20%,95%)]" : "cursor-default hover:bg-[hsl(36,20%,95%)]"
          )}
          onClick={() => !user && navigate("/login")}
        >
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-[hsl(252,60%,94%)] text-[hsl(252,50%,45%)] text-xs font-bold">
              {user ? initials : "G"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[hsl(226,50%,14%)] truncate leading-tight">
              {user?.name || t("sidebar_guest", "Guest")}
            </p>
            <p className="text-[10px] text-[hsl(220,14%,50%)] truncate leading-tight">
              {user ? `${t("register_class_prefix", "Class")} ${user?.class || "12"} · ${user?.stream || "Science"}` : t("sidebar_sign_in", "Sign in to personalize")}
            </p>
          </div>

        </div>

        {/* Logout / Login */}
        {user ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-2.5 text-[hsl(220,14%,50%)] hover:text-red-600 hover:bg-red-50 px-3 font-medium text-sm rounded-xl cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            {t("logout", "Logout")}
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/login")}
            className="w-full justify-start gap-2.5 text-[hsl(226,64%,20%)] hover:text-[hsl(226,64%,20%)] hover:bg-[hsl(36,20%,95%)] px-3 font-medium text-sm rounded-xl cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            {t("login", "Login")}
          </Button>
        )}
      </div>
    </aside>
  );
}

