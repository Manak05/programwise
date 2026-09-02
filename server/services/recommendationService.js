/**
 * ProgramWise Recommendation Engine
 * ----------------------------------
 * This is a fully transparent, rule-based scoring system.
 * NO machine learning, NO external AI API — just weighted rules
 * evaluated against data pulled from MySQL.
 *
 * Total possible score = 100
 *   Career goal match:    25 pts
 *   Budget match:          25 pts
 *   Duration match:        15 pts
 *   Experience match:      15 pts
 *   Delivery preference:   15 pts
 *   Prerequisite match:     5 pts
 *
 * Revision note: Career Goal was lowered from 30 to 25 so it's on equal
 * footing with Budget — for most students, affordability is just as
 * decisive as topic relevance. Delivery Preference was raised from 10
 * to 15 and now gives partial credit on a mismatch (Online and Hybrid
 * aren't fully incompatible) instead of scoring zero.
 */

const BUDGET_BANDS = {
  'Under ₹50,000': { min: 0, max: 50000 },
  '₹50,000–₹1,00,000': { min: 50000, max: 100000 },
  '₹1,00,000–₹2,00,000': { min: 100000, max: 200000 },
  'Above ₹2,00,000': { min: 200000, max: Infinity }
};

const DURATION_BANDS = {
  'Under 6 months': { min: 0, max: 6 },
  '6–12 months': { min: 6, max: 12 },
  '12–18 months': { min: 12, max: 18 },
  '18+ months': { min: 18, max: Infinity }
};

const EXPERIENCE_ORDER = ['Beginner', 'Intermediate', 'Experienced'];

function getBudgetMax(bandLabel) {
  const band = BUDGET_BANDS[bandLabel];
  return band ? band.max : Infinity;
}

function scoreCareerGoal(program, preferences) {
  const goalNames = (program.career_goals || []).map((g) => g.name || g);
  const matched = goalNames.includes(preferences.career_goal);
  return {
    points: matched ? 25 : 0,
    max: 25,
    matched,
    label: 'Career goal match',
    positive: 'Career goal matches your target role',
    negative: 'Does not directly align with your career goal'
  };
}

function scoreBudget(program, preferences) {
  const band = BUDGET_BANDS[preferences.budget];
  const fee = Number(program.fee);

  if (!band) return { points: 0, max: 25, matched: false, label: 'Budget match', positive: '', negative: 'Budget preference not set' };

  // Fully within (or below) the student's selected budget bracket -> full marks
  if (fee <= band.max) {
    return {
      points: 25, max: 25, matched: true, label: 'Budget match',
      positive: 'Within your budget', negative: ''
    };
  }

  // Slightly above budget (within 15%) still gets partial credit
  if (fee <= band.max * 1.15) {
    return {
      points: 12, max: 25, matched: false, label: 'Budget match',
      positive: '', negative: 'Slightly above your preferred budget'
    };
  }

  return {
    points: 0, max: 25, matched: false, label: 'Budget match',
    positive: '', negative: 'Above your preferred budget'
  };
}

function scoreDuration(program, preferences) {
  const band = DURATION_BANDS[preferences.preferred_duration];
  const months = Number(program.duration_months);

  if (!band) return { points: 0, max: 15, matched: false, label: 'Duration match', positive: '', negative: 'Duration preference not set' };

  if (months >= band.min && months <= band.max) {
    return {
      points: 15, max: 15, matched: true, label: 'Duration match',
      positive: 'Duration matches your preference', negative: ''
    };
  }

  // Adjacent band gets partial credit (e.g. off by one bracket)
  const bandKeys = Object.keys(DURATION_BANDS);
  const preferredIndex = bandKeys.indexOf(preferences.preferred_duration);
  const programBandIndex = bandKeys.findIndex((key) => {
    const b = DURATION_BANDS[key];
    return months >= b.min && months <= b.max;
  });

  if (programBandIndex !== -1 && Math.abs(programBandIndex - preferredIndex) === 1) {
    return {
      points: 7, max: 15, matched: false, label: 'Duration match',
      positive: '', negative: 'Close to your preferred duration'
    };
  }

  return {
    points: 0, max: 15, matched: false, label: 'Duration match',
    positive: '', negative: 'Longer than your preferred duration'
  };
}

function scoreExperience(program, preferences) {
  const userLevel = EXPERIENCE_ORDER.indexOf(preferences.experience_level);
  const programLevel = EXPERIENCE_ORDER.indexOf(program.experience_level);

  if (userLevel === -1 || programLevel === -1) {
    return { points: 0, max: 15, matched: false, label: 'Experience match', positive: '', negative: 'Experience level not set' };
  }

  if (userLevel === programLevel) {
    return {
      points: 15, max: 15, matched: true, label: 'Experience match',
      positive: 'Suitable for your experience level', negative: ''
    };
  }

  if (Math.abs(userLevel - programLevel) === 1) {
    return {
      points: 7, max: 15, matched: false, label: 'Experience match',
      positive: '', negative: 'May be slightly above or below your experience level'
    };
  }

  return {
    points: 0, max: 15, matched: false, label: 'Experience match',
    positive: '', negative: 'May require significantly different experience level'
  };
}

function scoreDelivery(program, preferences) {
  const matched = program.delivery_mode === preferences.delivery_preference;

  if (matched) {
    return {
      points: 15, max: 15, matched: true, label: 'Delivery preference',
      positive: 'Delivery mode matches your preference', negative: ''
    };
  }

  // Online and Hybrid aren't fully incompatible - a Hybrid program still
  // includes an online component, so a mismatch still earns partial
  // credit instead of scoring zero.
  return {
    points: 7, max: 15, matched: false, label: 'Delivery preference',
    positive: '', negative: 'Delivery mode differs from your preference'
  };
}

function scorePrerequisites(program, preferences) {
  const prereqText = (program.prerequisites || '').trim().toLowerCase();
  const noBarrier = !prereqText || prereqText === 'none.' || prereqText === 'none';

  if (noBarrier) {
    return {
      points: 5, max: 5, matched: true, label: 'Prerequisite match',
      positive: 'No specific prerequisites required', negative: ''
    };
  }

  // If the student is not a total beginner, assume they likely meet
  // general prerequisites (simple heuristic, clearly not exhaustive).
  if (preferences.experience_level && preferences.experience_level !== 'Beginner') {
    return {
      points: 5, max: 5, matched: true, label: 'Prerequisite match',
      positive: 'You likely meet the prerequisites', negative: ''
    };
  }

  return {
    points: 0, max: 5, matched: false, label: 'Prerequisite match',
    positive: '', negative: 'May require prior experience or specific prerequisites'
  };
}

/**
 * Computes a full explainable score for a single program against
 * a student's saved preferences.
 */
function scoreProgram(program, preferences) {
  const parts = [
    scoreCareerGoal(program, preferences),
    scoreBudget(program, preferences),
    scoreDuration(program, preferences),
    scoreExperience(program, preferences),
    scoreDelivery(program, preferences),
    scorePrerequisites(program, preferences)
  ];

  const totalPoints = parts.reduce((sum, p) => sum + p.points, 0);
  const matchPercent = Math.round(totalPoints); // weights already sum to 100

  const reasonsMatched = parts.filter((p) => p.positive && p.points > 0).map((p) => p.positive);
  const reasonsWarning = parts.filter((p) => p.negative && p.points < p.max).map((p) => p.negative);

  return {
    programId: program.id,
    matchPercent,
    breakdown: parts.map(({ label, points, max }) => ({ label, points, max })),
    reasonsMatched,
    reasonsWarning
  };
}

/**
 * Scores and ranks a list of programs against preferences, highest first.
 */
function rankPrograms(programs, preferences) {
  return programs
    .map((program) => ({ program, ...scoreProgram(program, preferences) }))
    .sort((a, b) => b.matchPercent - a.matchPercent);
}

module.exports = { scoreProgram, rankPrograms, getBudgetMax, BUDGET_BANDS, DURATION_BANDS };
