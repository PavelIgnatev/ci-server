const fetch = require("node-fetch");
const conf = require("../../agent-conf.json");

const postNotifiAgent = async () => {
  try {
    await fetch(`${conf.serverHost}${conf.serverPort}/notify-agent`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host: "0.0.0.0",
        port: process.env.AGENT_PORT,
      }),
    });
    console.log("Агент смог законнектиться с сервером");
  } catch {
    console.log(
      "Агент не смог законнектиться с сервером и будет пытаться делать это каждые 10 секунд"
    );
    let interval = setInterval(async () => {
      try {
        await fetch(`${conf.serverHost}${conf.serverPort}/notify-agent`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            host: "0.0.0.0",
            port: process.env.AGENT_PORT,
          }),
        });
        clearInterval(interval);
      } catch {}
    }, 10000);
  }
};

module.exports = postNotifiAgent;
