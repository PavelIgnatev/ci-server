const EventEmitter = require("events");
const myEmitter = new EventEmitter();
const { postStartAssembly } = require("../utils/postStartAssembly");
const updatePendingAssemblyList = require("../utils/updatePendingAssemblyList");
const checkBusyAgents = require("../utils/checkBusyAgents");

const getSettings = require("../utils/getSettings.js");

let settings;
let interval;
let pendingAssemblyList = [];
let freeAgents = [];
let busyAgents = {};

async function emitGetSettings() {
  settings = await getSettings();
}

async function harnessAnAgent() {
  while (pendingAssemblyList.length > 0 && freeAgents.length > 0) {
    let lastList = pendingAssemblyList.pop();
    let lastAgent = freeAgents.pop();
    busyAgents[lastAgent.port] = lastList;
    await postStartAssembly(lastList, lastAgent, settings, freeAgents, busyAgents);
  }
}

function updateByPeriod() {
  return setInterval(async () => {
    await checkBusyAgents(pendingAssemblyList, busyAgents, freeAgents);
    await updatePendingAssemblyList(pendingAssemblyList);
    await harnessAnAgent();
  }, 10000);
}

(async () => {
  await emitGetSettings();
  console.log("Сервер запущен и получил настройки");
  await updatePendingAssemblyList(pendingAssemblyList, true);
  console.log(
    "Сервер запущен и доставил информацию о сборках в статусе Waiting и InProgress в массив pendingAssemblyList"
  );
  if (settings.repoName) {
    console.log("Настройки на странице присутствуют, интервал для обновления страницы запущен");
    myEmitter.emit("setInterval");
  }
})();

myEmitter.on("setInterval", () => {
  clearInterval(interval);
  interval = updateByPeriod();
});

myEmitter.on("updateSettings", (req) => {
  let data = req;
  let changeSettings = data.changeSettings;
  delete data.changeSettings;
  settings = data;
  console.log("Пришли новые настройки");

  if (changeSettings) {
    console.log("Очередь ожидания теперь пуста");
    pendingAssemblyList = [];
  }

  myEmitter.emit("setInterval");
});

myEmitter.on("newAgent", (agent) => {
  if (freeAgents.indexOf(agent) === -1){
    delete busyAgents[agent.port]
    console.log(`Агент на порту ${agent.port} стал доступен`);
    freeAgents.push(agent);
  }
});

module.exports = myEmitter;
