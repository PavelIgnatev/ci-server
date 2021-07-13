const fetch = require("node-fetch");
const conf = require("../../server-conf.json");
//Получение настроек

module.exports = async () => {
  let data = null;

  try {
    data = (
      await (
        await fetch("https://shri.yandex/hw/api/conf", {
          headers: { Authorization: `Bearer ${conf.apiToken}` },
        })
      ).json()
    ).data;
  } catch (error) {
    console.error(error);
  }

  return data;
};
