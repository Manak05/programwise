-- ============================================================
-- ProgramWise Seed Data
-- DEMO / SAMPLE DATA ONLY — fictional universities, providers,
-- and programs created for this student project. This is NOT
-- real GradRight data and is not affiliated with GradRight.
--
-- NOTE: Demo user accounts (student@demo.com / admin@demo.com)
-- are NOT created here because passwords must be bcrypt-hashed.
-- Run `npm run seed` inside /server AFTER this file to create
-- those two accounts (see README).
-- ============================================================

USE programwise;

-- ------------------------------------------------------------
-- UNIVERSITIES (demo/fictional)
-- ------------------------------------------------------------
INSERT INTO universities (name, description, website) VALUES
('Northbridge University', 'A demo university known for its online technology programs.', 'https://example-northbridge.edu'),
('Silverline Institute of Technology', 'Fictional institute offering industry-aligned certifications.', 'https://example-silverline.edu'),
('Crestwood State University', 'Demo public university with strong analytics programs.', 'https://example-crestwood.edu'),
('BluePeak College', 'Fictional college specializing in applied computer science.', 'https://example-bluepeak.edu'),
('Meridian Global University', 'Demo university offering globally recognized online degrees.', 'https://example-meridian.edu'),
('Alderwood Institute', 'Fictional institute focused on business and product programs.', 'https://example-alderwood.edu'),
('Harborview Technical University', 'Demo university with strong cybersecurity and cloud programs.', 'https://example-harborview.edu');

-- ------------------------------------------------------------
-- PROVIDERS (demo/fictional edtech platforms)
-- ------------------------------------------------------------
INSERT INTO providers (name, description, website) VALUES
('LearnForge', 'Fictional edtech platform hosting university-backed online programs.', 'https://example-learnforge.com'),
('SkillHarbor', 'Demo platform specializing in short professional certifications.', 'https://example-skillharbor.com'),
('EduNext', 'Fictional provider offering flexible online degree partnerships.', 'https://example-edunext.com'),
('CodePath Academy', 'Demo bootcamp-style provider for technical programs.', 'https://example-codepath.com'),
('CoreSkill', 'Fictional provider focused on business and analytics upskilling.', 'https://example-coreskill.com'),
('CloudMentor', 'Demo provider specializing in cloud and infrastructure training.', 'https://example-cloudmentor.com');

-- ------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------
INSERT INTO categories (name) VALUES
('Data Science'),
('Artificial Intelligence'),
('Web Development'),
('Cybersecurity'),
('Business Analytics'),
('Product Management'),
('Cloud Computing');

-- ------------------------------------------------------------
-- CAREER GOALS
-- ------------------------------------------------------------
INSERT INTO career_goals (name) VALUES
('Data Scientist'),
('AI Engineer'),
('Full Stack Developer'),
('Cybersecurity Analyst'),
('Business Analyst'),
('Product Manager'),
('Cloud Engineer'),
('Data Analyst');

-- ------------------------------------------------------------
-- PROGRAMS (25 demo programs across categories)
-- university_id / provider_id / category_id reference the rows
-- inserted above (1-indexed in insertion order).
-- ------------------------------------------------------------
INSERT INTO programs
(title, university_id, provider_id, category_id, description, fee, currency, duration_months, delivery_mode, experience_level, prerequisites, outcomes, is_active) VALUES

('Postgraduate Certificate in Data Science', 1, 1, 1, 'A comprehensive online program covering statistics, Python, and machine learning fundamentals for aspiring data scientists.', 145000, 'INR', 12, 'Online', 'Beginner', 'Basic mathematics and programming familiarity recommended.', 'Build predictive models, work with real datasets, and complete a capstone project.', TRUE),

('Applied Data Science Bootcamp', 4, 4, 1, 'Fast-paced, hands-on bootcamp focused on practical data science skills using Python and SQL.', 95000, 'INR', 6, 'Online', 'Intermediate', 'Comfort with basic programming logic.', 'Deliver an end-to-end data analysis pipeline and portfolio projects.', TRUE),

('MSc-style Data Science Program', 3, 3, 1, 'Rigorous university-affiliated program covering advanced statistics, big data tools, and research methods.', 210000, 'INR', 18, 'Hybrid', 'Intermediate', 'Undergraduate degree in a quantitative field preferred.', 'Advanced modeling, big data processing, and thesis-style capstone.', TRUE),

('Data Science Foundations', 5, 2, 1, 'Beginner-friendly introduction to data analysis, visualization, and Python programming.', 42000, 'INR', 4, 'Online', 'Beginner', 'None.', 'Comfortably analyze datasets and build basic visualizations.', TRUE),

('Professional Certificate in Artificial Intelligence', 1, 1, 2, 'Covers machine learning, neural networks, and applied AI system design.', 165000, 'INR', 12, 'Online', 'Intermediate', 'Programming experience (Python) required.', 'Design and deploy ML models; understand neural network architectures.', TRUE),

('AI Engineering Immersive', 4, 4, 2, 'Intensive program on deep learning, model deployment, and MLOps practices.', 180000, 'INR', 9, 'Online', 'Experienced', 'Strong programming background and prior ML exposure.', 'Deploy production-grade AI systems and MLOps pipelines.', TRUE),

('Intro to AI and Machine Learning', 5, 2, 2, 'A gentle introduction to AI concepts, ML algorithms, and ethical considerations.', 38000, 'INR', 3, 'Online', 'Beginner', 'None.', 'Understand core AI/ML concepts and run simple models.', TRUE),

('Applied AI for Business', 6, 5, 2, 'AI concepts framed for business decision-makers, with light technical implementation.', 88000, 'INR', 6, 'Hybrid', 'Beginner', 'Basic Excel/analytics familiarity.', 'Identify AI use-cases and evaluate AI vendor solutions.', TRUE),

('Full Stack Web Development Certificate', 2, 4, 3, 'Comprehensive coverage of frontend, backend, and database development using modern JavaScript tools.', 120000, 'INR', 9, 'Online', 'Beginner', 'Basic computer literacy.', 'Build and deploy full-stack web applications independently.', TRUE),

('MERN Stack Developer Program', 4, 4, 3, 'Hands-on program focused on MongoDB, Express, React and Node.js.', 78000, 'INR', 5, 'Online', 'Beginner', 'Basic HTML/CSS knowledge helpful.', 'Build full-stack JavaScript applications and deploy them.', TRUE),

('Advanced Full Stack Engineering', 1, 1, 3, 'Advanced program covering system design, scalable architectures, and cloud deployment for full stack apps.', 195000, 'INR', 12, 'Hybrid', 'Experienced', 'Prior full-stack development experience required.', 'Design scalable full-stack systems and lead technical implementation.', TRUE),

('Frontend Development Fundamentals', 5, 2, 3, 'Introductory program on HTML, CSS, JavaScript, and React basics.', 35000, 'INR', 3, 'Online', 'Beginner', 'None.', 'Build responsive websites and simple React applications.', TRUE),

('Backend Development with Node.js', 4, 4, 3, 'Focused program on REST APIs, databases, and server-side architecture using Node.js.', 62000, 'INR', 4, 'Online', 'Intermediate', 'Basic JavaScript knowledge required.', 'Build and secure REST APIs backed by relational databases.', TRUE),

('Cybersecurity Analyst Certificate', 7, 6, 4, 'Covers network security, threat detection, and incident response fundamentals.', 110000, 'INR', 8, 'Online', 'Beginner', 'Basic networking knowledge helpful.', 'Identify vulnerabilities and respond to common security incidents.', TRUE),

('Advanced Ethical Hacking Program', 7, 6, 4, 'Hands-on penetration testing, vulnerability assessment, and security auditing.', 175000, 'INR', 10, 'Hybrid', 'Experienced', 'Prior IT/security experience required.', 'Perform professional-grade penetration tests and security audits.', TRUE),

('Cybersecurity Foundations', 2, 3, 4, 'Beginner-level introduction to information security principles and best practices.', 45000, 'INR', 4, 'Online', 'Beginner', 'None.', 'Understand core security principles and basic risk mitigation.', TRUE),

('Business Analytics Professional Program', 3, 5, 5, 'Covers data-driven decision-making, dashboards, and statistical analysis for business.', 98000, 'INR', 7, 'Online', 'Intermediate', 'Basic Excel and statistics knowledge.', 'Build business dashboards and present data-driven recommendations.', TRUE),

('Business Analytics Foundations', 6, 5, 5, 'Introductory course on analytics tools like Excel, SQL basics, and visualization.', 40000, 'INR', 3, 'Online', 'Beginner', 'None.', 'Analyze business datasets and create simple reports.', TRUE),

('Advanced Business Intelligence Program', 3, 3, 5, 'In-depth coverage of BI tools, data warehousing, and executive reporting.', 155000, 'INR', 11, 'Hybrid', 'Experienced', 'Prior analytics or BI experience recommended.', 'Design enterprise BI systems and executive dashboards.', TRUE),

('Product Management Certificate', 6, 5, 6, 'Covers product strategy, roadmapping, and cross-functional leadership.', 132000, 'INR', 6, 'Online', 'Intermediate', 'Some professional work experience recommended.', 'Lead product discovery, roadmaps, and cross-team execution.', TRUE),

('Product Management Foundations', 6, 2, 6, 'Beginner-friendly introduction to product thinking and agile basics.', 48000, 'INR', 3, 'Online', 'Beginner', 'None.', 'Understand product lifecycle and basic agile practices.', TRUE),

('Senior Product Leadership Program', 1, 5, 6, 'Advanced program on product vision, org design, and executive stakeholder management.', 210000, 'INR', 9, 'Hybrid', 'Experienced', 'Several years of product or project management experience.', 'Lead product organizations and shape company-level strategy.', TRUE),

('Cloud Computing Professional Certificate', 7, 6, 7, 'Covers core cloud infrastructure, deployment, and cost management across major providers.', 105000, 'INR', 6, 'Online', 'Intermediate', 'Basic networking/Linux familiarity helpful.', 'Deploy and manage scalable cloud infrastructure.', TRUE),

('Cloud Fundamentals for Beginners', 2, 6, 7, 'Introductory program covering cloud concepts, storage, and basic deployment.', 32000, 'INR', 3, 'Online', 'Beginner', 'None.', 'Understand core cloud concepts and deploy simple applications.', TRUE),

('Enterprise Cloud Architecture', 7, 6, 7, 'Advanced architecture-focused program for designing large-scale, resilient cloud systems.', 220000, 'INR', 12, 'Hybrid', 'Experienced', 'Prior cloud or infrastructure experience required.', 'Architect enterprise-grade, highly available cloud systems.', TRUE),

('Data Analyst Career Program', 4, 4, 1, 'Career-focused program on SQL, Excel, and data storytelling for aspiring data analysts.', 68000, 'INR', 5, 'Online', 'Beginner', 'None.', 'Confidently analyze and present data insights using SQL and dashboards.', TRUE);

-- ------------------------------------------------------------
-- PROGRAM_CAREER_GOALS (many-to-many links)
-- career_goals: 1 Data Scientist, 2 AI Engineer, 3 Full Stack Developer,
-- 4 Cybersecurity Analyst, 5 Business Analyst, 6 Product Manager,
-- 7 Cloud Engineer, 8 Data Analyst
-- ------------------------------------------------------------
INSERT INTO program_career_goals (program_id, career_goal_id) VALUES
(1,1),(1,8),
(2,1),(2,8),
(3,1),(3,2),
(4,1),(4,8),
(5,2),(5,1),
(6,2),
(7,2),
(8,2),(8,5),
(9,3),
(10,3),
(11,3),
(12,3),
(13,3),
(14,4),
(15,4),
(16,4),
(17,5),(17,8),
(18,5),
(19,5),
(20,6),
(21,6),
(22,6),
(23,7),
(24,7),
(25,7),
(26,8),(26,1);
