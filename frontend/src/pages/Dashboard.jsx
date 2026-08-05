/**
 * Dashboard.jsx
 *
 * Main dashboard page shown after login.
 * Displays a welcome message and dashboard statistics.
 */

import Card from "../components/Card";
import Button from "../components/Button";
import StatCard from "../components/StatCard";

import "../styles/dashboard.css";

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
    </main>
  );
}

export default Dashboard;
