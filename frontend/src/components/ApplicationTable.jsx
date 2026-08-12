/**
 * ApplicationTable.jsx
 *
 * Reusable component responsible for displaying
 * a collection of job applications.
 *
 * The component currently receives application data
 * as props. Later, this data will come from the
 * backend API.
 */

import ApplicationRow from "./ApplicationRow";
import "../styles/applicationtable.css";

/**
 * Displays a list of job applications.
 *
 * @param {Object} props
 * @param {Array} props.applications - List of job applications.
 */
function ApplicationTable({ applications }) {
  return (
    <section className="application-table">
      <div className="application-table-header">
        <h2>Recent Applications</h2>
      </div>

      <div className="application-table-columns">
        <span>Company</span>
        <span>Position</span>
        <span>Status</span>
        <span>Date Applied</span>
      </div>

      <div className="application-table-body">
        {applications.length > 0 ? (
          applications.map((application) => (
            <ApplicationRow key={application.id} application={application} />
          ))
        ) : (
          <div className="application-empty-state">
            <h3>No applications yet</h3>

            <p>
              Start tracking your job search by adding your first application.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ApplicationTable;
