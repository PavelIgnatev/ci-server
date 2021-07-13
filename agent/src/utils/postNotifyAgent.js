const fetch = require("node-fetch");
const conf = require("../../agent-conf.json");

const postNotifiAgent = () =>
  fetch(`${conf.serverHost}${conf.serverPort}/notify-agent`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      host: "0.0.0.0",
      port: process.env.AGENT_PORT,
    }),
  });
module.exports = postNotifiAgent;
