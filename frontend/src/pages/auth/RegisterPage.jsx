import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { OneStopLogo } from "@/components/layout/PublicNavbar";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const districts = ["Srinagar","Baramulla","Anantnag","Jammu","Kupwara","Pulwama","Budgam","Bandipora","Ganderbal","Kulgam","Shopian","Doda","Poonch","Rajouri","Udhampur","Kathua","Reasi","Samba","Kishtwar","Ramban"];


function InputField({ icon: Icon, type = "text", placeholder, value, onChange, right }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[hsl(220,14%,60%)]">
        <Icon className="h-4 w-4" />
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-11 pl-10 pr-10 border border-[hsl(220,18%,88%)] rounded-lg text-sm text-[hsl(226,50%,14%)] bg-white placeholder:text-[hsl(220,14%,65%)] focus:outline-none focus:border-[hsl(252,50%,60%)] transition-colors"
      />
      {right && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{right}</span>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const navigate       = useNavigate();
  const { register }   = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", class: "", stream: "", district: "" });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.class || !form.stream || !form.district) {
      toast.error(t("register_error_fields", "Please fill in all fields")); return;
    }
    if (form.password.length < 6) { toast.error(t("register_error_password", "Password must be at least 6 characters")); return; }
    setLoading(true);
    const { success, error } = await register({ name: form.name, email: form.email, password: form.password });
    setLoading(false);
    if (!success) { toast.error(error || t("register_error_failed", "Registration failed")); return; }
    toast.success(t("register_success", "Account created! Let's set up your profile."));
    navigate("/profile");
  };

  const selectCls = "h-11 border-[hsl(220,18%,88%)] bg-white text-sm text-[hsl(226,50%,14%)] focus:border-[hsl(252,50%,60%)] rounded-lg";

  return (
    <div className="min-h-screen bg-[hsl(36,33%,97%)] flex items-center justify-center px-4 py-10">
      {/* Subtle background blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[hsl(252,60%,94%)] opacity-60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-[hsl(158,50%,91%)] opacity-50 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo centered */}
        <div className="flex justify-center mb-6">
          <OneStopLogo size="lg" linkTo="/" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] shadow-sm p-8">
          <h1 className="text-2xl font-black text-[hsl(226,64%,14%)] text-center mb-1">{t("register_title", "Create your account")}</h1>
          <p className="text-sm text-[hsl(220,14%,50%)] text-center mb-7">{t("register_subtitle", "Join thousands of students in J&K")}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[hsl(226,50%,20%)] mb-1.5">{t("register_name_label", "Full Name")}</label>
              <InputField
                icon={User}
                placeholder={t("register_name_placeholder", "Your full name")}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[hsl(226,50%,20%)] mb-1.5">{t("register_email_label", "Email")}</label>
              <InputField
                icon={Mail}
                type="email"
                placeholder={t("register_email_placeholder", "you@example.com")}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[hsl(226,50%,20%)] mb-1.5">{t("register_password_label", "Password")}</label>
              <InputField
                icon={Lock}
                type={showPass ? "text" : "password"}
                placeholder={t("register_password_placeholder", "Min. 6 characters")}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                right={
                  <button type="button" onClick={() => setShowPass(!showPass)} className="text-[hsl(220,14%,55%)] hover:text-[hsl(226,64%,20%)]">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            {/* Class & Stream */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[hsl(226,50%,20%)] mb-1.5">{t("register_class_label", "Class")}</label>
                <Select onValueChange={(v) => set("class", v)}>
                  <SelectTrigger className={selectCls}><SelectValue placeholder={t("register_select", "Select")} /></SelectTrigger>
                  <SelectContent>
                    {["9","10","11","12","Graduate"].map((c) => <SelectItem key={c} value={c}>{t("register_class_prefix", "Class")} {c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[hsl(226,50%,20%)] mb-1.5">{t("register_stream_label", "Stream")}</label>
                <Select onValueChange={(v) => set("stream", v)}>
                  <SelectTrigger className={selectCls}><SelectValue placeholder={t("register_select", "Select")} /></SelectTrigger>
                  <SelectContent>
                    {["Science","Commerce","Arts","Not Selected"].map((s) => <SelectItem key={s} value={s}>{t(`stream_${s.replace(/\s/g,"_")}`, s)}</SelectItem>)}

                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-semibold text-[hsl(226,50%,20%)] mb-1.5">{t("register_district_label", "District")}</label>
              <Select onValueChange={(v) => set("district", v)}>
                <SelectTrigger className={selectCls}><SelectValue placeholder={t("register_select_district", "Select your district")} /></SelectTrigger>
                <SelectContent>
                  {districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* CTA — matching login button color */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg font-bold text-sm bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white transition-colors mt-1 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("register_submitting", "Creating account...")}</>
                : t("register_submit", "Create Account")}
            </button>
          </form>

          <p className="text-center text-xs text-[hsl(220,14%,50%)] mt-5">
            {t("register_already", "Already have an account?")}{" "}
            <Link to="/login" className="text-[hsl(252,50%,45%)] font-semibold hover:underline">{t("register_signin", "Sign in")}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
