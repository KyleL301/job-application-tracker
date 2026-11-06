const db = require("../config/db");

/**
 * Create a new job application.
 *
 * Each application is assigned to the authenticated user.
 */
const createApplication = (req, res) => {
  const {
    company,
    position,
    location,
    salary,
    status,
    applied_date,
    recruiter_name,
    recruiter_email,
    notes,
    work_type,
    source,
    custom_source,
  } = req.body;

  // Get the user ID from the verified JWT token.
  const userId = req.user.id;

  const sql = `
  INSERT INTO applications
  (
    user_id,
    company,
    position,
    location,
    salary,
    status,
    applied_date,
    recruiter_name,
    recruiter_email,
    notes,
    work_type,
    source,
    custom_source
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
  db.query(
    sql,
    [
      userId,
      company,
      position,
      location,
      salary,
      status,
      applied_date,
      recruiter_name,
      recruiter_email,
      notes,
      work_type,
      source,
      custom_source,
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating application:", err);

        return res.status(500).json({
          message: "Failed to create application",
        });
      }

      res.status(201).json({
        message: "Application created successfully!",
        id: result.insertId,
      });
    },
  );
};

/**
 * Get job applications belonging to the authenticated user.
 */
const getApplications = (req, res) => {
  // Identify the owner from the verified JWT token.
  const userId = req.user.id;

  const sql = `
    SELECT *
    FROM applications
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error retrieving applications:", err);

      return res.status(500).json({
        message: "Failed to retrieve applications",
      });
    }

    res.status(200).json({
      message: "Applications retrieved successfully!",
      count: results.length,
      data: results,
    });
  });
};

/**
 * Update an application belonging to the authenticated user.
 */
const updateApplication = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const {
    company,
    position,
    location,
    salary,
    status,
    applied_date,
    recruiter_name,
    recruiter_email,
    notes,
    work_type,
    source,
    custom_source,
  } = req.body;

  const sql = `
  UPDATE applications
  SET
    company = ?,
    position = ?,
    location = ?,
    salary = ?,
    status = ?,
    applied_date = ?,
    recruiter_name = ?,
    recruiter_email = ?,
    notes = ?,
    work_type = ?,
    source = ?,
    custom_source = ?
  WHERE id = ?
    AND user_id = ?
`;

  db.query(
    sql,
    [
      company,
      position,
      location,
      salary,
      status,
      applied_date,
      recruiter_name,
      recruiter_email,
      notes,
      work_type,
      source,
      custom_source,
      id,
      userId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating application:", err);

        return res.status(500).json({
          message: "Failed to update application",
        });
      }

      // This also applies when the application belongs to another user.
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Application not found",
        });
      }

      res.status(200).json({
        message: "Application updated successfully!",
      });
    },
  );
};

/**
 * Delete an application belonging to the authenticated user.
 */
const deleteApplication = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const sql = `
    DELETE FROM applications
    WHERE id = ?
      AND user_id = ?
  `;

  db.query(sql, [id, userId], (err, result) => {
    if (err) {
      console.error("Error deleting application:", err);

      return res.status(500).json({
        message: "Failed to delete application",
      });
    }

    // An application owned by another user cannot be deleted.
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.status(200).json({
      message: "Application deleted successfully!",
    });
  });
};

module.exports = {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
};
