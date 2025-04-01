require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { provider } = require("./utils/web3"); // ✅ Import Web3 setup

// Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import Routes
const certificateRoutes = require("./routes/certificateRoutes");
const pdfRoutes = require("./routes/pdfRoutes"); // ✅ New Route for PDF Generation

app.use("/api/certificates", certificateRoutes);
app.use("/api/pdf", pdfRoutes); // ✅ PDF Generation Endpoint

// Health Check Route
app.get("/", (req, res) => {
  res.send("✅ Blockchain Certificate API is Running");
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Start Server Only If Web3 is Connected
const startServer = async () => {
  try {
    await provider.getBlockNumber(); // ✅ Check Blockchain Connection
    console.log("✅ Connected to Blockchain");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Web3 Connection Failed:", error.message);
    process.exit(1); // Stop execution if blockchain connection fails
  }
};

startServer();
