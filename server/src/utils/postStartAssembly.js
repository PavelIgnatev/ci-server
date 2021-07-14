const conf = require("../../server-conf.json");
const fetch = require("node-fetch");

async function postStartAssembly(lastList, lastAgent, settings, freeAgents, busyAgents) {
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

    console.log(
      `Агент на порту ${lastAgent.port} получил задачу на сборку и начал ее выполнять`
    );
    console.log('Логи выполнения сборки можно посмотреть в агенте')
  } catch (error) {
    freeAgents = freeAgents.filter((item) => item.port === lastAgent.port);
    delete busyAgents[lastAgent.port]
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
    console.log(
      `Агент на порту ${lastAgent.port} завершил выполнение сборки с ошибкой`
    );
  }
}

module.exports = { postStartAssembly };
