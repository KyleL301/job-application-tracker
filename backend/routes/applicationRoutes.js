/**
 * applicationRoutes.js
 *
 * Defines all routes related to
 * job applications.
 */

const express = require("express");
const router = express.Router();

// Import controller
const {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} = require("../controllers/applicationController");

/**
 * POST /api/applications
 *
 * Creates a new job application.
 */
router.post("/", createApplication);

/**
 * GET /api/applications
 * Get all applications
 */
router.get("/", getApplications);

/**
 * PUT /api/applications/:id
 *
 * Updates an existing job application.
 */
router.put("/:id", updateApplication);

/**
 * DELETE /api/applications/:id
 *
 * Deletes a specific job application from the database
 * using the application's unique ID.
 */
router.delete("/:id", deleteApplication);

module.exports = router;
