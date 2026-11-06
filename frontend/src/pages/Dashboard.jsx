/**
 * Dashboard.jsx
 *
 * Main dashboard page shown after login.
 * Displays dashboard statistics and the authenticated user's
 * job applications, and handles application CRUD operations.
 */
import { useEffect, useState } from "react";

import Card from "../components/Card";
import Button from "../components/Button";
import StatCard from "../components/StatCard";
import ApplicationTable from "../components/ApplicationTable";

import "../styles/dashboard.css";

// Centralise the API URL so it is easy to update for deployment later.
// Read the backend address from the environment variables.
// Fall back to localhost during local development.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const APPLICATIONS_API_URL = `${API_BASE_URL}/api/applications`;

/**
 * Redirect the user to login and remove expired credentials.
 */
function redirectToLogin() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  window.location.replace("/login");
}

/**
 * Send an authenticated request to the applications API.
 * Adds the JWT token consistently and redirects if the session is invalid.
 *
 * @param {string} url - API endpoint to request.
 * @param {RequestInit} options - Fetch options such as method and body.
 * @returns {Promise<Response>} The API response.
 */
async function authenticatedFetch(url, options = {}) {
  const token = sessionStorage.getItem("token");

  // Do not send protected requests when the user is not logged in.
  if (!token) {
    redirectToLogin();
    const error = new Error("Authentication is required.");
    error.isAuthenticationError = true;
    throw error;
  }

  // Add the token to every protected request while preserving other headers.
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  // JSON requests need a content type; GET and DELETE do not need a body.
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // An invalid or expired JWT requires the user to sign in again.
  if (response.status === 401) {
    redirectToLogin();
    const error = new Error("Your session has expired. Please log in again.");
    error.isAuthenticationError = true;
    throw error;
  }

  return response;
}

/**
 * Read a JSON response safely in case the server returns an empty body.
 *
 * @param {Response} response - Fetch response to parse.
 * @returns {Promise<Object>} Parsed response data or an empty object.
 */
async function readResponse(response) {
  return response.json().catch(() => ({}));
}

/**
 * Main dashboard component.
 *
 * @returns {JSX.Element} The dashboard page.
 */
function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingApplicationId, setEditingApplicationId] = useState(null);
  const [applications, setApplications] = useState([]);

  // Keep all supported form values in one state object.
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    salary: "",
    recruiterName: "",
    recruiterEmail: "",
    notes: "",
    workType: "",
    source: "",
    customSource: "",
    status: "Applied",
    dateApplied: "",
  });

  useEffect(() => {
    let isActive = true;

    /** Load only applications belonging to the authenticated user. */
    const loadApplications = async () => {
      try {
        const response = await authenticatedFetch(APPLICATIONS_API_URL);
        const data = await readResponse(response);

        if (!response.ok) {
          throw new Error(data.message || "Failed to retrieve applications.");
        }

        if (!Array.isArray(data.data)) {
          throw new Error("The server returned an unexpected response.");
        }

        // Preserve the South African calendar date shown by the dashboard.
        const formattedApplications = data.data.map((application) => ({
          ...application,
          dateApplied: application.applied_date
            ? new Date(application.applied_date).toLocaleDateString("en-CA", {
                timeZone: "Africa/Johannesburg",
              })
            : "",
        }));

        // Avoid updating state if the page unmounts during the request.
        if (isActive) {
          setApplications(formattedApplications);
        }
      } catch (error) {
        // Authentication errors already trigger a redirect to login.
        if (!error.isAuthenticationError) {
          console.error("Error fetching applications:", error);
        }
      }
    };

    loadApplications();

    return () => {
      isActive = false;
    };
  }, []);

  /** Reset the form to its defaults after creating or updating a record. */
  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      location: "",
      salary: "",
      recruiterName: "",
      recruiterEmail: "",
      notes: "",
      workType: "",
      source: "",
      customSource: "",
      status: "Applied",
      dateApplied: "",
    });
    setEditingApplicationId(null);
  };

  /** Start a new application rather than continuing to edit an old one. */
  const handleStartNewApplication = () => {
    resetForm();
    setShowForm(true);
  };

  /**
   * Add a new job application for the authenticated user.
   */
  const handleAddApplication = async () => {
    // Validate required fields before making an API request.
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

    try {
      // The backend currently supports these database fields.
      const response = await authenticatedFetch(APPLICATIONS_API_URL, {
        method: "POST",
        body: JSON.stringify({
          company: formData.company.trim(),
          position: formData.position.trim(),
          location: formData.location || null,
          salary: formData.salary === "" ? null : Number(formData.salary),
          status: formData.status,
          applied_date: formData.dateApplied,
          recruiter_name: formData.recruiterName || null,
          recruiter_email: formData.recruiterEmail || null,
          notes: formData.notes || null,
          work_type: formData.workType || null,
          source: formData.source || null,
          custom_source: formData.customSource || null,
        }),
      });

      const responseData = await readResponse(response);

      if (!response.ok) {
        alert(responseData.message || "Failed to save the application.");
        return;
      }

      // Reflect the saved application immediately without reloading the page.
      const newApplication = {
        id: responseData.id,
        company: formData.company.trim(),
        position: formData.position.trim(),
        location: formData.location,
        salary: formData.salary,
        recruiter_name: formData.recruiterName,
        recruiter_email: formData.recruiterEmail,
        notes: formData.notes,
        workType: formData.workType,
        source: formData.source,
        customSource: formData.customSource,
        status: formData.status,
        dateApplied: formData.dateApplied,
      };

      setApplications((previousApplications) => [
        ...previousApplications,
        newApplication,
      ]);
      resetForm();
      setShowForm(false);
    } catch (error) {
      if (!error.isAuthenticationError) {
        console.error("Error creating application:", error);
        alert("Could not connect to the backend. Please try again.");
      }
    }
  };

  /**
   * Delete an application belonging to the authenticated user.
   *
   * @param {number} applicationId - ID of the application to remove.
   */
  const handleDeleteApplication = async (applicationId) => {
    // Ask for confirmation before permanently deleting an application.
    const confirmed = window.confirm(
      "Are you sure you want to delete this job application? This action cannot be undone.",
    );

    // Cancel the operation if the user chooses not to delete.
    if (!confirmed) {
      return;
    }
    try {
      const response = await authenticatedFetch(
        `${APPLICATIONS_API_URL}/${applicationId}`,
        { method: "DELETE" },
      );
      const responseData = await readResponse(response);

      if (!response.ok) {
        alert(responseData.message || "Failed to delete the application.");
        return;
      }

      // Remove the row only after the backend confirms deletion.
      setApplications((previousApplications) =>
        previousApplications.filter(
          (application) => application.id !== applicationId,
        ),
      );
    } catch (error) {
      if (!error.isAuthenticationError) {
        console.error("Error deleting application:", error);
        alert("Could not connect to the backend. Please try again.");
      }
    }
  };

  /**
   * Load an existing application into the form for editing.
   *
   * @param {number} applicationId - ID of the application to edit.
   */
  const handleEditApplication = (applicationId) => {
    const applicationToEdit = applications.find(
      (application) => application.id === applicationId,
    );

    if (!applicationToEdit) {
      return;
    }

    setFormData({
      company: applicationToEdit.company || "",
      position: applicationToEdit.position || "",
      location: applicationToEdit.location || "",
      salary: applicationToEdit.salary ?? "",
      recruiterName: applicationToEdit.recruiter_name || "",
      recruiterEmail: applicationToEdit.recruiter_email || "",
      notes: applicationToEdit.notes || "",
      workType: applicationToEdit.work_type || applicationToEdit.workType || "",
      source: applicationToEdit.source || "",
      customSource:
        applicationToEdit.custom_source || applicationToEdit.customSource || "",
      status: applicationToEdit.status || "Applied",
      dateApplied: applicationToEdit.dateApplied || "",
    });

    setEditingApplicationId(applicationId);
    setShowForm(true);
  };

  /**
   * Update an existing job application belonging to the logged-in user.
   */
  const handleUpdateApplication = async () => {
    if (!formData.company.trim() || !formData.position.trim()) {
      alert("Please enter a company and position.");
      return;
    }

    if (!formData.dateApplied) {
      alert("Please select the date you applied.");
      return;
    }

    try {
      // Send every field expected by the backend update controller.
      const response = await authenticatedFetch(
        `${APPLICATIONS_API_URL}/${editingApplicationId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            company: formData.company.trim(),
            position: formData.position.trim(),
            location: formData.location || null,
            salary: formData.salary === "" ? null : Number(formData.salary),
            status: formData.status,
            applied_date: formData.dateApplied,
            recruiter_name: formData.recruiterName || null,
            recruiter_email: formData.recruiterEmail || null,
            notes: formData.notes || null,
            work_type: formData.workType || null,
            source: formData.source || null,
            custom_source: formData.customSource || null,
          }),
        },
      );

      const responseData = await readResponse(response);

      if (!response.ok) {
        alert(responseData.message || "Failed to update the application.");
        return;
      }

      // Update the visible row only after the backend confirms success.
      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application.id === editingApplicationId
            ? {
                ...application,
                company: formData.company.trim(),
                position: formData.position.trim(),
                location: formData.location,
                salary: formData.salary,
                recruiter_name: formData.recruiterName,
                recruiter_email: formData.recruiterEmail,
                notes: formData.notes,
                workType: formData.workType,
                source: formData.source,
                customSource: formData.customSource,
                status: formData.status,
                dateApplied: formData.dateApplied,
              }
            : application,
        ),
      );

      resetForm();
      setShowForm(false);
    } catch (error) {
      if (!error.isAuthenticationError) {
        console.error("Error updating application:", error);
        alert("Could not connect to the backend. Please try again.");
      }
    }
  };

  // Calculate dashboard totals from the applications currently loaded.
  const totalApplications = applications.length;
  const totalInterviews = applications.filter(
    (application) => application.status === "Interview",
  ).length;
  const totalOffers = applications.filter(
    (application) => application.status === "Offer",
  ).length;
  const totalRejected = applications.filter(
    (application) => application.status === "Rejected",
  ).length;

  return (
    <main className="dashboard">
      {/* Introductory panel and action to add a new application. */}
      <Card className="dashboard-hero">
        <h1>Job Application Tracker</h1>
        <p>
          Track your applications, interviews and offers from one central
          dashboard.
        </p>
        <Button onClick={handleStartNewApplication}>+ Add Application</Button>
      </Card>

      {showForm && (
        <section className="application-form">
          <h2>
            {editingApplicationId ? "Edit Application" : "Add Application"}
          </h2>

          <label htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            value={formData.company}
            onChange={(event) =>
              setFormData({ ...formData, company: event.target.value })
            }
            placeholder="Enter company name"
            required
          />

          <label htmlFor="position">Position</label>
          <input
            id="position"
            type="text"
            value={formData.position}
            onChange={(event) =>
              setFormData({ ...formData, position: event.target.value })
            }
            placeholder="Enter job position"
            required
          />

          <label htmlFor="salary">Salary</label>
          <input
            id="salary"
            type="number"
            min="0"
            value={formData.salary}
            onChange={(event) =>
              setFormData({ ...formData, salary: event.target.value })
            }
            placeholder="Enter salary"
          />

          <label htmlFor="workType">Work Type</label>
          <select
            id="workType"
            value={formData.workType}
            onChange={(event) =>
              setFormData({ ...formData, workType: event.target.value })
            }
            required
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
              setFormData({ ...formData, source: event.target.value })
            }
            required
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
                  setFormData({ ...formData, customSource: event.target.value })
                }
                placeholder="Enter source"
                required
              />
            </>
          )}

          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(event) =>
              setFormData({ ...formData, status: event.target.value })
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
              setFormData({ ...formData, dateApplied: event.target.value })
            }
            required
          />

          <Button
            type="button"
            onClick={
              editingApplicationId
                ? handleUpdateApplication
                : handleAddApplication
            }
          >
            {editingApplicationId ? "Save Changes" : "Add Application"}
          </Button>
        </section>
      )}

      {/* Statistics update automatically when application state changes. */}
      <section className="stats-grid">
        <StatCard title="Applications" value={totalApplications} />
        <StatCard title="Interviews" value={totalInterviews} />
        <StatCard title="Offers" value={totalOffers} />
        <StatCard title="Rejected" value={totalRejected} />
      </section>

      {/* Each row receives callbacks for its own edit and delete actions. */}
      <ApplicationTable
        applications={applications}
        onDelete={handleDeleteApplication}
        onEdit={handleEditApplication}
      />
    </main>
  );
}

export default Dashboard;
