import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StudentLayout from "@/components/layout/StudentLayout";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { ArrowRight, User, BookOpen, Heart, Target, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/client";

const districts = ["Srinagar","Baramulla","Anantnag","Jammu","Kupwara","Pulwama","Budgam","Bandipora","Ganderbal","Kulgam","Shopian","Doda","Poonch","Rajouri","Udhampur","Kathua","Reasi","Samba","Kishtwar","Ramban"];

const interests = [
  "Technology", "Mathematics", "Business", "Arts", "Science",
  "Social Science", "Creativity", "Communication",
];

const subjects = ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "English", "Economics", "History", "Geography", "Political Science", "Business Studies", "Accountancy"];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const steps = [
    { id: "personal", label: t("prof_step_personal"), icon: User },
    { id: "academic", label: t("prof_step_academic"), icon: BookOpen },
    { id: "interests", label: t("prof_step_interests"), icon: Heart },
    { id: "career", label: t("prof_step_career"), icon: Target },
  ];
  
  const careerPrefs = [
    { id: "government", label: t("prof_career_gov"), icon: "🏛️" },
    { id: "private", label: t("prof_career_pvt"), icon: "💼" },
    { id: "entrepreneurship", label: t("prof_career_ent"), icon: "🚀" },
    { id: "higher-studies", label: t("prof_career_higher"), icon: "🎓" },
    { id: "not-sure", label: t("prof_career_not_sure"), icon: "🤔" },
  ];

  const [form, setForm] = useState({
    name: user?.name || "",
    age: user?.age || "",
    gender: user?.gender || "",
    district: user?.district || "",
    class: user?.class || "",
    stream: user?.stream || "",
    marks: user?.marks || "",
    subjects: user?.subjects || [],
    interests: user?.interests || [],
    careerPreference: user?.careerPreference || "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const toggleArr = (key, val) => {
    setForm((p) => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter((x) => x !== val) : [...p[key], val],
    }));
  };

  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    if (step < steps.length - 1) { setStep(step + 1); return; }
    setSaving(true);
    const payload = {
      district: form.district,
      class_12_stream: form.stream,
      class_12_percent: parseFloat(form.marks) || null,
      gender: form.gender,
      interested_streams: form.interests,
      career_goals: form.careerPreference,
    };
    const { error } = await api.put('/profile', payload);
    setSaving(false);
    if (error) { toast.error(error); return; }
    updateProfile(form);
    toast.success(t("prof_saved"));
    navigate("/assessment");
  };

  return (
    <StudentLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)] py-10 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black mb-2">{t("prof_title")}</h1>
            <p className="text-muted-foreground">{t("prof_subtitle")}</p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const done = i < step;
              const active = i === step;
              return (
                <div key={s.id} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    done ? "bg-blue-600 text-white" : active ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-white border-2 border-[hsl(220,18%,91%)] text-muted-foreground"
                  )}>
                    {done ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={cn("text-[10px] font-medium hidden sm:block", active ? "text-[hsl(252,50%,45%)]" : "text-muted-foreground")}>{s.label}</span>
                  {i < steps.length - 1 && (
                    <div className={cn("h-0.5 absolute w-full", done ? "bg-blue-600" : "bg-border")} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form Card */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] shadow-sm p-8"
          >
            {/* Step 0: Personal */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold">{t("prof_personal_info")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="prof-name">{t("prof_full_name")}</Label>
                    <Input id="prof-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={t("prof_name_placeholder")} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="prof-age">{t("prof_age")}</Label>
                    <Input id="prof-age" type="number" value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="18" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("prof_gender")}</Label>
                    <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                      <SelectTrigger className="h-11"><SelectValue placeholder={t("prof_select")} /></SelectTrigger>
                      <SelectContent>
                        {[{v:"Male", k:"prof_gender_male"}, {v:"Female", k:"prof_gender_female"}, {v:"Other", k:"prof_gender_other"}, {v:"Prefer not to say", k:"prof_gender_prefer_not_to_say"}].map((g) => (
                          <SelectItem key={g.v} value={g.v}>{t(g.k)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("prof_district")}</Label>
                    <Select value={form.district} onValueChange={(v) => set("district", v)}>
                      <SelectTrigger className="h-11"><SelectValue placeholder={t("prof_district_placeholder")} /></SelectTrigger>
                      <SelectContent>
                        {districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Academic */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold">{t("prof_academic_info")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{t("prof_class")}</Label>
                    <Select value={form.class} onValueChange={(v) => set("class", v)}>
                      <SelectTrigger className="h-11"><SelectValue placeholder={t("prof_class_placeholder")} /></SelectTrigger>
                      <SelectContent>
                        {["9", "10", "11", "12", "Graduate"].map((c) => <SelectItem key={c} value={c}>{t("prof_class")} {c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("prof_stream")}</Label>
                    <Select value={form.stream} onValueChange={(v) => set("stream", v)}>
                      <SelectTrigger className="h-11"><SelectValue placeholder={t("prof_stream_placeholder")} /></SelectTrigger>
                      <SelectContent>
                      {["Science", "Commerce", "Arts", "Not Selected"].map((s) => <SelectItem key={s} value={s}>{t(`stream_${s.replace(/\s/g,"_")}`, s)}</SelectItem>)}

                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="prof-marks">{t("prof_marks")}</Label>
                    <Input id="prof-marks" type="number" value={form.marks} onChange={(e) => set("marks", e.target.value)} placeholder="e.g. 85" className="h-11 max-w-40" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("prof_subjects")}</Label>
                  <div className="flex flex-wrap gap-2">
                      {subjects.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleArr("subjects", s)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                            form.subjects.includes(s)
                              ? "bg-[hsl(226,64%,20%)] text-white border-[hsl(226,64%,20%)]"
                              : "bg-white text-muted-foreground border-[hsl(220,18%,91%)] hover:border-blue-300"
                          )}
                        >
                          {t(`subject_${s.replace(/\s/g,"")}`, s)}
                        </button>
                      ))}

                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Interests */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold">{t("prof_interests_title")}</h2>
                <p className="text-muted-foreground text-sm">{t("prof_interests_desc")}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleArr("interests", interest)}
                      className={cn(
                        "py-4 px-3 rounded-xl border-2 text-sm font-medium transition-all flex flex-col items-center gap-2",
                        form.interests.includes(interest)
                          ? "border-blue-600 bg-[hsl(252,60%,96%)] text-[hsl(226,64%,20%)]"
                          : "border-[hsl(220,18%,91%)] bg-white text-muted-foreground hover:border-[hsl(252,50%,75%)]"
                      )}
                    >
                      <span className="text-xl">
                        {["💻","📐","💼","🎨","🔬","🌍","✨","📣"][interests.indexOf(interest)]}
                      </span>
                      {t(`interest_${interest.replace(/\s/g,"")}`, interest)}
                    </button>
                  ))}

                </div>
              </div>
            )}

            {/* Step 3: Career Preferences */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold">{t("prof_career_title")}</h2>
                <p className="text-muted-foreground text-sm">{t("prof_career_desc")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {careerPrefs.map((pref) => (
                    <button
                      key={pref.id}
                      type="button"
                      onClick={() => set("careerPreference", pref.id)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                        form.careerPreference === pref.id
                          ? "border-blue-600 bg-[hsl(252,60%,96%)]"
                          : "border-[hsl(220,18%,91%)] bg-white hover:border-[hsl(252,50%,75%)]"
                      )}
                    >
                      <span className="text-2xl">{pref.icon}</span>
                      <span className={cn("font-semibold text-sm", form.careerPreference === pref.id ? "text-[hsl(226,64%,20%)]" : "text-foreground")}>
                        {pref.label}
                      </span>
                      {form.careerPreference === pref.id && (
                        <CheckCircle className="ml-auto h-4 w-4 text-[hsl(252,50%,45%)]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              {t("prof_back")}
            </Button>
            <div className="text-xs text-muted-foreground">{t("prof_step")} {step + 1} {t("prof_of")} {steps.length}</div>
            <Button
              onClick={handleNext}
              className="bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] font-semibold"
            >
              {step === steps.length - 1 ? t("prof_continue") : t("prof_next")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
