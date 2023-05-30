require("dotenv").config();

const SERVER = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.API_PORT || 6000,
  DEV: process.env.DEV || false,
  API: {
    IS_PRODUCTION: process.env.NODE_ENV === "production",
    RATE_LIMITS: {
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 200, // limit each IP to 200 requests per windowMs
    },
  },
};


module.exports = SERVER;