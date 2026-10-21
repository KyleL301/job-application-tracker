/**
 * applicationRoutes.js
 *
 * Defines all routes related to
 * job applications.
 */

const express = require("express");
const router = express.Router();

// Verify the user's JWT token before allowing access to application routes.
const authMiddleware = require("../middleware/authMiddleware");

// Import controller
const {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} = require("../controllers/applicationController");

// Create a job application.
router.post("/", authMiddleware, createApplication);

// Retrieve job applications.
router.get("/", authMiddleware, getApplications);

// Update an existing job application.
router.put("/:id", authMiddleware, updateApplication);

// Delete an existing job application.
router.delete("/:id", authMiddleware, deleteApplication);

module.exports = router;
