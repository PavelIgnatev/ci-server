const express = require("express");
const setupMiddlewares = require("./middlewares");
const conf = require("../server-conf.json");
const mainRouter = require("./router");
require('./emitter/emitter.js')
const app = express();

// setup other
setupMiddlewares(app);

app.use("/", mainRouter);

app.listen(conf.port, () => {
  console.log(`Сервер запущен и доступен на порту ${conf.port}`);
});
