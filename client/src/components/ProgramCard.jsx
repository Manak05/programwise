import React from 'react';
import { Link } from 'react-router-dom';
import MatchBadge from './MatchBadge';

export default function ProgramCard({
  program, matchPercent, isSaved, onSave, onUnsave,
  isInCompare, onToggleCompare, showCompare = true, hideSave = false
}) {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="pw-card pw-program-card h-100 p-3 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
          <div className="d-flex flex-wrap gap-1">
            <span className="pw-badge pw-badge-category">{program.category_name}</span>
            {program.is_active === false && (
              <span className="pw-badge pw-badge-status-inactive">Inactive</span>
            )}
          </div>
          {matchPercent !== undefined && <MatchBadge percent={matchPercent} />}
        </div>

        <h3 className="pw-card-title">{program.title}</h3>
        <div className="pw-card-meta">
          {program.university_name} &middot; {program.provider_name}
        </div>

        <div className="pw-card-stats mb-3">
          <div><span className="pw-stat-label">Fee</span>{program.currency || 'INR'} {Number(program.fee).toLocaleString('en-IN')}</div>
          <div><span className="pw-stat-label">Duration</span>{program.duration_months} months</div>
          <div><span className="pw-stat-label">Delivery</span>{program.delivery_mode} &middot; {program.experience_level}</div>
        </div>

        <div className="mt-auto d-flex flex-wrap gap-2">
          <Link to={`/programs/${program.id}`} className="btn btn-outline-primary btn-sm">Details</Link>
          {!hideSave && (
            isSaved ? (
              <button className="btn btn-outline-danger btn-sm" onClick={() => onUnsave(program.id)}>Unsave</button>
            ) : (
              <button className="btn btn-outline-secondary btn-sm" onClick={() => onSave(program.id)}>Save</button>
            )
          )}
          {showCompare && (
            <button
              className={`btn btn-sm ${isInCompare ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => onToggleCompare(program.id)}
            >
              {isInCompare ? 'Added to Compare' : 'Add to Compare'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}