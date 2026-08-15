-- One Stop Career & Education Advisor – SQLite Schema
-- PS72 Prototype for J&K Higher Education Department
-- All tables include is_verified + last_updated for admin badge display

PRAGMA foreign_keys = ON;

-- ── Users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'student',  -- 'student' | 'admin'
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  last_login  TEXT
);

-- ── Student Profiles ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_profiles (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id             INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  phone               TEXT,
  district            TEXT,
  board               TEXT,  -- JKBOSE | CBSE | ICSE
  class_10_percent    REAL,
  class_12_percent    REAL,
  class_12_stream     TEXT,
  interested_streams  TEXT,  -- JSON array stored as string
  hobbies             TEXT,  -- JSON array
  career_goals        TEXT,
  family_income       TEXT,
  gender              TEXT,
  category            TEXT,  -- General | OBC | SC | ST
  profile_completed   INTEGER NOT NULL DEFAULT 0,
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Assessment Questions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_questions (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  category  TEXT NOT NULL,
  question  TEXT NOT NULL,
  options   TEXT NOT NULL,  -- JSON: [{id, text, streams, weight}]
  order_idx INTEGER NOT NULL DEFAULT 0
);

-- ── Assessment Results ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_results (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  answers       TEXT NOT NULL,  -- JSON {questionId: optionId}
  scores        TEXT NOT NULL,  -- JSON {stream: score}
  completed_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Streams ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS streams (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,
  color       TEXT,
  careers     TEXT,  -- JSON array of career names
  is_verified INTEGER NOT NULL DEFAULT 1,
  last_updated TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Subjects ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subjects (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  stream_id  INTEGER NOT NULL REFERENCES streams(id),
  name       TEXT NOT NULL,
  is_core    INTEGER NOT NULL DEFAULT 1,
  description TEXT
);

-- ── Courses ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  stream_id     INTEGER REFERENCES streams(id),
  stream_name   TEXT,
  duration      TEXT,
  degree_type   TEXT,  -- UG | PG | Diploma | Certificate
  description   TEXT,
  eligibility   TEXT,
  avg_fees      TEXT,
  career_scope  TEXT,  -- JSON array
  skills        TEXT,  -- JSON array
  subjects      TEXT,  -- JSON array
  top_recruiters TEXT, -- JSON array
  is_verified   INTEGER NOT NULL DEFAULT 1,
  last_updated  TEXT NOT NULL DEFAULT (datetime('now')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Careers ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS careers (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  title           TEXT NOT NULL,
  stream_id       INTEGER REFERENCES streams(id),
  stream_name     TEXT,
  description     TEXT,
  salary_min      INTEGER,
  salary_max      INTEGER,
  salary_currency TEXT DEFAULT 'INR',
  sector          TEXT,   -- Government | Private | Both
  required_skills TEXT,   -- JSON array
  required_courses TEXT,  -- JSON array of course IDs
  steps           TEXT,   -- JSON: How Do I Become This? ladder
  growth_outlook  TEXT,   -- High | Medium | Low
  is_verified     INTEGER NOT NULL DEFAULT 1,
  last_updated    TEXT NOT NULL DEFAULT (datetime('now')),
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Colleges ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS colleges (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT NOT NULL,
  district          TEXT NOT NULL,
  address           TEXT,
  type              TEXT DEFAULT 'Government',
  established       INTEGER,
  affiliated_to     TEXT,
  naac_grade        TEXT,
  total_seats       INTEGER,
  hostel_available  INTEGER DEFAULT 0,
  facilities        TEXT,  -- JSON array
  description       TEXT,
  website           TEXT,
  phone             TEXT,
  admission_status  TEXT DEFAULT 'Applications Closed',
  is_verified       INTEGER NOT NULL DEFAULT 1,
  last_updated      TEXT NOT NULL DEFAULT (datetime('now')),
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── College-Course Mapping ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS college_courses (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  course_id  INTEGER REFERENCES courses(id),
  course_name TEXT NOT NULL,
  seats      INTEGER,
  fees       TEXT,
  cutoff_marks REAL
);

-- ── Scholarships ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scholarships (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT NOT NULL,
  provider        TEXT,
  amount          TEXT,
  eligibility     TEXT,  -- JSON {income, category, class_percent, stream}
  description     TEXT,
  deadline        TEXT,
  application_url TEXT,
  stream_filter   TEXT,  -- JSON array of applicable stream names, null = all
  is_verified     INTEGER NOT NULL DEFAULT 1,
  last_updated    TEXT NOT NULL DEFAULT (datetime('now')),
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Resources ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resources (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT NOT NULL,
  type         TEXT,  -- Video | PDF | Book | Website | App
  subject      TEXT,
  stream_name  TEXT,
  course_name  TEXT,
  career_name  TEXT,
  url          TEXT,
  description  TEXT,
  is_free      INTEGER DEFAULT 1,
  is_verified  INTEGER NOT NULL DEFAULT 1,
  last_updated TEXT NOT NULL DEFAULT (datetime('now')),
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Timeline Events ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS timeline_events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT NOT NULL,
  description  TEXT,
  event_date   TEXT NOT NULL,
  category     TEXT,  -- Admission | Exam | Scholarship | General
  stream_filter TEXT, -- JSON array of applicable streams, null = all
  status       TEXT DEFAULT 'upcoming',  -- completed | upcoming | due_soon
  is_verified  INTEGER NOT NULL DEFAULT 1,
  last_updated TEXT NOT NULL DEFAULT (datetime('now')),
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Student Progress ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_progress (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id               INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  assessment_completed  INTEGER DEFAULT 0,
  profile_completed     INTEGER DEFAULT 0,
  courses_viewed        INTEGER DEFAULT 0,
  colleges_shortlisted  INTEGER DEFAULT 0,
  scholarships_saved    INTEGER DEFAULT 0,
  last_active           TEXT DEFAULT (datetime('now'))
);

-- ── Student Shortlists ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_shortlists (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity     TEXT NOT NULL,  -- 'college' | 'course' | 'scholarship'
  entity_id  INTEGER NOT NULL,
  added_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, entity, entity_id)
);

-- ── Roadmap Items ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roadmap_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'pending',  -- pending | in_progress | completed
  category    TEXT,  -- Profile | Assessment | Course | Career | College | Scholarship
  link        TEXT,
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
