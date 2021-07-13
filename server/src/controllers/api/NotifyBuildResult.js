const fetch = require("node-fetch");
const conf = require("../../../server-conf.json");

module.exports = async (req, res) => {
  try {

    await fetch(`https://shri.yandex/hw/api/build/finish`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${conf.apiToken}`,
      },
      body: JSON.stringify({
        buildId: req.body.buildId,
        duration: req.body.duration,
        success: req.body.success,
        buildLog: req.body.buildLog,
      }),
    });

    return res.json("");
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};
