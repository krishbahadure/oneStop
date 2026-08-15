import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StudentLayout from "@/components/layout/StudentLayout";
import { recommendations } from "@/data/mock/recommendations";
import { ArrowRight, Star, TrendingUp, AlertCircle } from "lucide-react";

const scoreColors = ["#1a56db", "#7c3aed", "#0d9488", "#d97706", "#dc2626", "#db2777", "#059669", "#6b7280"];

export default function AssessmentResultsPage() {
  const navigate = useNavigate();
  const scores = recommendations.assessmentScores;

  const radarData = scores.map((s) => ({ subject: s.trait, score: s.score, fullMark: 100 }));

  const topStrengths = [...scores].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <StudentLayout>
      <div className="min-h-full bg-[hsl(36,33%,97%)] pb-10">
        {/* Header */}
        <div className="bg-white text-white px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-amber-300" />
              </div>
              <h1 className="text-4xl font-black mb-3">Your Assessment Results</h1>
              <p className="text-[hsl(220,14%,50%)] text-lg max-w-xl mx-auto">
                Based on your responses, here's a personalized analysis of your interests and strengths.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
          {/* Strength Scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6"
          >
            <h2 className="text-xl font-bold mb-6">Your Strength Profile</h2>
            <div className="space-y-4">
              {scores.map((s, i) => (
                <div key={s.trait} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{s.trait}</span>
                    <span className="text-sm font-bold" style={{ color: scoreColors[i] }}>{s.score}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.score}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: scoreColors[i] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6"
            >
              <h3 className="font-bold mb-4 text-base">Score Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={scores} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <XAxis dataKey="trait" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(0, 6)} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip formatter={(v) => [`${v}%`, "Score"]} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {scores.map((_, i) => (
                      <Cell key={i} fill={scoreColors[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Radar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6"
            >
              <h3 className="font-bold mb-4 text-base">Aptitude Radar</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <Radar name="Score" dataKey="score" stroke="#1a56db" fill="#1a56db" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Top Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6"
          >
            <h2 className="text-xl font-bold mb-4">Your Top Strengths</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {topStrengths.map((s, i) => (
                <div key={s.trait} className={`p-4 rounded-xl text-center ${i === 0 ? "bg-[hsl(252,60%,96%)] border-2 border-blue-200" : "bg-muted"}`}>
                  <div className="text-3xl font-black mb-1" style={{ color: scoreColors[scores.findIndex(sc => sc.trait === s.trait)] }}>{s.score}%</div>
                  <div className="font-semibold text-sm">{s.trait}</div>
                  {i === 0 && <Badge className="mt-2 bg-blue-100 text-[hsl(226,64%,20%)] text-xs">Top Strength</Badge>}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recommended Streams */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6"
          >
            <h2 className="text-xl font-bold mb-4">Recommended Streams</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {recommendations.streams.slice(0, 2).map((stream) => (
                <div key={stream.name} className="border border-[hsl(220,18%,91%)] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{stream.name}</span>
                    <span className="text-[hsl(158,50%,35%)] font-bold text-sm">{stream.match}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted mb-3">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${stream.match}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">{stream.reason}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recommended Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white rounded-2xl border border-[hsl(220,18%,91%)] p-6"
          >
            <h2 className="text-xl font-bold mb-4">Recommended Areas</h2>
            <div className="flex flex-wrap gap-3">
              {["Computer Science", "Data & Analytics", "Cybersecurity", "Software Engineering", "Mathematics"].map((area) => (
                <span key={area} className="px-4 py-2 rounded-full bg-[hsl(252,60%,96%)] text-[hsl(226,64%,20%)] text-sm font-medium border border-blue-100">
                  {area}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-[hsl(44,70%,38%)] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[hsl(44,50%,28%)] leading-relaxed">
              These recommendations are designed to help you explore suitable options. They are not a fixed determination of your career — your interests and goals may evolve over time.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              size="lg"
              className="bg-[hsl(226,64%,20%)] hover:bg-[hsl(226,64%,15%)] text-white font-semibold px-10 h-12"
              onClick={() => navigate("/recommendations")}
            >
              View My Recommendations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}




