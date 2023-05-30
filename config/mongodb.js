const mongodb = require("mongodb");
const { MONGODB_URI } = require("./");
const MongoClient = mongodb.MongoClient;
const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

module.exports = {
  MongoClient,
  MONGODB_URL: MONGODB_URI,
  OPTIONS,
};
