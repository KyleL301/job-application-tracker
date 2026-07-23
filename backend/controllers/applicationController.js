const db = require("../config/db");

/**
 * Create a new job application
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
  } = req.body;

  const sql = `
    INSERT INTO applications
    (
      company,
      position,
      location,
      salary,
      status,
      applied_date,
      recruiter_name,
      recruiter_email,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    ],
    (err, result) => {
      if (err) {
        console.error(err);
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
 * Get all job applications
 */
const getApplications = (req, res) => {
  const sql = "SELECT * FROM applications ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

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
 * Update an existing job application
 */
const updateApplication = (req, res) => {
  const { id } = req.params;

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
    notes = ?
  WHERE id = ?
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
      id,
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to update application",
        });
      }

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
 * Delete an existing job application
 */
const deleteApplication = (req, res) => {
  const { id } = req.params;

  const sql = `
  DELETE FROM applications
  WHERE id = ?
`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete application",
      });
    }

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
