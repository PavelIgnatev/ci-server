const express = require("express");
const controllers = require("./controllers/api");

const mainRouter = new express.Router();

mainRouter.post("/build", controllers.build);

module.exports = mainRouter;
