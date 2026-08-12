/**
 * ApplicationRow.jsx
 *
 * Reusable component responsible for displaying
 * one job application inside the applications table.
 *
 * The component receives application information
 * through props so it can be reused for multiple jobs.
 */

import StatusBadge from "./StatusBadge";
import "../styles/applicationrow.css";

/**
 * Displays a single job application.
 *
 * @param {Object} props
 * @param {Object} props.application - Job application data.
 * @param {string} props.application.company - Company name.
 * @param {string} props.application.position - Job position.
 * @param {string} props.application.status - Application status.
 * @param {string} props.application.dateApplied - Date the application was submitted.
 */
function ApplicationRow({ application }) {
  return (
    <div className="application-row">
      <div className="application-company">
        <strong>{application.company}</strong>
      </div>

      <div className="application-position">{application.position}</div>

      <div className="application-status">
        <StatusBadge status={application.status} />
      </div>

      <div className="application-date">{application.dateApplied}</div>
    </div>
  );
}

export default ApplicationRow;
