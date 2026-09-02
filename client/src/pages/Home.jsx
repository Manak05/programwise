import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container py-5">
      <section className="pw-hero mb-5">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h1 className="pw-hero-title">Compare smarter. Choose better.</h1>
            <p className="pw-hero-text">
              ProgramWise helps you compare online degrees and certifications side by side,
              so you can pick a program based on what actually matters to you: budget, time,
              experience and career goals.
            </p>
            <div className="d-flex flex-wrap gap-2">
              {user ? (
                <Link to="/explore" className="btn btn-light btn-lg">Explore Programs</Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-light btn-lg">Get Started</Link>
                  <Link to="/explore" className="btn btn-outline-light btn-lg">Browse Programs</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="pw-step">
            <span className="pw-step-number">1</span>
            <div>
              <div className="pw-step-title">Set your preferences</div>
              <div className="pw-step-text">Goal, budget, time and experience level.</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="pw-step">
            <span className="pw-step-number">2</span>
            <div>
              <div className="pw-step-title">Get matched</div>
              <div className="pw-step-text">See programs ranked by how well they fit you.</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="pw-step">
            <span className="pw-step-number">3</span>
            <div>
              <div className="pw-step-title">Compare and decide</div>
              <div className="pw-step-text">Shortlist programs and compare them side by side.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="pw-card p-4 h-100">
            <h5 className="pw-feature-title">Neutral comparison</h5>
            <p className="text-muted mb-0">
              Fees, duration, delivery mode and outcomes, laid out side by side so you can
              judge programs on the same criteria.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="pw-card p-4 h-100">
            <h5 className="pw-feature-title">Explainable matches</h5>
            <p className="text-muted mb-0">
              Every match score comes with a plain-language breakdown of what fits and what
              doesn't, not just a number.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="pw-card p-4 h-100">
            <h5 className="pw-feature-title">Built around your goals</h5>
            <p className="text-muted mb-0">
              Set your career goal, budget and available time once, and get ranked
              recommendations instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}