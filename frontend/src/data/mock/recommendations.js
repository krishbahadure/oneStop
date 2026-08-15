export const recommendations = {
  streams: [
    { name: "Science (PCM)", match: 94, reason: "Strong analytical and mathematical aptitude", careers: ["Software Developer", "Data Analyst", "Research Scientist"] },
    { name: "Science (PCB)", match: 72, reason: "Good communication and social interests", careers: ["Healthcare Professional", "Biotech", "Environmental Science"] },
    { name: "Commerce + Mathematics", match: 81, reason: "Business acumen with numerical strength", careers: ["Financial Analyst", "Data Analyst", "Entrepreneur"] },
    { name: "Arts (Humanities)", match: 58, reason: "Communication skills align well", careers: ["Civil Services", "Education", "Media"] },
  ],
  courses: [
    { courseId: "bsc-cs", match: 92, reasons: ["Strong technology aptitude", "High analytical score", "Aligned career goals"], interests: ["Technology", "Mathematics"] },
    { courseId: "bca", match: 87, reasons: ["Practical programming focus", "Business-tech bridge", "Strong job market"], interests: ["Technology", "Business"] },
    { courseId: "bsc-math", match: 78, reasons: ["Excellent mathematical foundation", "Data science pathway", "Research potential"], interests: ["Mathematics"] },
    { courseId: "bcom", match: 65, reasons: ["Commerce fundamentals", "Government job pathways"], interests: ["Business"] },
    { courseId: "bba", match: 60, reasons: ["Entrepreneurship potential", "Management skills"], interests: ["Business"] },
  ],
  careers: [
    { careerId: "software-developer", match: 92, reasons: ["Technology aptitude", "Problem solving strength", "High demand career"] },
    { careerId: "data-analyst", match: 88, reasons: ["Mathematical strength", "Analytical mindset", "Growing field"] },
    { careerId: "cybersecurity", match: 80, reasons: ["Tech focus", "Government opportunities", "High demand"] },
    { careerId: "financial-analyst", match: 65, reasons: ["Quantitative skills", "Business interest"] },
    { careerId: "civil-servant", match: 60, reasons: ["Leadership interest", "Government preference"] },
  ],
  assessmentScores: [
    { trait: "Technology", score: 88 },
    { trait: "Analytical", score: 84 },
    { trait: "Mathematics", score: 80 },
    { trait: "Business", score: 65 },
    { trait: "Communication", score: 58 },
    { trait: "Creativity", score: 52 },
    { trait: "Social Impact", score: 70 },
    { trait: "Practical Skills", score: 75 },
  ],
};
