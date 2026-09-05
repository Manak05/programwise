import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container py-5">
      <section className="pw-hero pw-hero-image mb-5">
  <img
  src="/images/hero-image.png"
  alt="Students exploring education programs"
  className="pw-hero-bg"
/>
  <div className="pw-hero-overlay"></div>

  <div className="pw-hero-content">
    <h1 className="pw-hero-title">
      Compare smarter.<br />
      Choose better.
    </h1>

    <p className="pw-hero-text">
      ProgramWise helps you compare online degrees and certifications
      side by side, so you can pick a program based on what actually
      matters to you: budget, time, experience and career goals.
    </p>

    <div className="pw-hero-actions">
      {user ? (
        <Link to="/explore" className="btn btn-light btn-lg">
          Explore Programs
        </Link>
      ) : (
        <>
          <Link to="/register" className="btn btn-light btn-lg">
            Get Started
          </Link>

          <Link to="/explore" className="btn btn-outline-light btn-lg">
            Browse Programs
          </Link>
        </>
      )}
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

      <section id="about" className="pw-about py-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <h2 className="pw-section-title">What ProgramWise does</h2>
            <p className="text-muted mb-0">
              ProgramWise helps students discover and compare online degrees and certifications,
              and find the ones that actually fit their career goals, budget, experience level
              and preferred study format. Instead of checking dozens of program pages one by one,
              you compare them side by side and get a ranked match score with a plain-language
              explanation of why each program fits.
            </p>
          </div>
          <div className="col-lg-6">
            <div className="pw-step mb-3">
              <span className="pw-step-number">&#10003;</span>
              <div>
                <div className="pw-step-title">For students planning their next program</div>
                <div className="pw-step-text">Whether it's a first certification or a career switch.</div>
              </div>
            </div>
            <div className="pw-step mb-3">
              <span className="pw-step-number">&#10003;</span>
              <div>
                <div className="pw-step-title">Compares what actually matters</div>
                <div className="pw-step-text">Fee, duration, delivery mode, experience level and outcomes.</div>
              </div>
            </div>
            <div className="pw-step">
              <span className="pw-step-number">&#10003;</span>
              <div>
                <div className="pw-step-title">Explains every match</div>
                <div className="pw-step-text">See exactly why a program scored the way it did.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="pw-faq py-5">
        <h2 className="pw-section-title text-center mb-4">Frequently Asked Questions</h2>
        <div className="accordion pw-accordion" id="pwFaqAccordion">
          <div className="accordion-item">
            <h3 className="accordion-header" id="faqHeading1">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse1">
                What is ProgramWise?
              </button>
            </h3>
            <div id="faqCollapse1" className="accordion-collapse collapse" data-bs-parent="#pwFaqAccordion">
              <div className="accordion-body">
                ProgramWise is an independent student project for comparing online degrees and
                certifications and getting personalized program recommendations based on your
                own goals and constraints.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h3 className="accordion-header" id="faqHeading2">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse2">
                How are recommendations generated?
              </button>
            </h3>
            <div id="faqCollapse2" className="accordion-collapse collapse" data-bs-parent="#pwFaqAccordion">
              <div className="accordion-body">
                Each program is scored against your preferences across career goal, budget,
                duration, experience level, delivery mode and prerequisites. Every result comes
                with a plain-language breakdown of what matched and what to consider.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h3 className="accordion-header" id="faqHeading3">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse3">
                Can I compare programs side by side?
              </button>
            </h3>
            <div id="faqCollapse3" className="accordion-collapse collapse" data-bs-parent="#pwFaqAccordion">
              <div className="accordion-body">
                Yes. Select 2 to 3 programs from Explore Programs or Program Details, then open
                Compare to see them side by side on fee, duration, delivery and more.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h3 className="accordion-header" id="faqHeading4">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse4">
                Can I save programs for later?
              </button>
            </h3>
            <div id="faqCollapse4" className="accordion-collapse collapse" data-bs-parent="#pwFaqAccordion">
              <div className="accordion-body">
                Yes. Save any program from Explore or its details page, and view your full
                shortlist anytime under Saved Programs.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h3 className="accordion-header" id="faqHeading5">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse5">
                Can I create multiple preference profiles?
              </button>
            </h3>
            <div id="faqCollapse5" className="accordion-collapse collapse" data-bs-parent="#pwFaqAccordion">
              <div className="accordion-body">
                Yes. You can create separate profiles for different goals (for example "Data
                Science" or "Budget Friendly") and switch which one is active. Recommendations
                always use your currently active profile.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h3 className="accordion-header" id="faqHeading6">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse6">
                Do I need an account to explore programs?
              </button>
            </h3>
            <div id="faqCollapse6" className="accordion-collapse collapse" data-bs-parent="#pwFaqAccordion">
              <div className="accordion-body">
                No. Browsing and searching Explore Programs is open to everyone. Creating an
                account lets you save programs, set preferences and get personalized
                recommendations.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}