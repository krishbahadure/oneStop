import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import PublicNavbar from "@/components/layout/PublicNavbar";
import Footer from "@/components/landing/Footer";
import {
  BookOpen, Building2, Briefcase, Award,
  ArrowRight, CheckCircle2, Brain, Star,
  Map, GitCompare, Calendar, BookMarked,
} from "lucide-react";

/* ─── Data ──────────────────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const journey = [
    { num: "01", icon: Brain,      title: t("landing_journey1_title"),   desc: t("landing_journey1_desc"), chip: "chip-lavender" },
    { num: "02", icon: Star,       title: t("landing_journey2_title"),       desc: t("landing_journey2_desc"), chip: "chip-mint"     },
    { num: "03", icon: Building2,  title: t("landing_journey3_title"),     desc: t("landing_journey3_desc"),         chip: "chip-yellow"  },
    { num: "04", icon: Calendar,   title: t("landing_journey4_title"),     desc: t("landing_journey4_desc"),     chip: "chip-blue"    },
  ];

  const features = [
    { icon: Brain,      title: t("landing_feature1_title"),   desc: t("landing_feature1_desc"),       chip: "chip-lavender" },
    { icon: Star,       title: t("landing_feature2_title"),      desc: t("landing_feature2_desc"),                 chip: "chip-mint"     },
    { icon: Map,        title: t("landing_feature3_title"),           desc: t("landing_feature3_desc"),                  chip: "chip-blue"     },
    { icon: Building2,  title: t("landing_feature4_title"),         desc: t("landing_feature4_desc"),         chip: "chip-yellow"   },
    { icon: GitCompare, title: t("landing_feature5_title"),                desc: t("landing_feature5_desc"),     chip: "chip-orange"   },
    { icon: Award,      title: t("landing_feature6_title"),                      desc: t("landing_feature6_desc"),            chip: "chip-peach"    },
    { icon: Calendar,   title: t("landing_feature7_title"),                desc: t("landing_feature7_desc"),        chip: "chip-orange"   },
    { icon: BookMarked, title: t("landing_feature8_title"),                desc: t("landing_feature8_desc"), chip: "chip-lavender" },
  ];

  /* Feature chips shown alongside the illustration */
  const heroFeatureCards = [
    { icon: BookOpen,  label: t("courses"),      chip: "chip-lavender" },
    { icon: Building2, label: t("colleges"),     chip: "chip-mint"     },
    { icon: Briefcase, label: t("careers"),      chip: "chip-yellow"   },
    { icon: Award,     label: t("scholarships"), chip: "chip-blue"     },
  ];

  return (
    <div className="min-h-screen bg-[hsl(36,33%,97%)]">
      <PublicNavbar />

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative pt-20 pb-0 overflow-hidden bg-[hsl(36,33%,97%)] min-h-[560px]">

        {/* Decorative squiggles / shapes — match reference */}
        {/* Yellow squiggle top-left */}
        <svg className="absolute top-24 left-8 w-10 h-10 text-[hsl(44,90%,65%)] opacity-80" viewBox="0 0 40 40" fill="none">
          <path d="M5 20 Q10 5 20 20 Q30 35 35 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
        </svg>
        {/* Teal swirl bottom-left */}
        <svg className="absolute bottom-32 left-16 w-14 h-14 text-[hsl(180,55%,55%)] opacity-60" viewBox="0 0 50 50" fill="none">
          <path d="M25 45 Q5 35 10 20 Q15 5 30 10 Q45 15 40 30 Q35 45 20 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>
        {/* Plus signs scattered */}
        {[
          { top: "28%", left: "38%", size: "text-[hsl(252,50%,75%)]" },
          { top: "60%", left: "55%", size: "text-[hsl(44,70%,65%)]"  },
          { top: "20%", right: "8%", size: "text-[hsl(158,45%,60%)]" },
          { top: "75%", right: "18%", size: "text-[hsl(252,50%,75%)]" },
        ].map((p, i) => (
          <span
            key={i}
            className={`absolute text-xl font-bold ${p.size} opacity-70 select-none pointer-events-none`}
            style={{ top: p.top, left: p.left, right: p.right }}
          >
            +
          </span>
        ))}

        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-6 items-end">

            {/* ── LEFT: text ───────────────────────────── */}
            <motion.div
              className="pt-10 pb-16"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
            >
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(44,90%,92%)] text-[hsl(44,55%,38%)] text-sm font-semibold mb-7 border border-[hsl(44,70%,82%)]">
                <span className="text-base">✦</span>
                <span>{t("landing_hero_badge")}</span>
              </div>

              {/* Headline — two lines, second in lavender */}
              <h1 className="text-5xl sm:text-6xl font-black text-[hsl(226,64%,12%)] leading-[1.05] mb-6">
                {t("landing_hero_title_1")}
                <br />
                <span className="text-[hsl(252,50%,58%)]">{t("landing_hero_title_2")}</span>
              </h1>

              <p className="text-[hsl(220,14%,40%)] text-base leading-relaxed mb-10 max-w-[440px]">
                {t("landing_hero_desc")}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate("/register")}
                  className="bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white font-bold px-8 h-12 rounded-xl shadow-md text-sm"
                >
                  {t("getStarted")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/colleges")}
                  className="border-[hsl(220,18%,82%)] text-[hsl(226,64%,20%)] hover:bg-[hsl(36,25%,94%)] h-12 px-6 rounded-xl font-semibold text-sm"
                >
                  {t("landing_btn_explore_colleges")} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* ── RIGHT: Student illustration + floating chips ── */}
            <motion.div
              className="relative flex items-end justify-center lg:justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {/* Lavender background circle */}
              <div
                className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full"
                style={{ background: "hsl(252,60%,93%)", bottom: "-20px", right: "-20px" }}
              />

              {/* Student boy illustration */}
              <div className="relative z-10">
                <img
                  src="/hero-student.png"
                  alt="Student with backpack"
                  className="h-[420px] w-auto object-contain object-bottom select-none"
                  draggable={false}
                />

                {/* Vertical post / signpost line */}
                <div className="absolute right-8 top-8 bottom-0 w-1 bg-[hsl(226,30%,70%)] rounded-full z-0" />

                {/* Floating feature cards — stacked vertically along the post */}
                <div className="absolute right-[-60px] top-16 space-y-2.5 z-20">
                  {heroFeatureCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.label}
                        className="flex items-center gap-2.5 bg-white border border-[hsl(220,18%,90%)] rounded-xl px-3.5 py-2.5 shadow-md"
                        animate={{ x: [0, i % 2 === 0 ? -3 : 3, 0] }}
                        transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${card.chip}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm font-semibold text-[hsl(226,50%,14%)] whitespace-nowrap">{card.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── JOURNEY ──────────────────────────────────── */}
      <section id="journey" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div className="text-center mb-14" {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-black text-[hsl(226,64%,14%)] mb-3">
              {t("landing_journey_heading")}
            </h2>
            <p className="text-[hsl(220,14%,45%)] text-base max-w-xl mx-auto">
              {t("landing_journey_subheading")}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {journey.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.chip}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-3xl font-black text-[hsl(220,14%,91%)] select-none">{item.num}</span>
                  </div>
                  <h3 className="font-bold text-base text-[hsl(226,64%,14%)] mb-2">{item.title}</h3>
                  <p className="text-sm text-[hsl(220,14%,45%)] leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-[hsl(36,33%,97%)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div className="text-center mb-14" {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-black text-[hsl(226,64%,14%)] mb-3">
              {t("landing_features_heading")}
            </h2>
            <p className="text-[hsl(220,14%,45%)] text-base max-w-xl mx-auto">
              {t("landing_features_subheading")}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="bg-white border border-[hsl(220,18%,91%)] rounded-2xl p-5 hover:shadow-sm transition-shadow"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.chip}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-[hsl(226,64%,14%)] mb-1.5">{f.title}</h3>
                  <p className="text-xs text-[hsl(220,14%,48%)] leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── J&K SECTION ──────────────────────────────── */}
      <section id="for-jk" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="bg-[hsl(226,64%,20%)] rounded-3xl p-10 lg:p-14 grid lg:grid-cols-2 gap-12 items-center overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[hsl(252,50%,55%)] opacity-10 blur-3xl pointer-events-none" />
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 border border-white/15">
                {t("landing_jk_badge")}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">
                {t("landing_jk_heading")}
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-8">
                {t("landing_jk_desc")}
              </p>
              <Button
                size="lg"
                className="bg-white text-[hsl(226,64%,20%)] hover:bg-[hsl(36,33%,97%)] font-bold px-8 h-12 rounded-xl shadow-sm"
                onClick={() => navigate("/register")}
              >
                {t("landing_btn_start_journey")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {[
                t("landing_jk_point1"),
                t("landing_jk_point2"),
                t("landing_jk_point3"),
                t("landing_jk_point4"),
                t("landing_jk_point5"),
                t("landing_jk_point6"),
              ].map((p) => (
                <div key={p} className="flex items-start gap-2.5 bg-white/8 backdrop-blur-sm border border-white/12 rounded-xl p-4">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(158,70%,65%)] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white/80 leading-relaxed">{p}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────── */}
      <section className="py-20 bg-[hsl(36,33%,97%)]">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <motion.div {...fadeUp}>
            <div className="w-16 h-16 rounded-2xl chip-lavender flex items-center justify-center mx-auto mb-7 text-3xl">
              🎓
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[hsl(226,64%,14%)] mb-4 leading-tight">
              {t("landing_cta_heading")}
            </h2>
            <p className="text-[hsl(220,14%,45%)] mb-9 text-base">
              {t("landing_cta_subheading")}
            </p>
            <Button
              size="lg"
              className="bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white font-bold px-10 h-13 text-base rounded-xl shadow-md"
              onClick={() => navigate("/register")}
            >
              {t("landing_btn_get_started_free")}
            </Button>
            <p className="text-xs text-[hsl(220,14%,55%)] mt-4">{t("landing_cta_no_login")}</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
