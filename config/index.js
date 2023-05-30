require("dotenv").config();

const SERVER = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.API_PORT || 6000,
  DEV: process.env.DEV || false,
  API: {
    IS_PRODUCTION: process.env.NODE_ENV === "production",
    ALLOWED_DOMAINS: ["http://localhost:5173", "http://127.0.0.1:5173"],
    RATE_LIMITS: {
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 200, // limit each IP to 200 requests per windowMs
    },
  },
};


module.exports = SERVER;