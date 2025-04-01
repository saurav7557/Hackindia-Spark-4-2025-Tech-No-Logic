require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { provider } = require("./utils/web3");

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import Routes
const certificateRoutes = require("./routes/certificateRoutes");
const pdfRoutes = require("./routes/pdfRoutes");

// API Routes
app.use("/api/certificates", certificateRoutes);
app.use("/api/pdf", pdfRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("Blockchain Certificate API is Running Smoothly");
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack || err.message);
  res.status(500).json({
    error: "Something went wrong on our end. Please try again later.",
    message: err.message,
  });
});

// Start Server Only If Web3 is Connected
const startServer = async () => {
  try {
    await provider.getBlockNumber(); // ✅ Check Blockchain Connection
    console.log("Successfully connected to Blockchain");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is up and running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to Blockchain:", error.stack || error.message);
    process.exit(1); // Stop execution if blockchain connection fails
  }
};

startServer();