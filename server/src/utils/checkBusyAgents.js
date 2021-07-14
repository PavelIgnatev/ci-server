const fetch = require("node-fetch");

async function checkBusyAgents(pendingAssemblyList, busyAgents, freeAgents) {
  return await Object.keys(busyAgents).forEach(async (port) => {
    try {
      await fetch(`http://host.docker.internal:${port}`);
    } catch {
      freeAgents = freeAgents.filter((item) => item.port === port);
      console.log(
        "Агент на порту " + port + " недоступен"
      );
      if (busyAgents[port]) {
        pendingAssemblyList.push(busyAgents[port]);
        console.log(
          `Задача на сборку, выполняемая портом ${port}, была повторно добавлена в очередь задач, при наличии свободного порта задача будет повторно запущена`
        );
        delete busyAgents[port];
      }
    }
  });
}

module.exports = checkBusyAgents;
