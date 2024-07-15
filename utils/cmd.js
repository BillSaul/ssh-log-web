import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

/**
 * 运行shell命令
 * @param {string} command
 * @returns
 */
export const runCmd = async (command) => {
  try {
    const { stdout, stderr } = await execPromise(command);
    console.info(`runCmd ~ command: ${command}`);
    // console.log(`runCmd ~ stdout: \n${stdout}`);
    // console.log(`runCmd ~ stderr: \n${stderr}`);
    return stdout;
  } catch (err) {
    console.error(`runCmd ~ 执行出错: \n${err}`);
  }
};
