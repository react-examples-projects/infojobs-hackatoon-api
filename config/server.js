const { PORT } = require("./");
const { message } = require("../helpers/utils");
const { connectDb, closeDb } = require("./connection");
const cors = require("cors");
const wrapServerErrors = require("../middleware/errorsHandling");
const corsOptions = {
  origin(origin, callback) {
    callback(null, true);
  },
  credentials: true,
};
const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,token");
  next();
};

async function startServer(app, routers) {
  try {
    console.clear();
    await connectDb();

    app.use("/api", routers);
    app.use((_, res, next) => {
      res.status(404).json({ status: 404, body: "Not Found" });
      next();
    });
    app.use(cors(corsOptions));
    app.use(allowCrossDomain);

    wrapServerErrors(app);

    const server = app.listen(PORT, "0.0.0.0", async () => {
      message.success(`Server has started in http://localhost:${PORT}/`);
      process.on("SIGINT", () => closeDb(server));
      process.on("SIGTERM", () => closeDb(server));
    });
  } catch (err) {
    message.error("Error Ocurred while starting the server", err);
  }
}

module.exports = startServer;
