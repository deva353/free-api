const express = require("express");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Student API is running"
    });
});

module.exports = app;
