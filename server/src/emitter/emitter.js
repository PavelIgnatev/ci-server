const EventEmitter = require("events");
const myEmitter = new EventEmitter();
const { postStartAssembly } = require("../utils/postStartAssembly");
const updatePendingAssemblyList = require("../utils/updatePendingAssemblyList");

const getSettings = require("../utils/getSettings.js");

let settings;
let interval;
let pendingAssemblyList = [];
let freeAgents = [];

async function emitGetSettings() {
  settings = await getSettings();
}

async function harnessAnAgent() {
  while (pendingAssemblyList.length > 0 && freeAgents.length > 0) {
    let lastList = pendingAssemblyList.pop();
    let lastAgent = freeAgents.pop();
    await postStartAssembly(lastList, lastAgent, settings);
  }
}

function updateByPeriod() {
  return setInterval(async () => {
    await updatePendingAssemblyList(pendingAssemblyList);
    await harnessAnAgent();
  }, settings.period * 1000 * 60);
}

(async () => {
  await emitGetSettings();
  await updatePendingAssemblyList(pendingAssemblyList, true);
  if (settings.id) myEmitter.emit("setInterval");
})();

myEmitter.on("setInterval", () => {
  clearInterval(interval);
  interval = updateByPeriod();
});

myEmitter.on("updateSettings", (req) => {
  settings = req;
  pendingAssemblyList = [];
  myEmitter.emit("setInterval");
});

myEmitter.on("newAgent", (agent) => {
  if (freeAgents.indexOf(agent) === -1) freeAgents.push(agent);
});

module.exports = myEmitter;
