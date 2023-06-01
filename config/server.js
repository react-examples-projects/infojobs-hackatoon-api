const { PORT } = require("./");
const { message } = require("../helpers/utils");
const { connectDb, closeDb } = require("./connection");
const wrapServerErrors = require("../middleware/errorsHandling");

async function startServer(app, routers) {
  try {
    console.clear();
    await connectDb();

    app.use("/api", routers);
    app.use((_, res, next) => {
      res.status(404).json({ status: 404, body: "Not Found" });
      next();
    });
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
