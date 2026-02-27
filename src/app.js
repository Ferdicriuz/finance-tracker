const express = require("express");

const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const transactionRoutes = require("./routes/transactionRoutes");
const path = require("path");

app.use(express.static(path.join(__dirname, "../public")));

// Security headers
app.use(helmet());

// Limit repeated requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // max requests per IP
});
app.use(limiter);

// Prevent NoSQL injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));

module.exports = app;