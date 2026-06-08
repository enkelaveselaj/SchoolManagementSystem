const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Configure allowed origins for CORS
// Includes: React web, React Native Expo, Android emulator, iOS simulator
const allowedOrigins = [
  "http://localhost:3000",      // React web app
  "http://localhost:8081",      // Expo dev server
  "http://localhost:19000",     // Expo dev server (SDK 46+)
  "exp://127.0.0.1:8081",       // Expo app on localhost
  "http://localhost:19001",     // Expo web
  "http://10.0.2.2:8081",       // Android emulator connecting to host
  process.env.MOBILE_APP_URL || "" // Custom mobile app URL from env
].filter(Boolean); // Remove empty strings

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Log rejected origins in development
      if (process.env.NODE_ENV === "development") {
        console.log(`CORS request from origin: ${origin}`);
        callback(null, true); // Allow in dev mode
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Simple proxy test
app.use('/school', createProxyMiddleware({
  target: 'http://localhost:5002',
  changeOrigin: true,
  logLevel: 'debug'
}));

app.get("/health", (req, res) => {
  res.send("API Gateway is running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});