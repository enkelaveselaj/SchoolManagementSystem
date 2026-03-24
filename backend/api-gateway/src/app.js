const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


const AUTH_SERVICE_URL = "http://localhost:5001";
const SCHOOL_SERVICE_URL =  "http://localhost:5002";

app.use("/auth", createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { "^/auth": "" },
}));


app.use("/school", createProxyMiddleware({
  target: SCHOOL_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { "^/school": "" },
}));


app.get("/health", (req, res) => {
  res.send("API Gateway is running");
});


const PORT =  5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});