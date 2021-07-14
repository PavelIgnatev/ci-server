const fetch = require("node-fetch");
const postNotifiAgent = require("./postNotifyAgent.js");
const conf = require("../../agent-conf.json");

const postNotifyBuildResult = async (body) => {
  try {
    await fetch(`${conf.serverHost}${conf.serverPort}/notify-build-result`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    postNotifiAgent();
    console.log("Агент смог законнектиться с сервером");
  } catch {
    console.log(
      "Агент не смог законнектиться с сервером и будет пытаться делать это каждые 10 секунд"
    );
    let interval = setInterval(async () => {
      try {
        await fetch(
          `${conf.serverHost}${conf.serverPort}/notify-build-result`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );
        postNotifiAgent();
        console.log('Агент смог законнектиться с сервером и теперь может получать задачи')
        clearInterval(interval);
      } catch {}
    }, 10000);
  }
};

module.exports = postNotifyBuildResult;
