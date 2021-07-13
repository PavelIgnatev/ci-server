const myEmitter = require("../emitter/emitter.js");
const getBuildList = require("../utils/getBuildList.js");

async function updatePendingAssemblyList(
  pendingAssemblyList,
  isStartup = false
) {
  let buildList = await getBuildList();
  buildList.forEach((element) => {
    if (
      element.status === "Waiting" ||
      (isStartup ? element.status === "InProgress" : false)
    ) {
      if (
        JSON.stringify(pendingAssemblyList).indexOf(JSON.stringify(element)) ===
        -1
      ) {
        pendingAssemblyList.push(element);
      }
    }
  });
}
module.exports = updatePendingAssemblyList;
