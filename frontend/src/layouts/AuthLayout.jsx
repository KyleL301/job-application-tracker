/**
 * AuthLayout.jsx
 *
 * Shared layout used by all authentication pages.
 * Provides a centered card with branding and renders
 * whichever authentication page is passed as children.
 */

import Card from "../components/Card";
import "../styles/auth.css";

function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="auth-page">
      <Card className="auth-card">
        <div className="auth-header">
          <h1>💼 Job Application Tracker</h1>

          <h2>{title}</h2>

          <p>{subtitle}</p>
        </div>

        {children}
      </Card>
    </main>
  );
}

export default AuthLayout;
