/**
 * StatusBadge.jsx
 *
 * Reusable component for displaying the current status
 * of a job application.
 *
 * The component receives the status as a prop and
 * applies a matching CSS class for visual styling.
 */

import "../styles/statusbadge.css";

/**
 * Displays a styled application status.
 *
 * @param {Object} props
 * @param {string} props.status - Current application status.
 * @returns {JSX.Element}
 */
function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
  );
}

export default StatusBadge;
