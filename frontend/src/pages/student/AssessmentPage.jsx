import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import StudentLayout from "@/components/layout/StudentLayout";
import { useAuth } from "@/hooks/useAuth";
import { useApiData } from "@/hooks/useApiData";
import { PageLoader, PageError } from "@/components/common/PageStates";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/client";

const STORAGE_KEY = "onestop_assessment_answers";

export default function AssessmentPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { completeAssessment } = useAuth();
  const { data: questions, loading, error, refetch } = useApiData("/assessment/questions");

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
  });
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Persist answers to localStorage as student answers (offline-safe)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  if (loading) return <StudentLayout><PageLoader message={t("assess_loading")} /></StudentLayout>;
  if (error) return <StudentLayout><PageError error={error} onRetry={refetch} /></StudentLayout>;
  if (!questions?.length) return <StudentLayout><PageLoader message={t("assess_no_questions")} /></StudentLayout>;

  const total = questions.length;
  const question = questions[current];
  const progress = ((current + 1) / total) * 100;
  const selected = answers[question.id];

  const selectAnswer = (optionId) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  };

  const goNext = () => {
    if (!selected) { toast.error(t("assess_select_error")); return; }
    setDirection(1);
    if (current < total - 1) setCurrent(current + 1);
    else handleSubmit();
  };

  const goPrev = () => {
    if (current === 0) return;
    setDirection(-1);
    setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error: submitError } = await api.post("/assessment/submit", { answers });
    if (submitError) {
      toast.error(submitError);
      setSubmitting(false);
      return;
    }
    completeAssessment();
    localStorage.removeItem(STORAGE_KEY); // clear draft once submitted
    toast.success(t("assess_complete_toast"));
    setTimeout(() => navigate("/assessment/results"), 800);
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <StudentLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)] flex flex-col">
        {/* Header with Progress */}
        <div className="bg-white border-b border-[hsl(220,18%,91%)] px-6 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="font-bold text-sm text-foreground">{t("assess_title")}</h1>
                <p className="text-xs text-muted-foreground">{question.category}</p>
              </div>
              <span className="text-sm font-semibold text-muted-foreground">
                {current + 1} <span className="text-muted-foreground/50">/ {total}</span>
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[hsl(220,18%,93%)] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[hsl(252,50%,55%)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Question area */}
        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -50 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-[hsl(252,60%,96%)] text-[hsl(226,64%,20%)] px-3 py-1 rounded-full text-xs font-semibold mb-4">
                    {t("assess_question")} {current + 1} · {question.category}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground leading-snug">{question.question}</h2>
                </div>

                <div className="space-y-3">
                  {question.options.map((option) => {
                    const isSelected = selected === option.id;
                    return (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => selectAnswer(option.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                          isSelected
                            ? "border-[hsl(252,50%,55%)] bg-[hsl(252,60%,96%)]"
                            : "border-[hsl(220,18%,91%)] bg-white hover:border-[hsl(252,50%,75%)] hover:bg-[hsl(252,60%,98%)]"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                          isSelected ? "border-[hsl(252,50%,55%)] bg-[hsl(252,50%,55%)]" : "border-[hsl(220,18%,88%)]"
                        )}>
                          {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                        </div>
                        <span className={cn("text-sm font-medium leading-relaxed", isSelected ? "text-[hsl(226,64%,20%)]" : "text-foreground")}>
                          {option.text}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8">
              <Button variant="outline" onClick={goPrev} disabled={current === 0} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> {t("assess_prev")}
              </Button>
              <div className="flex gap-1.5">
                {questions.map((q, i) => (
                  <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all",
                    i === current ? "bg-[hsl(252,50%,55%)] w-4" : answers[questions[i].id] ? "bg-[hsl(252,50%,75%)]" : "bg-[hsl(220,18%,88%)]"
                  )} />
                ))}
              </div>
              <Button onClick={goNext} disabled={submitting} className="bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white gap-2 font-semibold">
                {submitting ? t("assess_submitting") : current === total - 1 ? t("assess_submit") : t("assess_next")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              {answeredCount} {t("assess_of")} {total} {t("assess_answered_saved")}
            </p>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
