const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { rankPrograms } = require('../services/recommendationService');

// Fetches all active programs joined with lookup tables, plus their
// linked career goals (batched in a second query to avoid N+1 queries).
async function fetchActiveProgramsWithGoals() {
  const [programs] = await pool.query(
    `SELECT
        p.id, p.title, p.description, p.fee, p.currency, p.duration_months,
        p.delivery_mode, p.experience_level, p.prerequisites, p.outcomes,
        u.name AS university_name, pr.name AS provider_name, c.name AS category_name
     FROM programs p
     JOIN universities u ON p.university_id = u.id
     JOIN providers pr ON p.provider_id = pr.id
     JOIN categories c ON p.category_id = c.id
     WHERE p.is_active = TRUE`
  );

  const [goalLinks] = await pool.query(
    `SELECT pcg.program_id, cg.id, cg.name
     FROM program_career_goals pcg
     JOIN career_goals cg ON pcg.career_goal_id = cg.id`
  );

  const goalsByProgram = {};
  for (const link of goalLinks) {
    if (!goalsByProgram[link.program_id]) goalsByProgram[link.program_id] = [];
    goalsByProgram[link.program_id].push({ id: link.id, name: link.name });
  }

  return programs.map((p) => ({ ...p, career_goals: goalsByProgram[p.id] || [] }));
}

// POST /api/recommendations
// Scores every active program against the logged-in user's currently
// active preference profile. Optionally accepts { profileId } in the
// body to score against a specific profile instead of the active one.
const getRecommendations = asyncHandler(async (req, res) => {
  const { profileId } = req.body || {};

  let preferences;
  if (profileId) {
    const [rows] = await pool.query(
      'SELECT * FROM user_preferences WHERE id = ? AND user_id = ?',
      [profileId, req.user.id]
    );
    preferences = rows[0];
  } else {
    const [rows] = await pool.query(
      'SELECT * FROM user_preferences WHERE user_id = ? AND is_active = TRUE LIMIT 1',
      [req.user.id]
    );
    preferences = rows[0];
  }

  if (!preferences) {
    throw new ApiError(400, 'No active preference profile found. Please create and select one first.');
  }

  const programs = await fetchActiveProgramsWithGoals();
  const ranked = rankPrograms(programs, preferences);

  const limit = parseInt(req.query.limit, 10) || 10;
  const results = ranked.slice(0, limit).map((r) => ({
    program: {
      id: r.program.id,
      title: r.program.title,
      university_name: r.program.university_name,
      provider_name: r.program.provider_name,
      category_name: r.program.category_name,
      fee: r.program.fee,
      currency: r.program.currency,
      duration_months: r.program.duration_months,
      delivery_mode: r.program.delivery_mode,
      experience_level: r.program.experience_level
    },
    matchPercent: r.matchPercent,
    breakdown: r.breakdown,
    reasonsMatched: r.reasonsMatched,
    reasonsWarning: r.reasonsWarning
  }));

  res.json(results);
});

module.exports = { getRecommendations };
