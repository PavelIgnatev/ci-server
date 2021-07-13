const myEmitter = require("../../emitter/emitter.js");
module.exports = (req, res) => {
  myEmitter.emit("newAgent", req.body);
  return res.json("");
};
