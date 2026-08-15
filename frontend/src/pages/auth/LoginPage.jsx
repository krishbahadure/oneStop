import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, User, Mail, Lock, Sparkles, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { OneStopLogo } from "@/components/layout/PublicNavbar";
import toast from "react-hot-toast";

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

export default function LoginPage() {
  const { t }                   = useTranslation();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const { login }              = useAuth();
  const navigate                = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error(t("login_error_empty")); return; }
    setLoading(true);
    const { success, user, error } = await login(email, password);
    setLoading(false);
    if (!success) { toast.error(error || t("login_error_failed")); return; }
    toast.success(t("login_success"));
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    const { success, user, error } = await login("student@onestop.jk", "Student@123");
    setLoading(false);
    if (!success) { toast.error(error || t("login_error_demo")); return; }
    toast.success(t("login_success_student"));
    navigate("/dashboard");
  };

  const handleAdminDemo = async () => {
    setLoading(true);
    const { success, user, error } = await login("admin@onestop.jk", "Admin@123");
    setLoading(false);
    if (!success) { toast.error(error || t("login_error_demo")); return; }
    toast.success(t("login_success_admin"));
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-[hsl(36,33%,97%)] flex items-center justify-center px-4">
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
          <h1 className="text-2xl font-black text-[hsl(226,64%,14%)] text-center mb-1">{t("login_title")}</h1>
          <p className="text-sm text-[hsl(220,14%,50%)] text-center mb-7">{t("login_subtitle")}</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[hsl(226,50%,20%)] mb-1.5">{t("login_email")}</label>
              <InputField
                icon={Mail}
                type="email"
                placeholder={t("login_email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[hsl(226,50%,20%)]">{t("login_password")}</label>
                <Link to="#" className="text-xs text-[hsl(252,50%,45%)] hover:underline">{t("login_forgot_password")}</Link>
              </div>
              <InputField
                icon={Lock}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                right={
                  <button type="button" onClick={() => setShowPass(!showPass)} className="text-[hsl(220,14%,55%)] hover:text-[hsl(226,64%,20%)]">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg font-bold text-sm bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white transition-colors mt-1 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("login_signing_in")}</>
                : t("login_btn")}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[hsl(220,18%,91%)]" /></div>
            <div className="relative flex justify-center text-xs text-[hsl(220,14%,55%)]"><span className="bg-white px-3">{t("login_or")}</span></div>
          </div>

          {/* Demo logins */}
          <div className="space-y-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleDemo}
              className="w-full h-11 rounded-lg font-bold text-sm border-2 border-dashed border-[hsl(252,50%,80%)] text-[hsl(252,50%,45%)] hover:bg-[hsl(252,60%,98%)] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4 text-[hsl(44,70%,50%)]" />
              {t("login_demo_student")}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleAdminDemo}
              className="w-full h-11 rounded-lg font-bold text-sm border-2 border-dashed border-[hsl(226,50%,75%)] text-[hsl(226,64%,25%)] hover:bg-[hsl(226,60%,97%)] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Shield className="h-4 w-4 text-[hsl(226,64%,35%)]" />
              {t("login_demo_admin")}
            </button>
          </div>

          <p className="text-center text-xs text-[hsl(220,14%,50%)] mt-6">
            {t("login_no_account")}{" "}
            <Link to="/register" className="text-[hsl(252,50%,45%)] font-semibold hover:underline">{t("login_create_account")}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
