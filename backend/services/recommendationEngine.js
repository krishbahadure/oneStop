// One Stop – Recommendation Engine
// PROTOTYPE: Rule-based weighted scoring.
// Architecture note: This engine is intentionally kept stateless and composable.
// To swap for an ML model later, replace the scoring functions below with
// model inference calls while keeping the same input/output contract.
//
// Input:  { profile, assessmentScores }
// Output: { streams, subjects, courses, careers, colleges, scholarships, resources }
//
// Each item gets a matchPercent (0–100) and matchReasons (array of strings).

const db = require('../db/connection');

// ── Weights ───────────────────────────────────────────────────────────────────
// These weights control how much each signal influences the final score.
// In a real ML model these would be learned from outcome data.
const W = {
  assessment:  0.45,  // assessment score contribution
  stream12:    0.25,  // stream already chosen in class 12
  interest:    0.20,  // self-declared interested streams in profile
  location:    0.10,  // district-based proximity (for colleges only)
};

/**
 * Normalize raw scores to 0–100, applying weights.
 * @param {Object} rawScores - {streamName: rawScore}
 * @param {number} maxPossible - theoretical max raw score
 * @returns {Object} {streamName: 0-100}
 */
function normalizeScores(rawScores, maxPossible = 24) {
  const result = {};
  for (const [stream, score] of Object.entries(rawScores)) {
    result[stream] = Math.round(Math.min(100, (score / maxPossible) * 100));
  }
  return result;
}

/**
 * Compute stream match percentages from all signals.
 * Returns sorted array of {streamId, streamName, matchPercent, matchReasons}
 */
function computeStreamMatches(profile, assessmentScores) {
  const streams = db.prepare('SELECT * FROM streams').all();
  const normalized = normalizeScores(assessmentScores || {});

  return streams.map(stream => {
    let score = 0;
    const reasons = [];

    // Signal 1: Assessment score
    const assessmentMatch = normalized[stream.name] || 0;
    score += assessmentMatch * W.assessment;
    if (assessmentMatch >= 70) reasons.push(`Your assessment answers strongly align with ${stream.name}`);
    else if (assessmentMatch >= 40) reasons.push(`Your assessment shows moderate ${stream.name} inclination`);

    // Signal 2: Class 12 stream match
    if (profile?.class_12_stream === stream.name) {
      score += 100 * W.stream12;
      reasons.push(`You are already studying in ${stream.name} stream`);
    }

    // Signal 3: Self-declared interest
    let interestedStreams = [];
    try { interestedStreams = JSON.parse(profile?.interested_streams || '[]'); } catch {}
    if (interestedStreams.includes(stream.name)) {
      score += 100 * W.interest;
      reasons.push(`You expressed interest in ${stream.name}`);
    }

    const matchPercent = Math.round(Math.min(100, score));
    if (reasons.length === 0) reasons.push(`Based on your overall assessment profile`);

    return {
      streamId: stream.id,
      streamName: stream.name,
      description: stream.description,
      careers: JSON.parse(stream.careers || '[]'),
      matchPercent,
      matchReasons: reasons,
      isVerified: !!stream.is_verified,
      lastUpdated: stream.last_updated,
    };
  }).sort((a, b) => b.matchPercent - a.matchPercent);
}

/**
 * Recommend courses based on top recommended streams + profile.
 * Returns sorted array with matchPercent and reason.
 */
function computeCourseRecommendations(profile, topStreamIds) {
  const courses = db.prepare('SELECT * FROM courses').all();

  return courses.map(course => {
    let score = 30; // base score so non-matching courses still show
    const reasons = [];

    // Stream alignment
    if (topStreamIds.includes(course.stream_id)) {
      score += 50;
      reasons.push(`Aligned with your recommended ${course.stream_name} stream`);
    }

    // Degree type preference heuristic
    if (course.degree_type === 'UG') {
      score += 10; // UG is the natural next step after 12th
      reasons.push('Direct undergraduate pathway after Class 12');
    }

    // Class 12 marks–based eligibility signal
    const marks = profile?.class_12_percent || 0;
    if (marks >= 80 && (course.name.includes('B.Tech') || course.name.includes('MBBS'))) {
      score += 15;
      reasons.push(`Your ${marks}% marks make you eligible for competitive courses`);
    }

    // Career alignment (course career_scope vs profile career_goals)
    const courseCareerScope = JSON.parse(course.career_scope || '[]');
    if (profile?.career_goals) {
      const goal = profile.career_goals.toLowerCase();
      if (courseCareerScope.some(c => c.toLowerCase().includes(goal.split(' ')[0]))) {
        score += 10;
        reasons.push(`Leads directly to your career goal: ${profile.career_goals}`);
      }
    }

    const matchPercent = Math.min(98, Math.round(score));
    if (reasons.length === 0) reasons.push('General education pathway');

    return {
      ...course,
      careerScope: courseCareerScope,
      skills: JSON.parse(course.skills || '[]'),
      subjects: JSON.parse(course.subjects || '[]'),
      topRecruiters: JSON.parse(course.top_recruiters || '[]'),
      matchPercent,
      matchReasons: reasons,
      isRecommended: score >= 70,
    };
  }).sort((a, b) => b.matchPercent - a.matchPercent);
}

/**
 * Recommend careers based on top recommended streams.
 */
function computeCareerRecommendations(profile, topStreamIds) {
  const careers = db.prepare('SELECT * FROM careers').all();

  return careers.map(career => {
    let score = 20;
    const reasons = [];

    if (topStreamIds.includes(career.stream_id)) {
      score += 55;
      reasons.push(`Aligned with your recommended ${career.stream_name} stream`);
    }

    if (career.sector === 'Government') {
      score += 5; // slight preference for govt careers in J&K context
    }

    if (career.growth_outlook === 'High') {
      score += 10;
      reasons.push('High growth outlook career');
    }

    const matchPercent = Math.min(96, Math.round(score));
    if (reasons.length === 0) reasons.push('Based on your profile');

    return {
      ...career,
      requiredSkills: JSON.parse(career.required_skills || '[]'),
      requiredCourses: JSON.parse(career.required_courses || '[]'),
      steps: JSON.parse(career.steps || '[]'),
      matchPercent,
      matchReasons: reasons,
    };
  }).sort((a, b) => b.matchPercent - a.matchPercent);
}

/**
 * Recommend colleges – primarily district-based + course match.
 */
function computeCollegeRecommendations(profile, topCourseIds) {
  const colleges = db.prepare('SELECT * FROM colleges').all();
  const ccMap = {};
  db.prepare('SELECT * FROM college_courses').all().forEach(cc => {
    if (!ccMap[cc.college_id]) ccMap[cc.college_id] = [];
    ccMap[cc.college_id].push(cc);
  });

  return colleges.map(college => {
    let score = 20;
    const reasons = [];

    // Location proximity
    if (college.district === profile?.district) {
      score += 40 * W.location * 10;
      reasons.push(`Located in your district (${profile.district})`);
    }

    // Course availability
    const collegeCourses = ccMap[college.id] || [];
    const hasRecommendedCourse = collegeCourses.some(cc => topCourseIds.includes(cc.course_id));
    if (hasRecommendedCourse) {
      score += 30;
      reasons.push('Offers your recommended courses');
    }

    // NAAC grade bonus
    if (college.naac_grade === 'A+' || college.naac_grade === 'A') {
      score += 10;
      reasons.push(`Accredited ${college.naac_grade} by NAAC`);
    }

    const matchPercent = Math.min(95, Math.round(score));
    if (reasons.length === 0) reasons.push('Government college in J&K');

    return {
      ...college,
      facilities: JSON.parse(college.facilities || '[]'),
      courses: collegeCourses,
      matchPercent,
      matchReasons: reasons,
      isBestMatch: score >= 60,
    };
  }).sort((a, b) => b.matchPercent - a.matchPercent);
}

/**
 * Main recommendation function.
 * Takes userId, profile, and assessmentScores.
 * Returns full recommendation set.
 */
function generateRecommendations(profile, assessmentScores) {
  const streamRecs = computeStreamMatches(profile, assessmentScores);
  const topStreamIds = streamRecs.slice(0, 3).map(s => s.streamId);

  const courseRecs = computeCourseRecommendations(profile, topStreamIds);
  const topCourseIds = courseRecs.slice(0, 5).map(c => c.id);

  const careerRecs = computeCareerRecommendations(profile, topStreamIds);
  const collegeRecs = computeCollegeRecommendations(profile, topCourseIds);

  return {
    streams: streamRecs,
    courses: courseRecs,
    careers: careerRecs,
    colleges: collegeRecs,
    meta: {
      generatedAt: new Date().toISOString(),
      type: 'rule-based',  // NOTE: prototype only — swap with ML inference here
      topStream: streamRecs[0]?.streamName || null,
    },
  };
}

module.exports = { generateRecommendations };
