/**
 * Authentication Routes
 *
 * These routes handle authentication-related requests.
 */

const express = require("express");
const router = express.Router();

// Import the registration and login controller functions.
const { registerUser, loginUser } = require("../controllers/authController");

// POST /api/auth/register
router.post("/register", registerUser);
// POST /api/auth/login
router.post("/login", loginUser);

module.exports = router;
