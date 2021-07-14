const {
  cloneRepoByCommitHash,
} = require("../../utils/cloneRepoByCommitHash.js");
const postNotifiAgent = require("../../utils/postNotifyAgent.js");
const postNotifyBuildResult = require("../../utils/postNotifyBuildResult");

module.exports = async (req, res) => {
  let start = new Date();

  res.json("");

  const buildLog = await cloneRepoByCommitHash(
    req.body.branchName,
    req.body.url,
    req.body.commitHash,
    req.body.command
  );

  postNotifyBuildResult({
    buildId: req.body.buildId,
    duration: Date.now() - start,
    success: !buildLog.code ? true : false,
    buildLog:
      buildLog.stdout + (buildLog.stderr.length ? `\n${buildLog.stderr}` : ""),
  });
};
