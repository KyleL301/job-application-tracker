/**
 * Dashboard.jsx
 *
 * Main dashboard page shown after login.
 * Displays a welcome message, dashboard statistics,
 * and the user's recent job applications.
 */
import { useState } from "react";

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
  const [showForm, setShowForm] = useState(false);

  const [applications, setApplications] = useState([
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
  ]);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    salary: "",
    workType: "",
    source: "",
    customSource: "",
    status: "Applied",
    dateApplied: "",
  });

  /**
   * Adds a new job application to the application list.
   */
  const handleAddApplication = () => {
    // Check that the company and position have been entered.
    if (!formData.company.trim() || !formData.position.trim()) {
      alert("Please enter a company and position.");
      return;
    }

    if (!formData.workType) {
      alert("Please select a work type.");
      return;
    }

    if (!formData.source) {
      alert("Please select a source.");
      return;
    }

    if (!formData.dateApplied) {
      alert("Please select the date you applied.");
      return;
    }

    if (formData.source === "Other" && !formData.customSource.trim()) {
      alert("Please enter the custom source.");
      return;
    }

    const newApplication = {
      id: Date.now(),
      company: formData.company,
      position: formData.position,
      salary: formData.salary,
      workType: formData.workType,
      source: formData.source,
      customSource: formData.customSource,
      status: formData.status,
      dateApplied: formData.dateApplied,
    };

    // Add the new application to the applications list.
    setApplications([...applications, newApplication]);

    // Reset the form fields after submission.
    setFormData({
      company: "",
      position: "",
      salary: "",
      workType: "",
      source: "",
      customSource: "",
      status: "Applied",
      dateApplied: "",
    });

    // Close the form after the application has been added.
    setShowForm(false);
  };

  return (
    <main className="dashboard">
      {/* Hero Section */}
      <Card className="dashboard-hero">
        <h1>Job Application Tracker</h1>

        <p>
          Track your applications, interviews and offers from one central
          dashboard.
        </p>

        <Button onClick={() => setShowForm(true)}>+ Add Application</Button>
      </Card>

      {showForm && (
        <section className="application-form">
          <h2>Add Application</h2>

          <label htmlFor="company">Company</label>

          <input
            id="company"
            type="text"
            value={formData.company}
            onChange={(event) =>
              setFormData({
                ...formData,
                company: event.target.value,
              })
            }
            placeholder="Enter company name"
          />

          <label htmlFor="position">Position</label>

          <input
            id="position"
            type="text"
            value={formData.position}
            onChange={(event) =>
              setFormData({
                ...formData,
                position: event.target.value,
              })
            }
            placeholder="Enter job position"
          />

          <label htmlFor="salary">Salary</label>

          <input
            id="salary"
            type="number"
            value={formData.salary}
            onChange={(event) =>
              setFormData({
                ...formData,
                salary: event.target.value,
              })
            }
            placeholder="Enter salary"
            min="0"
          />

          <label htmlFor="workType">Work Type</label>

          <select
            id="workType"
            value={formData.workType}
            onChange={(event) =>
              setFormData({
                ...formData,
                workType: event.target.value,
              })
            }
          >
            <option value="">Select work type</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          <label htmlFor="source">Source</label>

          <select
            id="source"
            value={formData.source}
            onChange={(event) =>
              setFormData({
                ...formData,
                source: event.target.value,
              })
            }
          >
            <option value="">Select source</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Indeed">Indeed</option>
            <option value="Company Website">Company Website</option>
            <option value="Glassdoor">Glassdoor</option>
            <option value="Recruiter">Recruiter</option>
            <option value="Referral">Referral</option>
            <option value="Other">Other</option>
          </select>

          {formData.source === "Other" && (
            <>
              <label htmlFor="customSource">Custom Source</label>

              <input
                id="customSource"
                type="text"
                value={formData.customSource}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    customSource: event.target.value,
                  })
                }
                placeholder="Enter source"
              />
            </>
          )}

          <label htmlFor="status">Status</label>

          <select
            id="status"
            value={formData.status}
            onChange={(event) =>
              setFormData({
                ...formData,
                status: event.target.value,
              })
            }
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Assessment">Assessment</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>

          <label htmlFor="dateApplied">Date Applied</label>

          <input
            id="dateApplied"
            type="date"
            value={formData.dateApplied}
            onChange={(event) =>
              setFormData({
                ...formData,
                dateApplied: event.target.value,
              })
            }
          />

          <Button type="button" onClick={handleAddApplication}>
            Add Application
          </Button>
        </section>
      )}

      {/* Statistics */}
      <section className="stats-grid">
        <StatCard title="Applications" value="12" />
        <StatCard title="Interviews" value="3" />
        <StatCard title="Offers" value="1" />
        <StatCard title="Rejected" value="8" />
      </section>

      {/* Display the user's job applications in the application table */}
      <ApplicationTable applications={applications} />
    </main>
  );
}

export default Dashboard;
