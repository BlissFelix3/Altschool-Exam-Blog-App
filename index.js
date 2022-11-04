const dotenv = require("dotenv");
dotenv.config();
require("./middleware/passport");

// extra security packages for Heroku
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");

const app = express();

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// Routes
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

// Calling routes
app.use("/blog", blogRoute);
app.use("/user", userRoute);

// Home route
app.get("/", (req, res) => {
  return res.status(200).json({ message: "successful" });
});

// 404 route
app.use("*", (req, res) => {
  return res.status(404).json({ message: "route not found" });
});

module.exports = app;
