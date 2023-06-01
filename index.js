const morgan = require("morgan");
const express = require("express");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

const app = express();
const startServer = require("./config/server");
const { API } = require("./config/");
const routers = require("./routers");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(hpp());
app.use(rateLimit(API.RATE_LIMITS));

startServer(app, routers);

process.on("unhandledRejection", (err) => {
  console.error(err.message);
  process.exit(1);
});

process.on("warning", (e) => console.warn(e.stack));
