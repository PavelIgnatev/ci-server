const express = require("express");
const setupMiddlewares = require("./middlewares");
const conf = require("../agent-conf.json");
const mainRouter = require("./router");
const postNotifiAgent = require("./utils/postNotifyAgent");

const app = express();

const host = "0.0.0.0";

// setup other
setupMiddlewares(app);

app.use("/", mainRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

//Обрабатываем ситуацию, когда при старте не смог соединиться с сервером.
postNotifiAgent()

app.listen(conf.port, host);
console.log(`running on http://${host}:${conf.port}`);
