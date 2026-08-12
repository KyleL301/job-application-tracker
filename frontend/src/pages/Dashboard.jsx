/**
 * Dashboard.jsx
 *
 * Main dashboard page shown after login.
 * Displays a welcome message, dashboard statistics,
 * and the user's recent job applications.
 */

import Card from "../components/Card";
import Button from "../components/Button";
import StatCard from "../components/StatCard";
import ApplicationTable from "../components/ApplicationTable";

import "../styles/dashboard.css";

/**
 * Main dashboard component.
 *
 * Provides an overview of the user's career activity
 * and displays recent job applications.
 *
 * @returns {JSX.Element} The dashboard page.
 */
function Dashboard() {
  return (
    <main className="dashboard">
      {/* Hero Section */}
      <Card className="dashboard-hero">
        <h1>Job Application Tracker</h1>

        <p>
          Track your applications, interviews and offers from one central
          dashboard.
        </p>

        <Button>+ Add Application</Button>
      </Card>

      {/* Statistics */}
      <section className="stats-grid">
        <StatCard title="Applications" value="12" />
        <StatCard title="Interviews" value="3" />
        <StatCard title="Offers" value="1" />
        <StatCard title="Rejected" value="8" />
      </section>

      {/* Recent Applications */}
      <ApplicationTable
        applications={[
          {
            id: 1,
            company: "Entelect",
            position: "Graduate Software Developer",
            status: "Applied",
            dateApplied: "10 Aug 2026",
          },
          {
            id: 2,
            company: "Sanlam",
            position: "Software Developer",
            status: "Interview",
            dateApplied: "08 Aug 2026",
          },
          {
            id: 3,
            company: "Old Mutual",
            position: "Junior Software Engineer",
            status: "Rejected",
            dateApplied: "05 Aug 2026",
          },
        ]}
      />
    </main>
  );
}

export default Dashboard;
