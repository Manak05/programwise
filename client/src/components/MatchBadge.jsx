import React from 'react';

export default function MatchBadge({ percent }) {
  let variant = 'pw-badge-match-low';
  if (percent >= 80) variant = 'pw-badge-match-high';
  else if (percent >= 55) variant = 'pw-badge-match-mid';

  return (
    <span className={`pw-badge pw-badge-match ${variant}`}>{percent}% Match</span>
  );
}