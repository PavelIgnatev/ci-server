const { execFile, rmdir } = require("../utils/promisify.js");
const path = require("path");
const os = require("os");
const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);

const { generateId } = require("./generateId.js");
module.exports.cloneRepoByCommitHash = async (
  branchName,
  url,
  commitHash,
  command
) => {
  console.log("----------------------------------------");
  console.log("cloneRepoByCommitHash");
  console.log(
    "Функция клонирования репозитория получила такие входные данные:"
  );
  console.log({
    branchName,
    url,
    commitHash,
    command,
  });
  let result;
  let code = 1;

  const repoPath = path.resolve(os.tmpdir(), generateId());

  try {
    console.log(
      "Клонирование полного репозитория в папку " + repoPath + " начато"
    );

    await execFile("git", [
      "clone",
      "-b",
      branchName,
      `https://github.com/${url}.git`,
      repoPath,
    ]);

    console.log(
      "Клонирование полного репозитория в папку " + repoPath + " завершено"
    );

    await execFile("git", ["checkout", commitHash], { cwd: repoPath });

    console.log("Чекаут до нужного branch произошел");

    const execAsyncEnv = {
      ...process.env,
      FORCE_COLOR: 3,
      TERM: "xterm-256color",
    };
    execAsyncEnv.npm_config_production = "false";

    console.log("Начинаю выполнять команду " + command);

    result = await execAsync(command, {
      cwd: repoPath,
      env: execAsyncEnv,
      shell: true,
    });

    console.log("Закончил выполнять команду " + command);

    await rmdir(repoPath, true);

    console.log("Удаляю папку " + repoPath);

    console.log("Выполнение закончено успешно");

    console.log("----------------------------------------");
    code = 0;
    return { ...result, code };
  } catch (error) {
    console.error(
      "На каком-то этапе произошла очень печальная ошибка, я не устоял :("
    );
    await rmdir(repoPath, true);

    console.log("Удаляю папку " + repoPath);

    console.log("Выполнение закончено с ошибкой " + error);

    console.log("----------------------------------------");

    return result ? { ...result, code } : error;
  }
};
