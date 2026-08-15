// One Stop – Database Seed Script
// Populates onestop.db with realistic J&K data.
// Run: node db/seed.js  (from backend/ directory)

const db = require('./connection');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// ── Run schema ─────────────────────────────────────────────────────────────────
const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schemaSQL);
console.log('✅ Schema applied');

// ── Helper ─────────────────────────────────────────────────────────────────────
const j = (v) => JSON.stringify(v);
const now = () => new Date().toISOString();

// ── Clear tables in dependency order ───────────────────────────────────────────
const TRUNCATE_ORDER = [
  'roadmap_items','student_shortlists','student_progress','timeline_events',
  'resources','scholarships','college_courses','colleges','careers','courses',
  'subjects','streams','assessment_results','assessment_questions',
  'student_profiles','users'
];
db.exec(TRUNCATE_ORDER.map(t => `DELETE FROM ${t};`).join('\n'));
console.log('✅ Tables cleared');

// ── USERS ─────────────────────────────────────────────────────────────────────
const insertUser = db.prepare(`
  INSERT INTO users (name, email, password, role, created_at) VALUES (?,?,?,?,?)
`);
const HASH = (p) => bcrypt.hashSync(p, 10);

const adminId = insertUser.run('Admin OneStop', 'admin@onestop.jk', HASH('Admin@123'), 'admin', now()).lastInsertRowid;
const s1Id    = insertUser.run('Rahul Sharma', 'student@onestop.jk', HASH('Student@123'), 'student', now()).lastInsertRowid;
const s2Id    = insertUser.run('Ayesha Mir', 'ayesha@onestop.jk', HASH('Student@123'), 'student', now()).lastInsertRowid;
const s3Id    = insertUser.run('Vikram Dogra', 'vikram@onestop.jk', HASH('Student@123'), 'student', now()).lastInsertRowid;
console.log('✅ Users seeded (admin, 3 students)');

// ── STUDENT PROFILES ─────────────────────────────────────────────────────────
const insertProfile = db.prepare(`
  INSERT INTO student_profiles
    (user_id,phone,district,board,class_10_percent,class_12_percent,class_12_stream,interested_streams,hobbies,career_goals,family_income,gender,category,profile_completed,updated_at)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`);
insertProfile.run(s1Id,'9419012345','Srinagar','JKBOSE',87.4,82.0,'Science',j(['Science','Technology']),'["Coding","Chess","Reading"]','Software Engineer','3-6 LPA','Male','General',1,now());
insertProfile.run(s2Id,'9419056789','Baramulla','JKBOSE',79.0,75.5,'Arts',j(['Arts','Humanities']),'["Writing","Music","Travel"]','IAS Officer','1-3 LPA','Female','OBC',1,now());
insertProfile.run(s3Id,'9419098765','Jammu','CBSE',91.0,88.0,'Commerce',j(['Commerce','Finance']),'["Accounting","Cricket","Finance"]','Chartered Accountant','6-10 LPA','Male','General',1,now());
console.log('✅ Student profiles seeded');

// ── ASSESSMENT QUESTIONS ──────────────────────────────────────────────────────
const insertQ = db.prepare(`INSERT INTO assessment_questions (category,question,options,order_idx) VALUES (?,?,?,?)`);
const questions = [
  {
    cat:'Interest', q:'Which of these activities do you enjoy the most?', idx:1,
    opts:[
      {id:'a',text:'Solving math problems and logical puzzles',streams:['Science','Commerce'],weight:2},
      {id:'b',text:'Reading books, writing stories or poems',streams:['Arts'],weight:2},
      {id:'c',text:'Helping sick people and working in a clinic',streams:['Medical'],weight:2},
      {id:'d',text:'Managing money, running a shop or small business',streams:['Commerce'],weight:2},
    ]
  },
  {
    cat:'Interest', q:'Which subject do you find most interesting?', idx:2,
    opts:[
      {id:'a',text:'Physics and Mathematics',streams:['Science'],weight:2},
      {id:'b',text:'Biology and Chemistry',streams:['Medical','Science'],weight:2},
      {id:'c',text:'History, Geography and Political Science',streams:['Arts'],weight:2},
      {id:'d',text:'Accountancy and Business Studies',streams:['Commerce'],weight:2},
    ]
  },
  {
    cat:'Aptitude', q:'A train travels 180 km in 3 hours. What is its average speed?', idx:3,
    opts:[
      {id:'a',text:'60 km/h',streams:['Science','Commerce'],weight:2},
      {id:'b',text:'50 km/h',streams:[],weight:0},
      {id:'c',text:'90 km/h',streams:[],weight:0},
      {id:'d',text:'45 km/h',streams:[],weight:0},
    ]
  },
  {
    cat:'Aptitude', q:'If you have ₹5000 and spend 40%, how much remains?', idx:4,
    opts:[
      {id:'a',text:'₹2000',streams:[],weight:0},
      {id:'b',text:'₹3000',streams:['Commerce','Science'],weight:2},
      {id:'c',text:'₹2500',streams:[],weight:0},
      {id:'d',text:'₹3500',streams:[],weight:0},
    ]
  },
  {
    cat:'Career Goals', q:'Which career path appeals to you most?', idx:5,
    opts:[
      {id:'a',text:'Working as a government officer or civil servant',streams:['Arts','Commerce'],weight:2},
      {id:'b',text:'Building software products and websites',streams:['Science'],weight:2},
      {id:'c',text:'Running my own business or startup',streams:['Commerce','Vocational'],weight:2},
      {id:'d',text:'Teaching and guiding young students',streams:['Arts','Science'],weight:1},
    ]
  },
  {
    cat:'Career Goals', q:'Where would you prefer to work?', idx:6,
    opts:[
      {id:'a',text:'In a government office with job security',streams:['Arts','Commerce'],weight:2},
      {id:'b',text:'In a technology company or startup',streams:['Science'],weight:2},
      {id:'c',text:'In a hospital or healthcare centre',streams:['Medical'],weight:2},
      {id:'d',text:'Running my own enterprise',streams:['Commerce','Vocational'],weight:2},
    ]
  },
  {
    cat:'Learning Style', q:'How do you prefer to learn new things?', idx:7,
    opts:[
      {id:'a',text:'By experimenting and doing hands-on projects',streams:['Science','Vocational'],weight:2},
      {id:'b',text:'By reading and researching deeply',streams:['Arts','Medical'],weight:2},
      {id:'c',text:'By discussing with others and debating',streams:['Arts','Commerce'],weight:2},
      {id:'d',text:'By solving numerical problems and analysis',streams:['Science','Commerce'],weight:2},
    ]
  },
  {
    cat:'Learning Style', q:'In a group project, which role do you naturally take?', idx:8,
    opts:[
      {id:'a',text:'The leader who coordinates everyone',streams:['Commerce','Arts'],weight:2},
      {id:'b',text:'The analyst who crunches numbers and data',streams:['Science','Commerce'],weight:2},
      {id:'c',text:'The creative who comes up with ideas',streams:['Arts','Vocational'],weight:2},
      {id:'d',text:'The technical expert who builds solutions',streams:['Science'],weight:2},
    ]
  },
  {
    cat:'Values', q:'What is most important to you in your future career?', idx:9,
    opts:[
      {id:'a',text:'Financial security and a stable salary',streams:['Commerce','Government'],weight:2},
      {id:'b',text:'Making a positive difference in society',streams:['Arts','Medical'],weight:2},
      {id:'c',text:'Using creativity and innovation',streams:['Science','Vocational'],weight:2},
      {id:'d',text:'Fame, recognition and leadership',streams:['Arts','Commerce'],weight:1},
    ]
  },
  {
    cat:'Values', q:'What type of problems do you enjoy solving?', idx:10,
    opts:[
      {id:'a',text:'Technical and engineering challenges',streams:['Science'],weight:2},
      {id:'b',text:'Social and political issues',streams:['Arts'],weight:2},
      {id:'c',text:'Business and financial challenges',streams:['Commerce'],weight:2},
      {id:'d',text:'Health and wellness problems',streams:['Medical'],weight:2},
    ]
  },
  {
    cat:'Environment', q:'Which environment do you see yourself thriving in?', idx:11,
    opts:[
      {id:'a',text:'A research lab or university',streams:['Science','Medical'],weight:2},
      {id:'b',text:'A courtroom, government office or NGO',streams:['Arts'],weight:2},
      {id:'c',text:'A corporate office or bank',streams:['Commerce'],weight:2},
      {id:'d',text:'A workshop, trade centre or field',streams:['Vocational'],weight:2},
    ]
  },
  {
    cat:'Environment', q:'Which describes you best?', idx:12,
    opts:[
      {id:'a',text:'I am detail-oriented and love data analysis',streams:['Science','Commerce'],weight:2},
      {id:'b',text:'I am empathetic and love helping people',streams:['Medical','Arts'],weight:2},
      {id:'c',text:'I am creative and love building new things',streams:['Vocational','Science'],weight:2},
      {id:'d',text:'I am a strong communicator and leader',streams:['Arts','Commerce'],weight:2},
    ]
  },
];
questions.forEach(q => insertQ.run(q.cat, q.q, j(q.opts), q.idx));
console.log('✅ Assessment questions seeded (12)');

// ── STREAMS ───────────────────────────────────────────────────────────────────
const insertStream = db.prepare(`
  INSERT INTO streams (name,description,icon,color,careers,is_verified,last_updated)
  VALUES (?,?,?,?,?,1,?)
`);
const streams = {
  science:   insertStream.run('Science','Mathematics, Physics, Chemistry, Biology and Computer Science.','BeakerIcon','chip-lavender',j(['Software Developer','Data Analyst','Engineer','Doctor','Scientist']),now()).lastInsertRowid,
  commerce:  insertStream.run('Commerce','Accountancy, Business Studies, Economics and Mathematics.','TrendingUpIcon','chip-mint',j(['Accountant','CA','Banker','Business Analyst','Entrepreneur']),now()).lastInsertRowid,
  arts:      insertStream.run('Arts','History, Political Science, Geography, Sociology and Literature.','BookOpenIcon','chip-yellow',j(['IAS/IPS Officer','Teacher','Journalist','Lawyer','Social Worker']),now()).lastInsertRowid,
  medical:   insertStream.run('Medical','Biology, Chemistry, Physics and Biotechnology.','HeartPulseIcon','chip-peach',j(['Doctor (MBBS)','Nurse','Pharmacist','Physiotherapist','Dentist']),now()).lastInsertRowid,
  vocational:insertStream.run('Vocational','Practical skill-based trades and technical education.','WrenchIcon','chip-orange',j(['Electrician','Plumber','Fashion Designer','Automotive Technician','IT Technician']),now()).lastInsertRowid,
};
console.log('✅ Streams seeded (5)');

// ── SUBJECTS ──────────────────────────────────────────────────────────────────
const insertSubject = db.prepare(`INSERT INTO subjects (stream_id,name,is_core,description) VALUES (?,?,?,?)`);
[ [streams.science,'Physics',1,'Mechanics, thermodynamics, electromagnetism'],
  [streams.science,'Chemistry',1,'Organic, inorganic and physical chemistry'],
  [streams.science,'Mathematics',1,'Calculus, algebra, statistics'],
  [streams.science,'Biology',0,'Botany, zoology, cell biology'],
  [streams.science,'Computer Science',0,'Programming, algorithms, data structures'],
  [streams.commerce,'Accountancy',1,'Financial accounting and bookkeeping'],
  [streams.commerce,'Business Studies',1,'Business management and entrepreneurship'],
  [streams.commerce,'Economics',1,'Micro and macro economics'],
  [streams.commerce,'Mathematics',0,'Business mathematics and statistics'],
  [streams.arts,'History',1,'Indian and world history'],
  [streams.arts,'Political Science',1,'Government, democracy and public policy'],
  [streams.arts,'Geography',1,'Physical and human geography'],
  [streams.arts,'Sociology',0,'Society, culture and social change'],
  [streams.arts,'English Literature',0,'Poetry, prose and drama'],
  [streams.medical,'Biology',1,'Human anatomy, physiology and genetics'],
  [streams.medical,'Chemistry',1,'Biochemistry and pharmaceutical chemistry'],
  [streams.medical,'Physics',1,'Medical physics and biophysics'],
].forEach(args => insertSubject.run(...args));
console.log('✅ Subjects seeded');

// ── COURSES ───────────────────────────────────────────────────────────────────
const insertCourse = db.prepare(`
  INSERT INTO courses (name,stream_id,stream_name,duration,degree_type,description,eligibility,avg_fees,career_scope,skills,subjects,top_recruiters,is_verified,last_updated)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`);
const courseIds = {};
const coursesData = [
  { key:'bsc_cs', sid:streams.science, sname:'Science', name:'B.Sc. Computer Science', dur:'3 Years', deg:'UG',
    desc:'A comprehensive undergraduate degree in computer science covering programming, databases, algorithms, networking, and software engineering. Ideal for students who want to build software products or pursue advanced studies in technology.',
    elig:'10+2 with Science/Mathematics with min 50%', fees:'₹15,000–₹40,000/year',
    careers:['Software Developer','Web Developer','Data Analyst','System Administrator','Cybersecurity Analyst'],
    skills:['Python','Java','Data Structures','Algorithms','Database Management','Web Development'],
    subs:['Programming in C/C++','Data Structures','DBMS','Computer Networks','Operating Systems','Software Engineering'],
    recruiters:['TCS','Infosys','Wipro','HCL','Government IT Depts','J&K e-Governance']
  },
  { key:'btech', sid:streams.science, sname:'Science', name:'B.Tech. (Computer Science & Engineering)', dur:'4 Years', deg:'UG',
    desc:'Engineering degree focusing on advanced computing, AI, and systems design. Preferred for private sector technology roles and higher studies at IITs and NITs.',
    elig:'10+2 PCM with min 60% + JEE/JKCET score', fees:'₹60,000–₹1,50,000/year',
    careers:['Software Engineer','AI/ML Engineer','DevOps Engineer','Data Scientist','Technical Architect'],
    skills:['C++','Python','Machine Learning','Cloud Computing','System Design','Agile Development'],
    subs:['Engineering Mathematics','Data Structures & Algorithms','Computer Architecture','Operating Systems','AI & ML','Cloud Computing'],
    recruiters:['Amazon','Google','Microsoft','Infosys','Wipro','NIC','BSNL']
  },
  { key:'bca', sid:streams.science, sname:'Science', name:'BCA (Bachelor of Computer Applications)', dur:'3 Years', deg:'UG',
    desc:'Application-oriented computer science degree suitable for students who want to enter the IT industry quickly with skills in software development and application design.',
    elig:'10+2 with Mathematics/Science/Commerce, min 45%', fees:'₹20,000–₹60,000/year',
    careers:['Software Developer','Mobile App Developer','Web Designer','Database Administrator','IT Support'],
    skills:['Java','PHP','HTML/CSS','JavaScript','MySQL','Android Development'],
    subs:['Programming Fundamentals','Web Technologies','DBMS','Software Engineering','Mobile Computing','Data Analytics'],
    recruiters:['TCS','Cognizant','Tech Mahindra','State IT Depts','Startups']
  },
  { key:'bsc_physics', sid:streams.science, sname:'Science', name:'B.Sc. Physics', dur:'3 Years', deg:'UG',
    desc:'Study of classical and modern physics, including quantum mechanics, thermodynamics, and electrodynamics. Gateway to research and teaching careers.',
    elig:'10+2 with PCM, min 50%', fees:'₹8,000–₹25,000/year',
    careers:['Research Scientist','Physics Teacher','Lab Technician','Meteorologist','Nuclear Scientist'],
    skills:['Analytical Thinking','Mathematical Modelling','Laboratory Techniques','Data Analysis','Scientific Writing'],
    subs:['Mechanics','Electrodynamics','Quantum Mechanics','Thermodynamics','Optics','Nuclear Physics'],
    recruiters:['ISRO','DRDO','DAE','Universities','Research Institutes']
  },
  { key:'bcom', sid:streams.commerce, sname:'Commerce', name:'B.Com. (Bachelor of Commerce)', dur:'3 Years', deg:'UG',
    desc:'Foundational commerce degree covering financial accounting, corporate law, taxation, and business management. Essential for CA and banking careers.',
    elig:'10+2 with Commerce/any stream, min 45%', fees:'₹10,000–₹30,000/year',
    careers:['Accountant','Tax Consultant','Banking Officer','Financial Analyst','Business Manager'],
    skills:['Financial Accounting','Taxation','Tally ERP','MS Excel','Corporate Law','Auditing'],
    subs:['Financial Accounting','Corporate Law','Income Tax','Cost Accounting','Business Mathematics','Auditing'],
    recruiters:['Banks (J&K Bank, SBI)','CA Firms','Government Departments','MNCs','Insurance Companies']
  },
  { key:'bba', sid:streams.commerce, sname:'Commerce', name:'BBA (Bachelor of Business Administration)', dur:'3 Years', deg:'UG',
    desc:'Management degree preparing students for business leadership roles. Covers marketing, HR, operations, and entrepreneurship.',
    elig:'10+2 any stream with min 50%', fees:'₹30,000–₹80,000/year',
    careers:['Business Manager','Marketing Executive','HR Manager','Entrepreneur','Operations Manager'],
    skills:['Business Communication','Marketing','Financial Management','HR Management','Leadership','Strategy'],
    subs:['Principles of Management','Marketing Management','Human Resource Management','Business Law','Financial Accounting','Entrepreneurship'],
    recruiters:['MNCs','Banks','Insurance Companies','Retail Chains','Startups','Government PSUs']
  },
  { key:'ba', sid:streams.arts, sname:'Arts', name:'B.A. (Bachelor of Arts)', dur:'3 Years', deg:'UG',
    desc:'Liberal arts degree with specializations in History, Political Science, Sociology, English, Urdu, and Kashmiri. Foundation for civil services and teaching careers.',
    elig:'10+2 any stream, min 45%', fees:'₹5,000–₹15,000/year',
    careers:['IAS/IPS Officer','Journalist','Teacher/Lecturer','Lawyer','Social Worker','NGO Worker'],
    skills:['Critical Thinking','Research','Communication','Writing','Analysis','Public Administration'],
    subs:['History of India','Political Theory','Sociology','English Literature','Urdu/Kashmiri Literature','Philosophy'],
    recruiters:['UPSC/JKPSC','Schools & Colleges','Media Houses','NGOs','Law Firms','Government Depts']
  },
  { key:'llb', sid:streams.arts, sname:'Arts', name:'LLB (Bachelor of Laws)', dur:'3 Years', deg:'UG',
    desc:'Law degree preparing graduates for legal practice, judiciary, and civil services. Highly relevant for J&K\'s administrative and judicial services.',
    elig:'Any bachelor\'s degree with min 45%', fees:'₹15,000–₹50,000/year',
    careers:['Advocate','Judge (after PCS-J)','Legal Advisor','Notary','Corporate Lawyer'],
    skills:['Legal Research','Case Analysis','Argumentation','Constitutional Law','Criminal Law','Contract Law'],
    subs:['Constitutional Law','Criminal Law','Law of Contracts','Family Law','Property Law','Evidence Act'],
    recruiters:['High Courts','District Courts','Law Firms','Corporate Legal Depts','JKPSC']
  },
  { key:'bed', sid:streams.arts, sname:'Arts', name:'B.Ed. (Bachelor of Education)', dur:'2 Years', deg:'UG',
    desc:'Teacher training degree required to become a certified teacher in J&K government schools. Covers pedagogy, subject methods, and school internships.',
    elig:'Any bachelor\'s degree with min 50%', fees:'₹25,000–₹60,000/year',
    careers:['School Teacher (Govt)','Private School Teacher','Educational Counsellor','Curriculum Designer'],
    skills:['Teaching Methodology','Classroom Management','Educational Psychology','Subject Knowledge','Assessment Techniques'],
    subs:['Pedagogy','Educational Psychology','Subject Didactics','School Internship','Assessment & Evaluation'],
    recruiters:['J&K School Education Dept','JKSSB','Private Schools','KVS','CBSE Schools']
  },
  { key:'mbbs', sid:streams.medical, sname:'Medical', name:'MBBS (Bachelor of Medicine)', dur:'5.5 Years', deg:'UG',
    desc:'Medical degree required to practice as a doctor. Extremely competitive — requires NEET-UG qualification. Covers human anatomy, physiology, pharmacology, and clinical practice.',
    elig:'10+2 with PCB, min 60% + NEET-UG qualified', fees:'₹30,000–₹10,00,000/year',
    careers:['Doctor (General Physician)','Surgeon','Medical Officer (Govt)','Specialist (after PG)','Medical Researcher'],
    skills:['Clinical Diagnosis','Patient Care','Pharmacology','Surgical Assistance','Medical Ethics','Emergency Medicine'],
    subs:['Anatomy','Physiology','Biochemistry','Pharmacology','Pathology','Medicine','Surgery','Obs & Gynae'],
    recruiters:['JKHERC Medical Colleges','SKIMS','SMHS','AIIMS','Army Medical Corps','Private Hospitals']
  },
  { key:'bpharm', sid:streams.medical, sname:'Medical', name:'B.Pharm. (Bachelor of Pharmacy)', dur:'4 Years', deg:'UG',
    desc:'Pharmacy degree covering drug formulation, pharmacology, and pharmaceutical management. Qualifies graduates to work as pharmacists in hospitals, drug stores, and pharma companies.',
    elig:'10+2 with PCB/PCM, min 50%', fees:'₹40,000–₹80,000/year',
    careers:['Pharmacist','Drug Inspector','Medical Representative','Quality Control Officer','Pharma Researcher'],
    skills:['Drug Formulation','Pharmacology','Quality Control','Regulatory Affairs','Patient Counselling'],
    subs:['Pharmaceutical Chemistry','Pharmacology','Pharmacognosy','Pharmaceutics','Pharmacy Practice'],
    recruiters:['Govt Hospitals','Private Pharmacies','Drug Companies','Drug Control Dept J&K','ESIC']
  },
  { key:'diploma_elect', sid:streams.vocational, sname:'Vocational', name:'Diploma in Electrical Engineering', dur:'3 Years', deg:'Diploma',
    desc:'Polytechnic diploma in electrical systems, power distribution, and maintenance. Opens doors to government departments like KPDCL and JPDCL and industrial roles.',
    elig:'10th pass with Science/Mathematics, min 40%', fees:'₹8,000–₹20,000/year',
    careers:['Electrician (Licensed)','Electrical Supervisor','Junior Engineer (JE)','Lineman','Wiring Contractor'],
    skills:['Electrical Wiring','Transformer Maintenance','PLC Programming','Power Distribution','Safety Standards'],
    subs:['Basic Electrical Engineering','Circuit Theory','Electrical Machines','Power Systems','Industrial Instrumentation'],
    recruiters:['KPDCL','JPDCL','JKPDD','PWD','Private Construction Firms','Industrial Plants']
  },
  { key:'diploma_it', sid:streams.science, sname:'Science', name:'Diploma in Information Technology', dur:'3 Years', deg:'Diploma',
    desc:'Polytechnic diploma covering networking, web development, and IT support. Suitable for quick entry into IT roles in J&K government departments and private sector.',
    elig:'10th pass with Mathematics, min 40%', fees:'₹8,000–₹20,000/year',
    careers:['IT Technician','Network Administrator','Web Designer','Data Entry Operator','Computer Instructor'],
    skills:['Networking','Web Design','Hardware Maintenance','Database Basics','MS Office'],
    subs:['Computer Fundamentals','Networking','Web Technologies','Programming Basics','DBMS','Project Work'],
    recruiters:['J&K e-Governance Dept','BSNL','Banks','Schools','IT Companies']
  },
  { key:'msc_cs', sid:streams.science, sname:'Science', name:'M.Sc. Computer Science', dur:'2 Years', deg:'PG',
    desc:'Postgraduate degree in advanced computing, AI, and research. Required for faculty positions in government colleges and research roles in national institutions.',
    elig:'B.Sc./BCA with Computer Science, min 55%', fees:'₹20,000–₹60,000/year',
    careers:['Assistant Professor','Data Scientist','AI Researcher','Software Architect','IT Consultant'],
    skills:['Advanced Algorithms','Machine Learning','Research Methodology','Cloud Computing','Big Data'],
    subs:['Advanced Algorithms','Machine Learning','Distributed Systems','Research Methods','Dissertation'],
    recruiters:['Universities','NIC','DRDO','TCS Research','Government Colleges']
  },
  { key:'mba', sid:streams.commerce, sname:'Commerce', name:'MBA (Master of Business Administration)', dur:'2 Years', deg:'PG',
    desc:'Advanced management degree. Specializations include Finance, Marketing, HR, and Operations. Preferred for senior management roles.',
    elig:'Any bachelor\'s degree with min 50% + CAT/MAT/JKCMAT', fees:'₹60,000–₹2,00,000/year',
    careers:['Business Manager','Financial Analyst','Marketing Head','HR Director','Consultant','Entrepreneur'],
    skills:['Strategic Management','Financial Analysis','Leadership','Business Communication','Data-Driven Decisions'],
    subs:['Organizational Behaviour','Financial Management','Marketing Management','Operations Management','Business Strategy','Capstone Project'],
    recruiters:['Banks','Insurance Companies','MNCs','Consulting Firms','Government PSUs','JKEDI']
  },
];

coursesData.forEach(c => {
  const id = insertCourse.run(
    c.name, c.sid, c.sname, c.dur, c.deg, c.desc, c.elig, c.fees,
    j(c.careers), j(c.skills), j(c.subs), j(c.recruiters), 1, now()
  ).lastInsertRowid;
  courseIds[c.key] = Number(id);
});
console.log(`✅ Courses seeded (${coursesData.length})`);

// ── CAREERS ───────────────────────────────────────────────────────────────────
const insertCareer = db.prepare(`
  INSERT INTO careers (title,stream_id,stream_name,description,salary_min,salary_max,sector,required_skills,required_courses,steps,growth_outlook,is_verified,last_updated)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,1,?)
`);
const careersData = [
  { title:'Software Developer', sid:streams.science, sname:'Science',
    desc:'Designs, builds, tests, and maintains software applications and systems. One of the fastest-growing careers globally, with strong demand from J&K government IT departments and private companies.',
    smin:400000, smax:1800000, sector:'Both',
    skills:['Python','JavaScript','SQL','Git','Problem Solving','Agile'],
    courses:[courseIds.bsc_cs, courseIds.bca, courseIds.btech],
    steps:j([
      {step:1, title:'Complete 10+2 with PCM/Science', desc:'Minimum 60% recommended for competitive courses.'},
      {step:2, title:'Pursue B.Sc. CS / BCA / B.Tech CSE', desc:'3-4 year undergraduate degree in computer science.'},
      {step:3, title:'Build projects & internships', desc:'Develop a portfolio on GitHub. Apply for internships.'},
      {step:4, title:'Learn in-demand skills', desc:'Python, JavaScript, React, SQL — follow online certifications.'},
      {step:5, title:'Apply for jobs or freelance', desc:'Target J&K e-Governance, NIC, TCS, Infosys, or remote roles.'},
      {step:6, title:'Consider M.Sc./M.Tech for advancement', desc:'Required for senior roles and government college teaching.'},
    ]), outlook:'High'
  },
  { title:'Data Analyst', sid:streams.science, sname:'Science',
    desc:'Analyzes large datasets to provide business insights. Critical role in banks, healthcare, and government planning departments.',
    smin:350000, smax:1500000, sector:'Both',
    skills:['Python','SQL','Excel','Power BI','Statistics','Data Visualization'],
    courses:[courseIds.bsc_cs, courseIds.btech, courseIds.msc_cs],
    steps:j([
      {step:1, title:'Complete 10+2 PCM', desc:'Strong mathematics background is essential.'},
      {step:2, title:'Pursue B.Sc. CS or B.Tech CSE', desc:'Focus on statistics and programming courses.'},
      {step:3, title:'Learn Python + SQL + Excel', desc:'Core tools for data analysis. Free resources on Kaggle, Coursera.'},
      {step:4, title:'Complete data analytics projects', desc:'Work on real datasets from government open data portals.'},
      {step:5, title:'Earn certifications', desc:'Google Data Analytics, Microsoft Power BI, or IBM Data Science.'},
      {step:6, title:'Apply for analyst roles', desc:'Target banks, healthcare departments, and government planning boards.'},
    ]), outlook:'High'
  },
  { title:'IAS / IPS Officer', sid:streams.arts, sname:'Arts',
    desc:'Indian Administrative/Police Service officer through UPSC Civil Services Examination. The most prestigious government career in India, responsible for district and state administration.',
    smin:600000, smax:2000000, sector:'Government',
    skills:['General Studies','Essay Writing','Current Affairs','Leadership','Public Administration','Decision Making'],
    courses:[courseIds.ba, courseIds.llb],
    steps:j([
      {step:1, title:'Complete 10+2 in any stream', desc:'Stream does not matter — any graduate can appear for UPSC.'},
      {step:2, title:'Pursue any bachelor\'s degree', desc:'B.A., B.Sc., B.Com., or any degree. Complete it first.'},
      {step:3, title:'Start UPSC Prelims preparation', desc:'Begin 1-2 years before attempt. Study NCERT books 6-12.'},
      {step:4, title:'Clear UPSC Prelims (GS + CSAT)', desc:'Minimum cutoff varies. Multiple attempts allowed (max 6 for General).'},
      {step:5, title:'Clear UPSC Mains (9 papers)', desc:'Essay, GS Papers 1-4, Optional Subject, and Language papers.'},
      {step:6, title:'Clear Personality Test (Interview)', desc:'Final stage. Selected candidates join LBSNAA for training.'},
    ]), outlook:'Medium'
  },
  { title:'School Teacher (Government)', sid:streams.arts, sname:'Arts',
    desc:'Government school teacher under J&K School Education Department, responsible for teaching 6th–12th grade students. Recruited through JKSSB.',
    smin:350000, smax:700000, sector:'Government',
    skills:['Subject Knowledge','Communication','Classroom Management','Assessment','Lesson Planning'],
    courses:[courseIds.bed, courseIds.ba],
    steps:j([
      {step:1, title:'Complete 10+2 in relevant stream', desc:'Choose stream aligned to the subject you want to teach.'},
      {step:2, title:'Pursue B.A. / B.Sc. / B.Com.', desc:'Graduation in the subject you intend to teach is mandatory.'},
      {step:3, title:'Complete B.Ed. (2 years)', desc:'B.Ed. is mandatory for government school teaching after 2019.'},
      {step:4, title:'Clear TET (Teacher Eligibility Test)', desc:'JKTET or CTET required for most government teaching posts.'},
      {step:5, title:'Apply through JKSSB', desc:'J&K Services Selection Board conducts recruitment for school teachers.'},
    ]), outlook:'Medium'
  },
  { title:'Chartered Accountant (CA)', sid:streams.commerce, sname:'Commerce',
    desc:'One of the most respected finance qualifications in India. CAs handle auditing, taxation, financial advisory, and corporate finance. Very high demand in J&K from banks and private firms.',
    smin:600000, smax:3000000, sector:'Both',
    skills:['Financial Accounting','Auditing','Taxation','Corporate Law','Financial Analysis','Tally'],
    courses:[courseIds.bcom, courseIds.bba],
    steps:j([
      {step:1, title:'10+2 with Commerce (min 50%)', desc:'Commerce background is ideal but not mandatory.'},
      {step:2, title:'Register for CA Foundation (ICAI)', desc:'Appears after 12th. 4 papers including Accounting and Law.'},
      {step:3, title:'Clear CA Foundation & Intermediate', desc:'CA Intermediate has 2 groups of 4 papers each.'},
      {step:4, title:'Complete Articleship (3 years)', desc:'Practical training under a practicing CA. Mandatory.'},
      {step:5, title:'Clear CA Final (8 papers)', desc:'The final stage. Pass both groups to become a qualified CA.'},
      {step:6, title:'Get COP or join a firm', desc:'Certificate of Practice for self-employment, or join a firm.'},
    ]), outlook:'High'
  },
  { title:'Banking Officer (PO / Manager)', sid:streams.commerce, sname:'Commerce',
    desc:'Probationary Officer in J&K Bank, SBI, or nationalized banks. Handles retail banking, loans, and customer relations. Extremely popular career path in J&K.',
    smin:380000, smax:900000, sector:'Government',
    skills:['Banking Operations','Communication','Numerical Ability','Customer Service','Financial Products'],
    courses:[courseIds.bcom, courseIds.bba, courseIds.mba],
    steps:j([
      {step:1, title:'Complete graduation (any stream)', desc:'Most bank PO exams require only a bachelor\'s degree.'},
      {step:2, title:'Prepare for J&K Bank / IBPS PO', desc:'Study Reasoning, Quantitative Aptitude, English, and Banking Awareness.'},
      {step:3, title:'Clear Prelims exam', desc:'100-question objective test. Sectional cutoffs apply.'},
      {step:4, title:'Clear Mains exam', desc:'More detailed test including Data Analysis and General Awareness.'},
      {step:5, title:'Clear Interview', desc:'Final selection round. Knowledge of banking and current affairs tested.'},
      {step:6, title:'Join as Probationary Officer', desc:'2-year probation period, then confirmed as Officer (Scale-I).'},
    ]), outlook:'Medium'
  },
  { title:'Doctor (MBBS / Medical Officer)', sid:streams.medical, sname:'Medical',
    desc:'Medical doctor serving as General Physician or Medical Officer in J&K government hospitals. Highly valued career addressing J&K\'s healthcare gap in rural areas.',
    smin:800000, smax:2500000, sector:'Government',
    skills:['Clinical Diagnosis','Patient Care','Emergency Medicine','Medical Ethics','Pharmacology'],
    courses:[courseIds.mbbs],
    steps:j([
      {step:1, title:'10+2 with PCB (min 60%)', desc:'Biology is mandatory. Physics and Chemistry also required.'},
      {step:2, title:'Clear NEET-UG (National Eligibility Entrance Test)', desc:'Mandatory for all MBBS admissions. Prepare at least 2 years.'},
      {step:3, title:'Complete MBBS (5.5 years)', desc:'4.5 years study + 1 year compulsory rotational internship.'},
      {step:4, title:'Register with J&K Medical Council', desc:'Mandatory before practice.'},
      {step:5, title:'Apply for Medical Officer (J&KHERC)', desc:'Government MO posts through J&K Health Recruitment & Promotion Committee.'},
      {step:6, title:'Consider MD/MS for specialization', desc:'2-3 year postgraduate degree for specialist career.'},
    ]), outlook:'High'
  },
  { title:'Journalist / Media Professional', sid:streams.arts, sname:'Arts',
    desc:'News reporter, editor, or media professional working with J&K-based newspapers, TV channels, or digital news portals. Covers politics, culture, conflict, and development in J&K.',
    smin:200000, smax:800000, sector:'Both',
    skills:['Writing','Research','Photography','Interviewing','Video Editing','Social Media'],
    courses:[courseIds.ba],
    steps:j([
      {step:1, title:'Complete 10+2 (any stream)', desc:'English and communication skills matter most.'},
      {step:2, title:'Pursue B.A. or Mass Communication degree', desc:'BA English, BA Journalism, or BJMC are preferred.'},
      {step:3, title:'Intern with local media houses', desc:'Kashmir Observer, Rising Kashmir, DD Kashir, Zee News J&K.'},
      {step:4, title:'Build a portfolio', desc:'Write articles, create a blog, contribute to online portals.'},
      {step:5, title:'Apply for staff reporter / correspondent roles', desc:'Most J&K news agencies hire reporters with internship experience.'},
    ]), outlook:'Medium'
  },
  { title:'Pharmacist', sid:streams.medical, sname:'Medical',
    desc:'Dispenses medicines, counsels patients on drug usage, and ensures safe medication practices in hospitals and drug stores. Government pharmacist posts available through JKSSB.',
    smin:250000, smax:600000, sector:'Both',
    skills:['Drug Knowledge','Patient Counselling','Inventory Management','Quality Control','Dispensing'],
    courses:[courseIds.bpharm],
    steps:j([
      {step:1, title:'10+2 with PCB/PCM (min 50%)', desc:'Biology or Mathematics with Chemistry required.'},
      {step:2, title:'Complete B.Pharm. (4 years)', desc:'From a PCI-approved pharmacy college.'},
      {step:3, title:'Register with J&K Pharmacy Council', desc:'Mandatory to practice as a pharmacist in J&K.'},
      {step:4, title:'Apply for government pharmacist posts', desc:'JKSSB recruits pharmacists for government hospitals.'},
    ]), outlook:'Medium'
  },
  { title:'Junior Engineer (JE) – Electrical', sid:streams.vocational, sname:'Vocational',
    desc:'Government junior engineer in J&K Power Development Department (KPDCL/JPDCL). Responsible for electrical infrastructure maintenance and distribution.',
    smin:350000, smax:650000, sector:'Government',
    skills:['Electrical Systems','Power Distribution','Circuit Analysis','Safety Compliance','Technical Drawing'],
    courses:[courseIds.diploma_elect],
    steps:j([
      {step:1, title:'Complete 10th with Science/Math', desc:'Minimum pass marks required for polytechnic admission.'},
      {step:2, title:'Diploma in Electrical Engineering (3 years)', desc:'From a government polytechnic in J&K.'},
      {step:3, title:'Apply for JE posts (JKSSB / KPDCL)', desc:'J&K Services Selection Board announces JE vacancies regularly.'},
      {step:4, title:'Clear written examination', desc:'Technical and general aptitude test.'},
      {step:5, title:'Join as Junior Engineer on probation', desc:'2-year probation. Regularization based on performance.'},
    ]), outlook:'Medium'
  },
];
careersData.forEach(c => {
  insertCareer.run(
    c.title, c.sid, c.sname, c.desc, c.smin, c.smax, c.sector,
    j(c.skills), j(c.courses), c.steps, c.outlook, now()
  );
});
console.log(`✅ Careers seeded (${careersData.length})`);

// ── COLLEGES ──────────────────────────────────────────────────────────────────
const insertCollege = db.prepare(`
  INSERT INTO colleges (name,district,address,type,established,affiliated_to,naac_grade,total_seats,hostel_available,facilities,description,website,phone,admission_status,is_verified,last_updated)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?)
`);
const insertCC = db.prepare(`INSERT INTO college_courses (college_id,course_id,course_name,seats,fees,cutoff_marks) VALUES (?,?,?,?,?,?)`);

const collegesData = [
  {
    name:"Government Degree College, Sopore", dist:"Baramulla", addr:"NH-1A, Sopore, Baramulla – 193201",
    est:1967, aff:"Cluster University Srinagar", naac:"B+", seats:1200, hostel:1,
    fac:["Library","Science Labs","Computer Lab","Sports Ground","NCC","NSS"],
    desc:"One of the oldest government degree colleges in North Kashmir, offering undergraduate programmes in Science, Arts and Commerce. Known for strong academic results and NCC activities.",
    web:"https://gdcsopore.jk.gov.in", phone:"01954-221234", status:"Applications Open",
    courses:[
      {id:courseIds.ba, name:"B.A.", seats:360, fees:"₹3,500/year", cutoff:55.0},
      {id:courseIds.bsc_cs, name:"B.Sc. CS", seats:60, fees:"₹5,500/year", cutoff:72.0},
      {id:courseIds.bcom, name:"B.Com.", seats:120, fees:"₹4,000/year", cutoff:60.0},
    ]
  },
  {
    name:"Government Degree College, Baramulla", dist:"Baramulla", addr:"College Road, Baramulla – 193101",
    est:1959, aff:"Cluster University Srinagar", naac:"B", seats:1800, hostel:1,
    fac:["Library","Science Labs","Computer Lab","NCC","Sports Complex","Canteen","NSS"],
    desc:"Government Degree College Baramulla is one of the premier educational institutions in North Kashmir, with a rich academic tradition spanning over six decades.",
    web:"https://gdcbaramulla.jk.gov.in", phone:"01952-220789", status:"Applications Open",
    courses:[
      {id:courseIds.ba, name:"B.A.", seats:480, fees:"₹3,200/year", cutoff:52.0},
      {id:courseIds.bsc_physics, name:"B.Sc. Physics", seats:60, fees:"₹5,000/year", cutoff:68.0},
      {id:courseIds.bcom, name:"B.Com.", seats:120, fees:"₹3,800/year", cutoff:58.0},
      {id:courseIds.bed, name:"B.Ed.", seats:100, fees:"₹12,000/year", cutoff:55.0},
    ]
  },
  {
    name:"Amar Singh College, Srinagar", dist:"Srinagar", addr:"Lalamusa, Srinagar – 190008",
    est:1905, aff:"Cluster University Srinagar", naac:"A", seats:3000, hostel:0,
    fac:["Central Library","Advanced Labs","Computer Centre","Indoor Sports","Auditorium","NSS","NCC","WiFi Campus"],
    desc:"One of the oldest and most prestigious degree colleges in J&K, affiliated to Cluster University Srinagar. Offers a wide range of UG courses in Science, Arts and Commerce. Known for its historic campus and excellent faculty.",
    web:"https://asc.edu.in", phone:"0194-2460022", status:"Applications Open",
    courses:[
      {id:courseIds.ba, name:"B.A.", seats:720, fees:"₹4,200/year", cutoff:58.0},
      {id:courseIds.bsc_cs, name:"B.Sc. CS", seats:120, fees:"₹7,000/year", cutoff:80.0},
      {id:courseIds.bsc_physics, name:"B.Sc. Physics", seats:90, fees:"₹5,500/year", cutoff:75.0},
      {id:courseIds.bcom, name:"B.Com.", seats:240, fees:"₹4,800/year", cutoff:65.0},
    ]
  },
  {
    name:"Government Degree College, Anantnag", dist:"Anantnag", addr:"Old Town, Anantnag – 192101",
    est:1963, aff:"Islamic University of Science and Technology", naac:"B+", seats:2000, hostel:1,
    fac:["Library","Science Labs","Computer Lab","Girls Hostel","Sports Ground","NCC","NSS"],
    desc:"Premier government college serving South Kashmir, offering UG programmes in Science, Arts and Commerce. Important centre for students from Anantnag, Kulgam and Shopian districts.",
    web:"https://gdcanantnag.jk.gov.in", phone:"01932-222456", status:"Applications Open",
    courses:[
      {id:courseIds.ba, name:"B.A.", seats:600, fees:"₹3,200/year", cutoff:50.0},
      {id:courseIds.bsc_cs, name:"B.Sc. CS", seats:60, fees:"₹5,500/year", cutoff:70.0},
      {id:courseIds.bcom, name:"B.Com.", seats:120, fees:"₹3,800/year", cutoff:55.0},
    ]
  },
  {
    name:"Government College for Women, M.A. Road, Srinagar", dist:"Srinagar", addr:"M.A. Road, Srinagar – 190001",
    est:1948, aff:"Cluster University Srinagar", naac:"A", seats:2800, hostel:1,
    fac:["Central Library","Advanced Labs","Computer Lab","Girls Hostel","Women's Welfare Cell","NSS","WiFi"],
    desc:"Largest women's college in J&K, dedicated exclusively to girl students. Offers undergraduate programmes across Science, Arts, Commerce and Education. Strong focus on women empowerment and higher education.",
    web:"https://gcwsrinagar.jk.gov.in", phone:"0194-2452711", status:"Applications Open",
    courses:[
      {id:courseIds.ba, name:"B.A.", seats:840, fees:"₹3,500/year", cutoff:55.0},
      {id:courseIds.bsc_cs, name:"B.Sc. CS", seats:90, fees:"₹6,000/year", cutoff:78.0},
      {id:courseIds.bcom, name:"B.Com.", seats:240, fees:"₹4,200/year", cutoff:60.0},
      {id:courseIds.bed, name:"B.Ed.", seats:100, fees:"₹12,000/year", cutoff:58.0},
    ]
  },
  {
    name:"Government Medical College, Srinagar (SMHS)", dist:"Srinagar", addr:"Karan Nagar, Srinagar – 190010",
    est:1959, aff:"University of Kashmir", naac:"A+", seats:150, hostel:1,
    fac:["Teaching Hospital (SMHS)","Medical Library","Dissection Hall","Clinical Labs","Anatomy Museum","PG Hostel"],
    desc:"One of the premier medical colleges in North India, offering MBBS and various PG medical programmes. Affiliated to the associated SMHS hospital providing extensive clinical exposure.",
    web:"https://gmcsrinagar.jk.gov.in", phone:"0194-2402040", status:"Applications Closed",
    courses:[
      {id:courseIds.mbbs, name:"MBBS", seats:150, fees:"₹28,000/year", cutoff:90.0},
    ]
  },
  {
    name:"Government Degree College, Jammu", dist:"Jammu", addr:"Canal Road, Jammu – 180001",
    est:1947, aff:"University of Jammu", naac:"A", seats:3500, hostel:1,
    fac:["Central Library","Science Labs","Computer Lab","Sports Complex","Cultural Centre","NCC","NSS","WiFi"],
    desc:"One of the largest and most historic government colleges in Jammu, serving thousands of students from Jammu and surrounding districts. Excellent academic record and diverse programme offerings.",
    web:"https://gdcjammu.jk.gov.in", phone:"0191-2543219", status:"Applications Open",
    courses:[
      {id:courseIds.ba, name:"B.A.", seats:960, fees:"₹3,000/year", cutoff:55.0},
      {id:courseIds.bsc_cs, name:"B.Sc. CS", seats:120, fees:"₹6,000/year", cutoff:75.0},
      {id:courseIds.bcom, name:"B.Com.", seats:300, fees:"₹3,500/year", cutoff:60.0},
      {id:courseIds.bca, name:"BCA", seats:60, fees:"₹8,000/year", cutoff:65.0},
    ]
  },
  {
    name:"Government Polytechnic, Srinagar", dist:"Srinagar", addr:"Airport Road, Nowgam, Srinagar – 190015",
    est:1960, aff:"Board of Technical Education J&K", naac:null, seats:600, hostel:0,
    fac:["Electrical Workshops","Computer Lab","Mechanical Workshop","Drawing Hall","Library"],
    desc:"Leading government polytechnic in Kashmir offering diploma programmes in Electrical, Mechanical, Civil, Computer Science and Electronics Engineering. Provides practical technical education for immediate employment.",
    web:"https://gpsrinagar.jk.gov.in", phone:"0194-2460780", status:"Applications Open",
    courses:[
      {id:courseIds.diploma_elect, name:"Diploma – Electrical Engg.", seats:60, fees:"₹4,500/year", cutoff:45.0},
      {id:courseIds.diploma_it, name:"Diploma – IT", seats:60, fees:"₹4,500/year", cutoff:48.0},
    ]
  },
  {
    name:"Government Degree College, Kupwara", dist:"Kupwara", addr:"Kupwara – 193222",
    est:1975, aff:"Cluster University Srinagar", naac:"B", seats:900, hostel:0,
    fac:["Library","Science Labs","Computer Lab","NSS","Sports Ground"],
    desc:"Government college serving the remote Kupwara district on the Line of Control. Important institution for students from border areas who otherwise would have to travel to Baramulla or Srinagar.",
    web:"https://gdckupwara.jk.gov.in", phone:"01955-262678", status:"Applications Open",
    courses:[
      {id:courseIds.ba, name:"B.A.", seats:360, fees:"₹2,800/year", cutoff:48.0},
      {id:courseIds.bcom, name:"B.Com.", seats:120, fees:"₹3,200/year", cutoff:50.0},
    ]
  },
  {
    name:"Government Medical College, Jammu", dist:"Jammu", addr:"Bakshi Nagar, Jammu – 180001",
    est:1959, aff:"University of Jammu", naac:"A+", seats:200, hostel:1,
    fac:["Government Medical College Hospital","Medical Library","Clinical Labs","Anatomy & Pathology Dept","Resident Hostel"],
    desc:"One of the two premier government medical colleges in J&K, providing undergraduate and postgraduate medical education. Associated with the 2000-bed Government Medical College Hospital.",
    web:"https://gmcjammu.nic.in", phone:"0191-2543880", status:"Applications Closed",
    courses:[
      {id:courseIds.mbbs, name:"MBBS", seats:200, fees:"₹30,000/year", cutoff:91.0},
    ]
  },
  {
    name:"Government Commerce College, Jammu", dist:"Jammu", addr:"Parade, Jammu – 180001",
    est:1971, aff:"University of Jammu", naac:"B+", seats:1200, hostel:0,
    fac:["Commerce Library","Computer Lab","Language Lab","NSS","Sports Ground"],
    desc:"Specialized government commerce college serving Jammu students. Strong industry connections with J&K Bank and local business community. Excellent placement record for banking and finance careers.",
    web:"https://gccjammu.jk.gov.in", phone:"0191-2579034", status:"Applications Open",
    courses:[
      {id:courseIds.bcom, name:"B.Com.", seats:480, fees:"₹3,000/year", cutoff:62.0},
      {id:courseIds.bba, name:"BBA", seats:60, fees:"₹8,000/year", cutoff:60.0},
    ]
  },
  {
    name:"Government Degree College, Poonch", dist:"Poonch", addr:"Surankote Road, Poonch – 185101",
    est:1977, aff:"University of Jammu", naac:"B", seats:800, hostel:1,
    fac:["Library","Science Labs","Boys Hostel","NSS","Sports Ground"],
    desc:"Government college serving the Poonch district, an important institution for students from the Pir Panjal region. Offers UG programmes in Science and Arts.",
    web:"https://gdcpoonch.jk.gov.in", phone:"01965-220567", status:"Applications Open",
    courses:[
      {id:courseIds.ba, name:"B.A.", seats:360, fees:"₹2,800/year", cutoff:46.0},
      {id:courseIds.bsc_physics, name:"B.Sc. Physics", seats:60, fees:"₹4,500/year", cutoff:58.0},
    ]
  },
];

collegesData.forEach(c => {
  const cid = insertCollege.run(
    c.name, c.dist, c.addr, 'Government', c.est, c.aff, c.naac, c.seats,
    c.hostel, j(c.fac), c.desc, c.web, c.phone, c.status, now()
  ).lastInsertRowid;
  c.courses.forEach(cc => insertCC.run(cid, cc.id, cc.name, cc.seats, cc.fees, cc.cutoff));
});
console.log(`✅ Colleges seeded (${collegesData.length})`);

// ── SCHOLARSHIPS ──────────────────────────────────────────────────────────────
const insertScholarship = db.prepare(`
  INSERT INTO scholarships (name,provider,amount,eligibility,description,deadline,application_url,stream_filter,is_verified,last_updated)
  VALUES (?,?,?,?,?,?,?,?,1,?)
`);
const scholarships = [
  { name:"PM Scholarship Scheme for Central Armed Police Forces (CAPF)",
    provider:"Ministry of Home Affairs, Govt. of India", amount:"₹3,000/month (Boys) | ₹3,500/month (Girls)",
    elig:j({income:"All",category:"All",class_percent:60,stream:"All",note:"Wards of CAPF/RPF personnel"}),
    desc:"Scholarship for wards of ex-servicemen from Central Armed Police Forces and Railway Protection Force. Covers UG and PG courses.",
    deadline:"2024-12-31", url:"https://scholarships.gov.in", streams:null
  },
  { name:"J&K State Merit Scholarship (JKBOSE)",
    provider:"J&K Higher Education Department", amount:"₹2,500–₹5,000/month",
    elig:j({income:"Below 8 LPA",category:"All",class_percent:75,stream:"All",note:"Top JKBOSE class 12 performers"}),
    desc:"Merit-based scholarship for JKBOSE 12th toppers admitted to government colleges in J&K. Covers full tuition fee and monthly stipend.",
    deadline:"2024-10-31", url:"https://jkhighereducation.nic.in", streams:null
  },
  { name:"National Scholarship Portal – Post Matric (SC/ST)",
    provider:"Ministry of Social Justice, Govt. of India", amount:"Up to ₹13,500/year",
    elig:j({income:"Below 2.5 LPA",category:["SC","ST"],class_percent:0,stream:"All"}),
    desc:"Post-matric scholarship for SC/ST students pursuing higher education. Covers maintenance, tuition, and study tour charges.",
    deadline:"2024-11-30", url:"https://scholarships.gov.in", streams:null
  },
  { name:"J&K Ladders of Opportunity Scholarship",
    provider:"J&K Higher Education Department", amount:"₹10,000–₹50,000/year",
    elig:j({income:"Below 6 LPA",category:"All",class_percent:65,stream:"All",note:"Students from border/far-flung areas"}),
    desc:"Scheme to encourage students from border, remote, and backward areas of J&K to pursue higher education. Priority to Ladakh, Poonch, Rajouri, Kupwara, and Bandipora districts.",
    deadline:"2024-11-15", url:"https://jkhighereducation.nic.in", streams:null
  },
  { name:"INSPIRE Scholarship – Department of Science and Technology",
    provider:"Dept. of Science & Technology, Govt. of India", amount:"₹80,000/year",
    elig:j({income:"All",category:"All",class_percent:80,stream:"Science",note:"Top 1% in class 12 Science board exams"}),
    desc:"Innovation in Science Pursuit for Inspired Research (INSPIRE). For students who secure top 1% marks in 10+2 Science stream and pursue natural/basic sciences at UG and PG level.",
    deadline:"2024-10-15", url:"https://online-inspire.gov.in", streams:j(["Science","Medical"])
  },
  { name:"Central Sector Scholarship for College and University Students",
    provider:"Ministry of Education, Govt. of India", amount:"₹12,000/year (First 3 Years) | ₹20,000/year (4th–5th Year)",
    elig:j({income:"Below 8 LPA",category:"All",class_percent:80,stream:"All",note:"Above 80th percentile in 10+2 board exams"}),
    desc:"For students above 80th percentile in their 10+2 board exams pursuing full-time undergraduate courses. One of the most widely availed scholarships in J&K.",
    deadline:"2024-11-30", url:"https://scholarships.gov.in", streams:null
  },
  { name:"Pragati Scholarship for Girls (AICTE)",
    provider:"All India Council for Technical Education (AICTE)", amount:"₹50,000/year",
    elig:j({income:"Below 8 LPA",category:"All",class_percent:0,stream:"Science",gender:"Female",note:"Girls in AICTE-approved technical courses"}),
    desc:"Scholarship scheme for girl students pursuing technical education (engineering, architecture, pharmacy, MBA, etc.) in AICTE-approved institutions.",
    deadline:"2024-11-30", url:"https://scholarships.gov.in", streams:j(["Science","Medical"])
  },
  { name:"J&K Post Matric Scholarship for OBC Students",
    provider:"J&K Backward Classes Development Corporation", amount:"Up to ₹10,000/year",
    elig:j({income:"Below 1 LPA",category:["OBC"],class_percent:0,stream:"All"}),
    desc:"Post-matric scholarship for Other Backward Classes (OBC) students domiciled in J&K. Covers tuition fees and living expenses for college education.",
    deadline:"2024-12-15", url:"https://jkbcdc.jk.gov.in", streams:null
  },
  { name:"PMSSS – Prime Minister's Special Scholarship Scheme",
    provider:"All India Council for Technical Education (AICTE)", amount:"₹30,000/year (Tuition) + ₹1,00,000/year (Living)",
    elig:j({income:"Below 8 LPA",category:"All",class_percent:60,stream:"All",note:"J&K/Ladakh domicile students for study outside J&K"}),
    desc:"Enables J&K and Ladakh domicile students to study in good institutions outside J&K/Ladakh. Covers tuition and maintenance expenses. One of the most valuable scholarships for J&K students.",
    deadline:"2024-09-30", url:"https://jkscholarship.nic.in", streams:null
  },
  { name:"National Means-cum-Merit Scholarship (NMMS)",
    provider:"Ministry of Education, Govt. of India", amount:"₹12,000/year",
    elig:j({income:"Below 1.5 LPA",category:"All",class_percent:55,stream:"All",note:"Class 8 students selected through state-level exam"}),
    desc:"For economically weaker students from class 9 onwards. Selected through state-level exam in class 8. Continues up to class 12 and helps retain students in school.",
    deadline:"2024-08-31", url:"https://scholarships.gov.in", streams:null
  },
];
scholarships.forEach(s => insertScholarship.run(s.name,s.provider,s.amount,s.elig,s.desc,s.deadline,s.url,s.streams,now()));
console.log(`✅ Scholarships seeded (${scholarships.length})`);

// ── RESOURCES ─────────────────────────────────────────────────────────────────
const insertResource = db.prepare(`
  INSERT INTO resources (title,type,subject,stream_name,course_name,career_name,url,description,is_free,is_verified,last_updated)
  VALUES (?,?,?,?,?,?,?,?,?,1,?)
`);
const resources = [
  {title:"NCERT Class 12 Physics Textbook (Part 1 & 2)",type:"PDF",subject:"Physics",stream:"Science",course:null,career:null,url:"https://ncert.nic.in/textbook.php",desc:"Official NCERT Physics textbooks for Class 12. Covers all topics from the J&K board Physics syllabus.",free:1},
  {title:"NCERT Class 12 Chemistry (Part 1 & 2)",type:"PDF",subject:"Chemistry",stream:"Science",course:null,career:null,url:"https://ncert.nic.in/textbook.php",desc:"Official NCERT Chemistry textbooks. Foundation for competitive exams like NEET and JEE.",free:1},
  {title:"Khan Academy – Mathematics",type:"Website",subject:"Mathematics",stream:"Science",course:null,career:null,url:"https://www.khanacademy.org/math",desc:"Free, world-class mathematics education from grade 1 to calculus. Excellent for JKBOSE Mathematics preparation.",free:1},
  {title:"Python Programming for Beginners – CS50P",type:"Video",subject:"Computer Science",stream:"Science",course:"B.Sc. Computer Science",career:"Software Developer",url:"https://cs50.harvard.edu/python",desc:"Harvard University's free introduction to programming using Python. Best free coding course available online.",free:1},
  {title:"freeCodeCamp – Full Stack Web Development",type:"Website",subject:"Computer Science",stream:"Science",course:"BCA",career:"Software Developer",url:"https://www.freecodecamp.org",desc:"Free 300-hour web development curriculum covering HTML, CSS, JavaScript, React, Node.js. Certificate on completion.",free:1},
  {title:"Tally ERP 9 & TallyPrime Complete Course",type:"Video",subject:"Accountancy",stream:"Commerce",course:"B.Com.",career:"Accountant",url:"https://www.youtube.com/results?search_query=tally+erp+9+full+course",desc:"Comprehensive Tally ERP 9 course on YouTube. Essential skill for accountancy and commerce careers in J&K.",free:1},
  {title:"NCERT Class 12 Accountancy (Part 1 & 2)",type:"PDF",subject:"Accountancy",stream:"Commerce",course:"B.Com.",career:null,url:"https://ncert.nic.in/textbook.php",desc:"Official NCERT Accountancy textbooks. Foundation for B.Com. and CA Foundation exams.",free:1},
  {title:"UPSC CSE – Unacademy Free Lectures",type:"Video",subject:"General Studies",stream:"Arts",course:null,career:"IAS / IPS Officer",url:"https://unacademy.com/goal/ias-upsc-civil-services-examination/KSCGY",desc:"Free IAS preparation lectures covering History, Geography, Polity and Economy by top educators.",free:1},
  {title:"Vajiram & Ravi – UPSC Notes (Free PDFs)",type:"PDF",subject:"General Studies",stream:"Arts",course:null,career:"IAS / IPS Officer",url:"https://vajiramandr.com/free-material",desc:"High-quality UPSC study notes from one of India's premier coaching institutes. Free downloadable PDFs.",free:1},
  {title:"ICAI Study Material – CA Foundation",type:"PDF",subject:"Accountancy",stream:"Commerce",course:null,career:"Chartered Accountant (CA)",url:"https://www.icai.org/post.html?post_id=11592",desc:"Official ICAI study material for CA Foundation examination. Free for registered students.",free:1},
  {title:"Allen NEET Free Mock Tests & Study Material",type:"Website",subject:"Biology",stream:"Medical",course:"MBBS",career:"Doctor (MBBS / Medical Officer)",url:"https://allen.ac.in/online-coaching/neet",desc:"Practice NEET questions and mock tests. Biology, Physics and Chemistry topic-wise tests.",free:1},
  {title:"NCERT Biology Class 11 & 12",type:"PDF",subject:"Biology",stream:"Medical",course:"MBBS",career:null,url:"https://ncert.nic.in/textbook.php",desc:"Core NCERT Biology textbooks. The most important resource for NEET-UG preparation.",free:1},
  {title:"Google Digital Garage – Digital Marketing",type:"Website",subject:"Business Studies",stream:"Commerce",course:"BBA",career:"Business Manager",url:"https://learndigital.withgoogle.com",desc:"Free Google certified digital marketing course. 26 modules covering SEO, SEM, analytics, and social media.",free:1},
  {title:"Coursera – Machine Learning by Andrew Ng",type:"Video",subject:"Computer Science",stream:"Science",course:"M.Sc. Computer Science",career:"Data Analyst",url:"https://www.coursera.org/specializations/machine-learning-introduction",desc:"World-famous ML course from Stanford University. Audit for free. Fundamentals of machine learning with Python.",free:1},
  {title:"J&K SSRB / JKSSB Exam Preparation Guide",type:"PDF",subject:"General Knowledge",stream:"Arts",course:null,career:"School Teacher (Government)",url:"https://jkssb.nic.in",desc:"Official JKSSB syllabus and previous year question papers for various government service examinations in J&K.",free:1},
  {title:"Diksha Platform – NCERT e-Textbooks",type:"App",subject:"All Subjects",stream:null,course:null,career:null,url:"https://diksha.gov.in",desc:"Government of India's official e-learning platform with digitized NCERT textbooks in English, Hindi and regional languages.",free:1},
  {title:"SWAYAM – Free Online Courses by UGC",type:"Website",subject:"Multiple",stream:null,course:null,career:null,url:"https://swayam.gov.in",desc:"Government of India's MOOC platform with UGC-recognized courses from IITs, IIMs and central universities. Earnable credits.",free:1},
  {title:"J&K Bank PO – Previous Year Papers & Syllabus",type:"PDF",subject:"Banking Awareness",stream:"Commerce",course:null,career:"Banking Officer (PO / Manager)",url:"https://www.jkbank.com/careers",desc:"Official J&K Bank recruitment syllabus and previous year question papers. Essential for J&K Bank PO aspirants.",free:1},
  {title:"Pharmacy Council of India – Study Resources",type:"Website",subject:"Pharmacy",stream:"Medical",course:"B.Pharm.",career:"Pharmacist",url:"https://www.pci.nic.in",desc:"Regulatory resources, syllabus, and exam guidelines for pharmacy students. Includes GPAT preparation material.",free:1},
  {title:"KPDCL / JPDCL – Junior Engineer Study Material",type:"PDF",subject:"Electrical Engineering",stream:"Vocational",course:"Diploma in Electrical Engineering",career:"Junior Engineer (JE) – Electrical",url:"https://jkspdc.nic.in",desc:"Electrical engineering objective questions for JE examination conducted by JKSSB. Covers circuits, power systems, and safety.",free:1},
];
resources.forEach(r => insertResource.run(r.title,r.type,r.subject,r.stream,r.course,r.career,r.url,r.desc,r.free,now()));
console.log(`✅ Resources seeded (${resources.length})`);

// ── TIMELINE EVENTS ───────────────────────────────────────────────────────────
const insertTimeline = db.prepare(`
  INSERT INTO timeline_events (title,description,event_date,category,stream_filter,status,is_verified,last_updated)
  VALUES (?,?,?,?,?,?,1,?)
`);
const events = [
  {title:"JKBOSE Class 12 Annual Regular Examination 2025",desc:"Annual regular examination for Class 12 students under J&K Board of School Education.",date:"2025-03-01",cat:"Exam",streams:null,status:"upcoming"},
  {title:"JKBOSE Class 12 Result Declaration",desc:"Declaration of JKBOSE Class 12 Annual Regular Examination results for Kashmir and Jammu divisions.",date:"2025-05-15",cat:"Exam",streams:null,status:"upcoming"},
  {title:"NEET-UG 2025 Application Start",desc:"National Eligibility cum Entrance Test (NEET-UG) application process begins for medical admissions.",date:"2025-01-20",cat:"Exam",streams:j(["Medical","Science"]),status:"completed"},
  {title:"NEET-UG 2025 Examination",desc:"NEET-UG examination for admission to MBBS, BDS and other medical programmes nationwide.",date:"2025-05-04",cat:"Exam",streams:j(["Medical","Science"]),status:"upcoming"},
  {title:"JKCET 2025 – Application Form",desc:"J&K Combined Entrance Test application for admission to B.Tech/B.Pharm in J&K government colleges.",date:"2025-03-10",cat:"Exam",streams:j(["Science","Medical"]),status:"upcoming"},
  {title:"JKCET 2025 – Examination",desc:"J&K Common Entrance Test for engineering and pharmacy admissions.",date:"2025-05-25",cat:"Exam",streams:j(["Science","Medical"]),status:"upcoming"},
  {title:"Cluster University Srinagar – UG Admissions Open",desc:"Undergraduate admissions open for B.A., B.Sc. and B.Com. in affiliated government colleges.",date:"2025-06-01",cat:"Admission",streams:null,status:"upcoming"},
  {title:"University of Jammu – UG Admissions",desc:"Undergraduate admissions start for government colleges affiliated to University of Jammu.",date:"2025-06-05",cat:"Admission",streams:null,status:"upcoming"},
  {title:"J&K State Merit Scholarship – Application Deadline",desc:"Last date to apply for J&K State Merit Scholarship for JKBOSE toppers.",date:"2025-07-31",cat:"Scholarship",streams:null,status:"upcoming"},
  {title:"Central Sector Scholarship – Application Deadline",desc:"Last date for Central Sector Scheme of Scholarship for College and University Students on NSP.",date:"2025-10-31",cat:"Scholarship",streams:null,status:"upcoming"},
  {title:"PMSSS – Prime Minister's Special Scholarship – Deadline",desc:"Last date to apply for PMSSS for J&K/Ladakh students seeking education outside J&K.",date:"2025-09-30",cat:"Scholarship",streams:null,status:"upcoming"},
  {title:"UPSC Civil Services Preliminary Examination 2025",desc:"UPSC CSE Prelims – General Studies and CSAT papers. Result of which determines Mains eligibility.",date:"2025-05-25",cat:"Exam",streams:j(["Arts","Commerce","Science"]),status:"upcoming"},
  {title:"INSPIRE Scholarship – Application Deadline",desc:"Department of Science & Technology INSPIRE scholarship application closes for Science toppers.",date:"2025-08-31",cat:"Scholarship",streams:j(["Science","Medical"]),status:"upcoming"},
  {title:"JKSSB – Teacher (RE-ET) Recruitment Notification",desc:"J&K Services Selection Board notification for Rehbar-e-Taleem (RE-ET) and School Teacher posts.",date:"2025-04-01",cat:"Admission",streams:null,status:"upcoming"},
  {title:"GMC Srinagar & GMC Jammu – MBBS Admissions (NEET Counselling)",desc:"J&K NEET counselling begins for MBBS admissions to Government Medical Colleges and private medical colleges.",date:"2025-08-15",cat:"Admission",streams:j(["Medical"]),status:"upcoming"},
];
events.forEach(e => insertTimeline.run(e.title,e.desc,e.date,e.cat,e.streams,e.status,now()));
console.log(`✅ Timeline events seeded (${events.length})`);

// ── ASSESSMENT RESULTS for demo student ──────────────────────────────────────
const insertResult = db.prepare(`
  INSERT INTO assessment_results (user_id,answers,scores,completed_at)
  VALUES (?,?,?,?)
`);
const demoAnswers = {1:'a',2:'a',3:'a',4:'b',5:'b',6:'b',7:'a',8:'b',9:'c',10:'a',11:'a',12:'a'};
const demoScores = {Science:20, Commerce:8, Arts:4, Medical:4, Vocational:6};
insertResult.run(s1Id, j(demoAnswers), j(demoScores), now());
console.log('✅ Demo assessment result inserted for student');

// ── STUDENT PROGRESS ─────────────────────────────────────────────────────────
const insertProgress = db.prepare(`
  INSERT INTO student_progress (user_id,assessment_completed,profile_completed,courses_viewed,colleges_shortlisted,scholarships_saved)
  VALUES (?,?,?,?,?,?)
`);
insertProgress.run(s1Id, 1, 1, 5, 3, 2);
insertProgress.run(s2Id, 0, 1, 2, 1, 1);
insertProgress.run(s3Id, 1, 1, 3, 2, 3);
console.log('✅ Student progress seeded');

// ── ROADMAP ITEMS for demo student ───────────────────────────────────────────
const insertRoadmap = db.prepare(`
  INSERT INTO roadmap_items (user_id,step_number,title,description,status,category,link)
  VALUES (?,?,?,?,?,?,?)
`);
const roadmapSteps = [
  {n:1, title:"Complete Your Profile", desc:"Add your district, board, class 12 marks, and career goals for personalized recommendations.", status:"completed", cat:"Profile", link:"/profile"},
  {n:2, title:"Take the Interest & Aptitude Assessment", desc:"12-question assessment to identify your strengths and match you to the right streams and careers.", status:"completed", cat:"Assessment", link:"/assessment"},
  {n:3, title:"Review Your Stream Recommendations", desc:"Check your recommended streams (Science, Commerce, Arts) with match percentages and career paths.", status:"completed", cat:"Assessment", link:"/recommendations"},
  {n:4, title:"Explore Recommended Courses", desc:"Browse B.Sc. CS, B.Tech, BCA courses recommended for your profile and shortlist your favourites.", status:"in_progress", cat:"Course", link:"/courses"},
  {n:5, title:"Deep-Dive Into Career Paths", desc:"Explore career details, 'How Do I Become This?' ladder, and salary ranges for Software Developer and Data Analyst.", status:"pending", cat:"Career", link:"/careers"},
  {n:6, title:"Find Government Colleges Near You", desc:"Browse government colleges in Srinagar offering B.Sc. CS and compare their facilities, seats, and cut-offs.", status:"pending", cat:"College", link:"/colleges"},
  {n:7, title:"Compare Top Colleges", desc:"Use the College Comparison tool to evaluate 2-3 colleges side-by-side on all parameters.", status:"pending", cat:"College", link:"/colleges/compare"},
  {n:8, title:"Check Scholarship Eligibility", desc:"Review all available scholarships and check your eligibility for INSPIRE, Central Sector, and PMSSS.", status:"pending", cat:"Scholarship", link:"/scholarships"},
  {n:9, title:"Save Key Admission Deadlines", desc:"Review the Admission Timeline and note critical deadlines for JKCET, NEET, and UG admissions.", status:"pending", cat:"College", link:"/timeline"},
  {n:10, title:"Apply to Your Chosen College", desc:"Submit your application to the selected government college before the deadline.", status:"pending", cat:"College", link:"/colleges"},
];
roadmapSteps.forEach(s => insertRoadmap.run(s1Id, s.n, s.title, s.desc, s.status, s.cat, s.link));
console.log('✅ Roadmap seeded for demo student');

// ── SHORTLISTS for demo student ───────────────────────────────────────────────
const insertShortlist = db.prepare(`INSERT OR IGNORE INTO student_shortlists (user_id,entity,entity_id) VALUES (?,?,?)`);
insertShortlist.run(s1Id, 'course', courseIds.bsc_cs);
insertShortlist.run(s1Id, 'course', courseIds.btech);
insertShortlist.run(s1Id, 'college', 3); // Amar Singh College
console.log('✅ Shortlists seeded for demo student');

console.log('\n🎉 Database seed complete!');
console.log('   Admin: admin@onestop.jk / Admin@123');
console.log('   Student: student@onestop.jk / Student@123');
console.log(`   DB: ${require('path').join(__dirname, '..', 'data', 'onestop.db')}`);
