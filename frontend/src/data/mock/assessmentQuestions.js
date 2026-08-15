export const assessmentQuestions = [
  {
    id: 1,
    category: "Analytical Thinking",
    question: "When you face a complex problem, what do you usually do first?",
    options: [
      { id: "a", text: "Break it down into smaller parts and analyze each one", trait: "analytical" },
      { id: "b", text: "Look for patterns from past experience", trait: "practical" },
      { id: "c", text: "Discuss it with others to get different perspectives", trait: "social" },
      { id: "d", text: "Trust your instincts and try something", trait: "creative" },
    ],
  },
  {
    id: 2,
    category: "Mathematics",
    question: "How do you feel about working with numbers and data?",
    options: [
      { id: "a", text: "I love it — numbers tell clear stories", trait: "math" },
      { id: "b", text: "I'm comfortable with it when needed", trait: "analytical" },
      { id: "c", text: "I prefer words and ideas over numbers", trait: "communication" },
      { id: "d", text: "I find it challenging but interesting", trait: "practical" },
    ],
  },
  {
    id: 3,
    category: "Technology",
    question: "What type of activity do you enjoy most?",
    options: [
      { id: "a", text: "Solving numerical problems or puzzles", trait: "math" },
      { id: "b", text: "Building or understanding technology systems", trait: "tech" },
      { id: "c", text: "Managing resources or planning strategies", trait: "business" },
      { id: "d", text: "Writing, communicating, or storytelling", trait: "communication" },
    ],
  },
  {
    id: 4,
    category: "Creativity",
    question: "Which project would excite you most?",
    options: [
      { id: "a", text: "Designing an app or website from scratch", trait: "tech" },
      { id: "b", text: "Creating a visual artwork or short film", trait: "creative" },
      { id: "c", text: "Running a social awareness campaign", trait: "social" },
      { id: "d", text: "Researching a scientific experiment", trait: "analytical" },
    ],
  },
  {
    id: 5,
    category: "Work Style",
    question: "In a group assignment, which role do you naturally take?",
    options: [
      { id: "a", text: "The planner — organizing tasks and timelines", trait: "business" },
      { id: "b", text: "The researcher — finding and analyzing information", trait: "analytical" },
      { id: "c", text: "The creator — designing and building the final output", trait: "creative" },
      { id: "d", text: "The communicator — presenting and explaining to others", trait: "communication" },
    ],
  },
  {
    id: 6,
    category: "Social Interests",
    question: "How important is it for your career to directly help people?",
    options: [
      { id: "a", text: "Very important — I want to make a direct impact", trait: "social" },
      { id: "b", text: "Moderately — I want to contribute through my work", trait: "practical" },
      { id: "c", text: "Somewhat — indirectly is fine too", trait: "analytical" },
      { id: "d", text: "Not a priority — I'm focused on technical excellence", trait: "tech" },
    ],
  },
  {
    id: 7,
    category: "Problem Solving",
    question: "Which of these subjects do you find most engaging?",
    options: [
      { id: "a", text: "Physics and Mathematics", trait: "math" },
      { id: "b", text: "Computer Science and Technology", trait: "tech" },
      { id: "c", text: "Economics and Business Studies", trait: "business" },
      { id: "d", text: "Literature, History, or Social Science", trait: "social" },
    ],
  },
  {
    id: 8,
    category: "Career Environment",
    question: "Where do you imagine yourself working 10 years from now?",
    options: [
      { id: "a", text: "In a government or public service role", trait: "social" },
      { id: "b", text: "At a technology or product company", trait: "tech" },
      { id: "c", text: "Running my own business or startup", trait: "business" },
      { id: "d", text: "In research, academia, or science", trait: "analytical" },
    ],
  },
  {
    id: 9,
    category: "Communication",
    question: "How comfortable are you with public speaking or presentations?",
    options: [
      { id: "a", text: "Very comfortable — I enjoy communicating ideas", trait: "communication" },
      { id: "b", text: "Comfortable enough when I know the topic well", trait: "practical" },
      { id: "c", text: "I prefer working behind the scenes", trait: "analytical" },
      { id: "d", text: "I'm working on improving it", trait: "tech" },
    ],
  },
  {
    id: 10,
    category: "Learning Style",
    question: "How do you prefer to learn something new?",
    options: [
      { id: "a", text: "By reading and taking detailed notes", trait: "analytical" },
      { id: "b", text: "By watching videos and visual tutorials", trait: "creative" },
      { id: "c", text: "By hands-on practice and experimentation", trait: "tech" },
      { id: "d", text: "By discussing with others and teaching", trait: "social" },
    ],
  },
  {
    id: 11,
    category: "Decision Making",
    question: "When making an important decision, you mostly rely on:",
    options: [
      { id: "a", text: "Data, facts, and logical analysis", trait: "analytical" },
      { id: "b", text: "Practical considerations and experience", trait: "practical" },
      { id: "c", text: "Intuition and creativity", trait: "creative" },
      { id: "d", text: "Advice from people you trust", trait: "social" },
    ],
  },
  {
    id: 12,
    category: "Future Goals",
    question: "Which outcome matters most to you in your career?",
    options: [
      { id: "a", text: "Job security and stable income", trait: "practical" },
      { id: "b", text: "Building something innovative and impactful", trait: "tech" },
      { id: "c", text: "Financial success and independence", trait: "business" },
      { id: "d", text: "Making a meaningful difference in society", trait: "social" },
    ],
  },
];

export const traitLabels = {
  analytical: "Analytical Thinking",
  math: "Mathematics",
  tech: "Technology",
  business: "Business",
  communication: "Communication",
  creative: "Creativity",
  social: "Social Impact",
  practical: "Practical Skills",
};

export const traitColors = {
  analytical: "#1a56db",
  math: "#7c3aed",
  tech: "#0d9488",
  business: "#d97706",
  communication: "#dc2626",
  creative: "#db2777",
  social: "#059669",
  practical: "#6b7280",
};
