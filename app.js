const express = require("express");
require("dotenv").config();

const sequelize = require("./config/db");

const schoolRoutes = require("./routes/schoolRoutes");

const app = express();

app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("School Management API Running");
});

// API routes
app.use("/api", schoolRoutes);

const PORT = process.env.PORT || 5000;

// Connect DB
sequelize
  .sync()
  .then(() => {
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database Error:", err);
  });