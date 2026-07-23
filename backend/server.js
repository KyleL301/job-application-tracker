const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const healthRoutes = require("./routes/healthRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

const PORT = 5000;

/*
=====================================
Middleware
=====================================
*/

// Allows frontend requests from React
app.use(cors());

// Allows Express to understand JSON
app.use(express.json());

/*
=====================================
Routes
=====================================
*/

app.get("/", (req, res) => {
  res.json({
    message: "Job Application Tracker API is running",
  });
});

/*
=====================================
Start Server
=====================================
*/
app.use("/api/health", healthRoutes);
app.use("/api/applications", applicationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
