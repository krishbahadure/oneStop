import { Link } from "react-router-dom";
import { GraduationCap, Mail, Send, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Courses",      href: "/courses" },
  { label: "Careers",      href: "/careers" },
  { label: "Colleges",     href: "/colleges" },
  { label: "Scholarships", href: "/scholarships" },
];

const studentLinks = [
  { label: "Take Assessment",     href: "/assessment" },
  { label: "Browse Colleges",     href: "/colleges" },
  { label: "Find Scholarships",   href: "/scholarships" },
  { label: "Admission Timeline",  href: "/timeline" },
  { label: "Learning Resources",  href: "/resources" },
];

export default function Footer() {
  return (
    <footer className="bg-[hsl(226,45%,12%)] text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <GraduationCap className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <span className="font-black text-base block leading-none tracking-tight">ONE STOP</span>
                <span className="text-[9px] text-white/50 font-medium">Personalized Career & Education Advisor</span>
              </div>
            </div>
            <p className="text-white/55 text-sm leading-relaxed max-w-sm">
              Helping students in Jammu & Kashmir discover the right path through
              personalized career guidance, college exploration, and scholarship opportunities.
            </p>
            <div className="flex items-center gap-2.5 mt-5">
              {[MessageSquare, Send, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-white/55 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">For Students</h4>
            <ul className="space-y-2.5">
              {studentLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-white/55 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-white/10 my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
          <p>© 2026 One Stop. All rights reserved. Prototype — Not a government product.</p>
          <p>Built for students in <span className="text-white/60 font-medium">Jammu & Kashmir</span></p>
        </div>
      </div>
    </footer>
  );
}
