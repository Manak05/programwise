# ProgramWise

**Compare smarter. Choose better.**

A full-stack education program decision-support platform that helps students compare
online degrees and certifications and find the ones that best fit their goals, budget,
experience, and available time.

> **Important framing:** ProgramWise is an **independently developed student project**
> inspired by the general problem of comparing online education programs (the kind of
> problem described in a GradRight Online Programs assignment). It is **not** GradRight's
> production software, is not affiliated with GradRight, and does not use any of
> GradRight's proprietary data, branding, UI, or source code. All universities, providers,
> and programs in this app are **fictional demo/sample data**.

---

## 1. Project Overview

Students today face too many overlapping online programs — different universities,
providers, fees, durations, and delivery formats — with no neutral way to compare them
or know which one actually fits their situation. ProgramWise answers one question:

**"Which program is most suitable for ME, and WHY?"**

## 2. Problem Statement

- Difficulty comparing many online degrees/certifications side by side
- Lack of a neutral, unbiased comparison across providers
- Unclear pricing and duration differences
- Difficulty understanding real outcomes
- No personalization based on the student's own goals, budget, time, and experience

## 3. Features

**Student**
Register · Login · Set preferences · Browse programs · Search & filter · View program
details · Compare 2–3 programs · Get personalized, explainable recommendations · Save /
unsave programs · View saved programs · Logout

**Admin**
Login · Live dashboard statistics · Program CRUD (create/edit/deactivate/delete) ·
Manage universities, providers, and categories

Everything is backed by real MySQL queries — nothing is faked or hardcoded.

## 4. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, Axios, Bootstrap 5, React Router |
| Backend | Node.js + Express.js (REST API) |
| Database | MySQL (raw `mysql2` driver, no ORM) |
| Auth | JWT + bcryptjs password hashing |

## 5. Architecture

```
React Frontend (Vite)
        │  Axios (HTTP + JWT header)
        ▼
Express REST API
        │
        ▼
Node.js Controllers / Services (business logic + recommendation engine)
        │
        ▼
MySQL Database (mysql2 connection pool)
```

## 6. Database Design

9 relational tables:

```
USERS ──< USER_PREFERENCES
USERS ──< SAVED_PROGRAMS >── PROGRAMS
PROGRAMS >── UNIVERSITIES
PROGRAMS >── PROVIDERS
PROGRAMS >── CATEGORIES
PROGRAMS ──< PROGRAM_CAREER_GOALS >── CAREER_GOALS
```

- **One-to-many:** universities/providers/categories → programs
- **Many-to-many (via junction tables):**
  - `program_career_goals` (program_id, career_goal_id) — composite PK
  - `saved_programs` (user_id, program_id) — composite PK, prevents duplicate saves
- All foreign keys use `ON DELETE CASCADE` where appropriate
- Full schema with constraints: [`database/schema.sql`](database/schema.sql)
- Demo data (universities, providers, categories, career goals, 26 programs, all
  many-to-many links): [`database/seed.sql`](database/seed.sql)

## 7. Setup Instructions (Windows + VS Code)

### Step 1 — Install MySQL

The simplest option on Windows is **XAMPP** (bundles MySQL + phpMyAdmin):

1. Download XAMPP from https://www.apachefriends.org and install it.
2. Open the **XAMPP Control Panel** and click **Start** next to **MySQL**.
3. (Optional but helpful) Click **Admin** next to MySQL to open **phpMyAdmin** in your
   browser — you can use this to visually confirm tables/data later.

Alternatively, you can install **MySQL Community Server** directly from
https://dev.mysql.com/downloads/installer/ if you prefer a standalone install.

### Step 2 — Create the database and run the schema

Open a terminal (Command Prompt / PowerShell) and run:

```bash
# If using XAMPP, mysql.exe is typically at C:\xampp\mysql\bin\mysql.exe
# Add it to PATH, or cd into that folder first.

mysql -u root -p
```

Press Enter at the password prompt if you haven't set one (XAMPP's default root user
has no password). Then, from inside the `mysql>` prompt, run:

```sql
SOURCE C:/path/to/programwise/database/schema.sql;
SOURCE C:/path/to/programwise/database/seed.sql;
EXIT;
```

(Replace `C:/path/to/programwise` with wherever you extracted the project. Use forward
slashes even on Windows inside the `SOURCE` command.)

This creates the `programwise` database, all 9 tables, and loads the demo data
(universities, providers, categories, career goals, and 26 demo programs).

> `schema.sql` also runs `DROP DATABASE IF EXISTS programwise;` at the top, so it's safe
> to re-run both files any time you want to reset to a clean state.

### Step 3 — Configure environment variables

```bash
cd server
copy .env.example .env
```

Open `.env` in VS Code and adjust if needed (defaults work for a fresh XAMPP install):

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=programwise
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Step 4 — Install backend dependencies and seed demo accounts

```bash
cd server
npm install
npm run seed
```

`npm run seed` creates the two demo accounts (`student@demo.com` and `admin@demo.com`)
with **real bcrypt-hashed passwords**, generated using the exact same `bcryptjs` library
the app uses for authentication — nothing is faked or pre-baked.

### Step 5 — Install frontend dependencies

Open a **second terminal**:

```bash
cd client
npm install
```

### Step 6 — Run the application

**Option A — Two terminals (most reliable):**

Terminal 1:
```bash
cd server
npm run dev
```

Terminal 2:
```bash
cd client
npm run dev
```

**Option B — Single command from the project root** (installs `concurrently`):

```bash
npm install
npm run dev
```

### Step 7 — Open the app

Visit **http://localhost:5173** in your browser. The API runs at
**http://localhost:5000/api** (health check: http://localhost:5000/api/health).

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Student | `student@demo.com` | `Student@123` |
| Admin | `admin@demo.com` | `Admin@123` |

## 8. Project Structure

```
programwise/
├── database/
│   ├── schema.sql
│   └── seed.sql
├── server/
│   ├── config/db.js
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/recommendationService.js
│   ├── scripts/seedUsers.js
│   ├── utils/
│   ├── server.js
│   └── .env.example
└── client/
    └── src/
        ├── components/
        ├── pages/
        │   └── admin/
        ├── services/api.js
        ├── context/AuthContext.jsx
        ├── App.jsx
        └── main.jsx
```

## 9. API Endpoints

**Auth**
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me                 (protected)
```

**Programs**
```
GET    /api/programs                (search, category, budgetMax, durationMax, delivery, experience filters)
GET    /api/programs/:id
GET    /api/programs/compare?ids=1,2,3
POST   /api/programs                (admin)
PUT    /api/programs/:id            (admin)
PATCH  /api/programs/:id/deactivate (admin)
PATCH  /api/programs/:id/activate   (admin)
DELETE /api/programs/:id            (admin)
```

**Preferences**
```
GET    /api/preferences             (protected)
PUT    /api/preferences             (protected, upsert)
```

**Recommendations**
```
POST   /api/recommendations         (protected — scores all active programs)
```

**Saved Programs**
```
GET    /api/saved-programs                  (protected)
POST   /api/saved-programs/:programId       (protected)
DELETE /api/saved-programs/:programId       (protected)
```

**Reference data** (same pattern for each — GET is public, writes are admin-only)
```
/api/universities
/api/providers
/api/categories
/api/career-goals
```

**Admin**
```
GET    /api/admin/stats             (admin — live counts, never hardcoded)
```

## 10. Demo Credentials

See section 7 above.

## 11. Recommendation Algorithm

ProgramWise uses a **transparent, rule-based scoring engine** — no machine learning, no
external AI APIs. See [`server/services/recommendationService.js`](server/services/recommendationService.js).

| Factor | Points |
|---|---|
| Career goal match | 30 |
| Budget match | 25 |
| Duration match | 15 |
| Experience match | 15 |
| Delivery preference | 10 |
| Prerequisite match | 5 |
| **Total** | **100** |

Each factor is evaluated with a small, explainable rule (e.g. budget gets full points if
the fee is within the student's selected bracket, partial credit if it's within 15% over,
zero otherwise). The backend calculates every score live from the database — nothing is
hardcoded — and returns both the percentage **and** a list of ✓ matched reasons and ⚠
mismatch warnings, so the score is always explainable.

## 12. Testing Checklist

**Frontend:** app runs · all pages navigate correctly · forms validate and submit ·
API calls succeed · responsive on mobile widths

**Backend:** Express starts and connects to MySQL · JWT issued on login/register ·
protected routes reject missing/invalid tokens · admin routes reject non-admin users ·
CRUD operations persist correctly · recommendation scores compute correctly

**Database:** schema.sql creates all tables/constraints without error · seed.sql loads
demo data · foreign keys enforce referential integrity · junction tables prevent
duplicate `(user_id, program_id)` and `(program_id, career_goal_id)` pairs

**Student flow:** register → login → set preferences → search/filter programs → view
details → compare 2–3 programs → view recommendations with explanations → save/unsave
a program → logout

**Admin flow:** login → view live dashboard stats → create a program → edit it → verify
the change appears in the student-facing Explore page → deactivate/reactivate/delete a
program → manage universities/providers/categories/career goals

## 13. Future Scope

- Pagination and more advanced sorting on Explore Programs
- Richer preference weighting (let students adjust factor weights themselves)
- Program reviews/ratings from verified students
- Email notifications for saved-program price or status changes
- Multi-currency support

---

## Presentation & Viva Material

See [`PRESENTATION_AND_VIVA.md`](PRESENTATION_AND_VIVA.md) for the slide deck outline,
the live demo script, and prepared viva questions & answers.
