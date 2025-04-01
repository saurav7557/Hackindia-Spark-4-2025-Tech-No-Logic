require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { provider } = require("./utils/web3");
const connectDB = require("./utils/db");


const certificateRoutes = require("./routes/certificateRoutes");
const authRoutes = require("./routes/authRoutes");

// Initialize Express App
const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database Connection
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/certificates", certificateRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("Blockchain Certificate API is Running Smoothly");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack || err.message);
  res.status(err.statusCode || 500).json({
    error: err.message || "Something went wrong on our end. Please try again later.",
  });
});

// Start Server Only If Web3 and DB are Connected
const startServer = async () => {
  try {
    // Check Blockchain Connection
    await provider.getBlockNumber();
    console.log("Successfully connected to Blockchain");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.stack || error.message);
    process.exit(1);
  }
};

startServer();