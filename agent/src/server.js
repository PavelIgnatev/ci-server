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

//Обрабатываем ситуацию, когда при старте не смог соединиться с сервером.
postNotifiAgent()

app.listen(conf.port, host);
console.log(`Агент запущен и работает на порту ${process.env.AGENT_PORT}`);
