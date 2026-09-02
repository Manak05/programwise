# ProgramWise — Presentation & Viva Preparation

## Accurate Framing (use this when presenting)

> "ProgramWise is an independently developed full-stack prototype inspired by the
> problem of helping students compare and choose online education programs based on
> their personal requirements. It was developed around the problem described in an
> assignment on GradRight's Online Programs product, but it is my own independent
> implementation — not GradRight's software, and it uses entirely fictional demo data."

Do **not** say "I built GradRight." Do **not** claim this is GradRight's production app.

---

## 1. Slide Deck Outline (8–10 slides)

1. **Title** — ProgramWise: Compare smarter. Choose better. (Your name, course, date)
2. **Problem Statement** — Too many overlapping online programs, no neutral comparison,
   unclear pricing/outcomes, lack of personalization
3. **Objective** — Answer "Which program is most suitable for ME, and WHY?"
4. **Proposed Solution** — Search/filter, side-by-side comparison, explainable
   recommendation engine, save-for-later
5. **Technology Stack** — React + Vite + Bootstrap · Node.js + Express · MySQL · JWT + bcrypt
6. **System Architecture** — React → Axios → Express REST API → Node business logic → MySQL
7. **Database Design / ER Diagram** — 9 tables, 2 many-to-many junction tables
   (program_career_goals, saved_programs)
8. **Main Features + Screenshots** — Explore, Compare, Recommendations, Admin Dashboard
9. **Recommendation Algorithm** — Rule-based, 6 weighted factors, 100-point transparent score
10. **Future Scope** — Adjustable weights, reviews, notifications, pagination

---

## 2. Live Demo Script (5–7 minutes)

1. Open the application at http://localhost:5173
2. Login as **student@demo.com**
3. Go to **Explore Programs**
4. Demonstrate **search** and **filters** (category, budget, delivery, experience)
5. Open a program's **Details** page
6. Select 2 programs and open the **Compare** table
7. Go to **Preferences** and fill in a goal/budget/experience combination
8. Navigate to **My Recommendations**
9. Point out the **match percentage** and explain the ✓ / ⚠ breakdown for the top result
10. **Save** a program from the recommendations list
11. **Logout**
12. **Login as admin@demo.com**
13. Edit an existing program's fee or duration (or add a new one)
14. Switch back to the student view / Explore Programs
15. Show that the **change is immediately reflected** — proving the app is genuinely
    full-stack and not a static demo

---

## 3. Viva Questions & Answers

### General
- **What problem does this solve?** Students face too many online programs with no
  neutral way to compare them or know which fits their goals, budget, and time.
- **Why did you choose this project?** It combines a real-world decision-support problem
  with full relational database design, authentication, and a transparent rule-based
  algorithm — achievable solo in 7–10 days.
- **Who are the users?** Students looking for online programs, and admins who manage the
  program catalog.
- **What makes it different from a static website?** Every page is backed by live MySQL
  queries through a REST API — search, filters, recommendations, and admin edits all
  persist to and read from the database in real time.

### Frontend
- **Why React?** Component-based UI makes it easy to reuse pieces like `ProgramCard` and
  `MatchBadge` across Explore, Recommendations, and Saved Programs.
- **What are components?** Reusable, self-contained pieces of UI (e.g. a navbar, a
  program card) that manage their own rendering and can accept data via props.
- **How does Axios work?** It's an HTTP client used to call the Express REST API; a
  single configured instance (`services/api.js`) automatically attaches the JWT token
  to every request via an interceptor.
- **How is authentication handled?** On login/register, the backend returns a JWT, which
  is stored in `localStorage` and sent as a `Bearer` token on every subsequent request.

### Backend
- **Why Node.js?** JavaScript on both frontend and backend simplifies development for a
  solo student project, and its non-blocking I/O suits many small concurrent DB queries.
- **Why Express?** A minimal, well-understood framework for defining REST routes,
  middleware (auth, error handling), and controllers.
- **What is REST?** An architectural style where resources (programs, users, etc.) are
  accessed via standard HTTP verbs (GET/POST/PUT/DELETE) at predictable URLs.
- **What is middleware?** Functions that run between the incoming request and the final
  route handler — e.g. `protect` verifies the JWT, `requireAdmin` checks the user's role.
- **How does JWT work?** On login, the server signs a token containing the user's id and
  role using a secret key. The client sends this token on future requests; the server
  verifies the signature to authenticate the request without a database lookup each time.

### Database
- **Why MySQL?** The project explicitly needed to demonstrate relational concepts —
  primary/foreign keys, joins, and normalization — which a relational database models
  naturally.
- **What is a primary key?** A column (or set of columns) that uniquely identifies each
  row in a table, e.g. `programs.id`.
- **What is a foreign key?** A column that references a primary key in another table,
  enforcing that the referenced row must exist — e.g. `programs.university_id` →
  `universities.id`.
- **What is a JOIN?** A SQL operation that combines rows from two or more tables based on
  a related column, e.g. joining `programs` with `universities` to show each program's
  university name.
- **What is normalization?** Structuring tables to minimize data duplication — e.g.
  storing university details once in `universities` rather than repeating them on every
  program row.
- **Why use junction tables?** To represent many-to-many relationships, since a single
  foreign key can't express "many programs relate to many career goals" directly.
- **Explain `program_career_goals`.** It links `programs` and `career_goals` with a
  composite primary key `(program_id, career_goal_id)`, so one program can map to
  several career goals and one career goal can map to several programs.
- **Explain `saved_programs`.** It links `users` and `programs`, with a composite primary
  key `(user_id, program_id)` that naturally prevents a student from saving the same
  program twice.

### Recommendation Engine
- **How is the score calculated?** Six weighted factors (career goal 30, budget 25,
  duration 15, experience 15, delivery 10, prerequisites 5) are each scored against the
  student's stored preferences, summing to a 0–100 match percentage, computed live on
  the backend for every active program.
- **Why rule-based recommendation?** It's fully transparent and explainable — every point
  awarded or withheld can be traced to a specific rule, which matters for student trust
  and was explicitly required by the project scope.
- **Why not machine learning?** The scope intentionally excludes ML/AI APIs to keep the
  project realistically achievable solo in 7–10 days, and a rule-based system is more
  explainable for this use case regardless.
- **How could this be improved in future?** Let students adjust factor weights
  themselves, incorporate program reviews/outcomes data, or introduce a lightweight
  ML re-ranking layer once enough usage data exists.

### Security
- **How are passwords stored?** Hashed with bcrypt (10 salt rounds) before being saved —
  plaintext passwords are never stored or logged.
- **Why use JWT?** It's stateless — the server doesn't need to store session data, which
  keeps the API simple and scalable.
- **How are admin routes protected?** A `requireAdmin` middleware checks the `role` field
  decoded from the JWT and rejects the request with 403 if the user isn't an admin.
