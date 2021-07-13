const {
  cloneRepoByCommitHash,
} = require("../../utils/cloneRepoByCommitHash.js");
const fetch = require("node-fetch");
const postNotifiAgent = require("../../utils/postNotifyAgent.js");

module.exports = async (req, res) => {
  let start = new Date();
  try {
    res.json("");

    const buildLog = await cloneRepoByCommitHash(
      req.body.branchName,
      req.body.url,
      req.body.commitHash,
      req.body.command
    );

    await fetch("http://host.docker.internal:8080/notify-build-result", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buildId: req.body.buildId,
        duration: Date.now() - start,
        success: !buildLog.code ? true : false,
        buildLog:
          buildLog.stdout + (buildLog.stderr.length ? `\n[1;33m${buildLog.stderr}` : ""),
      }),
    });

    await postNotifiAgent();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
