import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LanguageSelector from "@/components/common/LanguageSelector";
import { cn } from "@/lib/utils";

/* ─── Logo component — used in navbar + sidebar ─── */
export function OneStopLogo({ size = "md", linkTo = "/" }) {
  const { t } = useTranslation();
  const textSize  = size === "lg" ? "text-xl"  : "text-base";
  const subSize   = size === "lg" ? "text-[10px]" : "text-[9px]";
  const iconSize  = size === "lg" ? "text-2xl"  : "text-lg";
  const wrapSize  = size === "lg" ? "w-10 h-10" : "w-9 h-9";

  return (
    <Link to={linkTo} className="flex items-center gap-2.5 group select-none">
      {/* Icon: black rounded square with cap emoji */}
      <div className={`${wrapSize} rounded-xl bg-[hsl(226,64%,14%)] flex items-center justify-center flex-shrink-0 shadow-sm`}>
        <span className={`${iconSize} leading-none`} role="img" aria-label="graduation cap">🎓</span>
      </div>
      <div className="leading-none">
        <span className={`${textSize} font-black tracking-tight text-[hsl(226,64%,14%)] block leading-none`}>
          ONE STOP
        </span>
        <span className={`${subSize} font-medium text-[hsl(220,14%,50%)] block mt-0.5 leading-tight`}>
          {t("tagline", "Personalized Career & Education Advisor")}
        </span>
      </div>
    </Link>
  );
}

export default function PublicNavbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: t("landing_nav_how_it_works", "How It Works"), href: "/#how-it-works" },
    { label: t("landing_nav_journey", "The Journey"),       href: "/#journey" },
    { label: t("landing_nav_for_jk", "For J&K"),            href: "/#for-jk" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/98 backdrop-blur-md border-b border-[hsl(220,18%,90%)] shadow-sm"
          : "bg-white/90 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <OneStopLogo />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[hsl(220,14%,40%)] hover:text-[hsl(226,64%,20%)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="text-[hsl(220,14%,40%)] hover:text-[hsl(226,64%,20%)] hover:bg-[hsl(36,33%,94%)] text-sm font-medium"
            >
              {t("login", "Login")}
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/register")}
              className="bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white font-semibold px-5 rounded-lg shadow-sm"
            >
              {t("getStarted", "Get Started")}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSelector variant="compact" />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-[hsl(226,64%,20%)] hover:bg-[hsl(36,33%,94%)]">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-white">
                <div className="mb-8 mt-2">
                  <OneStopLogo />
                </div>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium text-[hsl(220,14%,40%)] hover:text-[hsl(226,64%,20%)] hover:bg-[hsl(36,33%,94%)] px-3 py-2.5 rounded-lg transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
                <div className="flex flex-col gap-2 mt-8">
                  <Button variant="outline" className="border-[hsl(220,18%,88%)]" onClick={() => { navigate("/login"); setOpen(false); }}>
                    {t("login", "Login")}
                  </Button>
                  <Button className="bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white" onClick={() => { navigate("/register"); setOpen(false); }}>
                    {t("getStarted", "Get Started")}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

