/**
 * AuthLayout.jsx
 *
 * Shared, responsive layout for login and registration.
 * Includes brand messaging and a consistent authentication card.
 */

import Card from "../components/Card";
import "../styles/auth.css";

function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        {/* Branded panel explains the value of the application. */}
        <section className="auth-intro" aria-label="About the platform">
          <div className="auth-brand">
            <span className="auth-brand-icon" aria-hidden="true">
              ↗
            </span>
            <span>Job Application Tracker</span>
          </div>

          <div className="auth-intro-copy">
            <p className="auth-eyebrow">YOUR CAREER, ORGANISED</p>

            <h2>Make your next move count.</h2>

            <p>
              Bring your job search together in one place. Stay organised, track
              your progress and focus on opportunities that move your career
              forward.
            </p>
          </div>

          {/* Highlights the main benefits without cluttering the page. */}
          <ul className="auth-benefits">
            <li>
              <span aria-hidden="true">✓</span>
              Keep every application organised
            </li>
            <li>
              <span aria-hidden="true">✓</span>
              Track applications and interview progress
            </li>
            <li>
              <span aria-hidden="true">✓</span>
              Keep your next career move in focus
            </li>
          </ul>

          <p className="auth-intro-footer">
            One organised step closer to your next opportunity.
          </p>
        </section>

        {/* Reuses the same card for login and registration forms. */}
        <Card className="auth-card">
          <div className="auth-header">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>

          {children}
        </Card>
      </div>
    </main>
  );
}

export default AuthLayout;
