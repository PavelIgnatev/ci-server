const util = require("util");
const fs = require("fs");
const { execFile } = require("child_process");

const execFileAsync = util.promisify(execFile);
const FSrmdir = util.promisify(fs.rmdir);

module.exports = {
  execFile: async (command, array, cwd) => {
    return await execFileAsync(command, array, cwd);
  },
  rmdir: async (repoPath, recursive) => {
    return await FSrmdir(repoPath, { recursive: recursive });
  },
};
