const myEmitter = require("../../emitter/emitter.js");

module.exports = (req, res) => {
  if (req.body) {
    myEmitter.emit("updateSettings", req.body);
    return res.json("");
  } else {
    return res.status(500).json("error");
  }
};
