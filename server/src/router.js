const express = require("express");
const controllers = require("./controllers/api");

const mainRouter = new express.Router();

mainRouter.post("/notify-agent", controllers.NotifyAgent);
mainRouter.post("/notify-build-result", controllers.NotidtBuildResult);
mainRouter.post("/update-settings", controllers.UpdateSettings)
module.exports = mainRouter;
