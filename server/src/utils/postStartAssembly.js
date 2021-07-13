const conf = require("../../server-conf.json");
const fetch = require("node-fetch");

async function postStartAssembly(lastList, lastAgent, settings) {
  try {
    if (lastList.status === "Waiting") {
      await fetch("https://shri.yandex/hw/api/build/start", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${conf.apiToken}`,
        },
        body: JSON.stringify({
          buildId: lastList.id,
          dateTime: new Date(),
        }),
      });
    }

    //Если сервер не смог соединиться с агентом, то будет выброшена ошибка и сборка будет завершена неудачно
    await fetch(`http://host.docker.internal:${lastAgent.port}/build`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        branchName: lastList.branchName,
        url: settings.repoName,
        commitHash: lastList.commitHash,
        command: settings.buildCommand,
        buildId: lastList.id,
      }),
    });
  } catch (error) {
    await fetch(`https://shri.yandex/hw/api/build/finish`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${conf.apiToken}`,
      },
      body: JSON.stringify({
        buildId: lastList.id,
        duration: 0,
        success: false,
        buildLog: "Sorry, the server has crashed",
      }),
    });
  }
}

module.exports = { postStartAssembly };
