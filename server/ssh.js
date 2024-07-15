import { runCmd } from "../utils/cmd.js";
import { regexFailLog, regexSuccessLog } from "../utils/ssh.js";

export async function loadSSHData(req, res) {
  try {
    const { pageNum = 1, pageSize = 10, dateRange } = req.body;

    // 判断运行环境是否在docker中
    let filePath = "";
    if (process.env.RUN_ENVIRONMENT === "docker") {
      filePath = "--directory=/www/log/journal";
    }

    // 获取查询日志的日期范围
    let dateStr = "";
    if (dateRange && dateRange.length === 2) {
      dateStr = `--since="${dateRange[0]}" --until="${dateRange[1]}"`;
    }

    // 获取查询登录状态的条件
    let filterStr =
      "Accepted|Connection .* by .* user|Disconnected from .* user";
    if (req.body.status === true) {
      filterStr = "Accepted";
    } else if (req.body.status === false) {
      filterStr = "Connection .* by .* user|Disconnected from .* user";
    }

    // 分页获取日志
    const command = `journalctl ${filePath} -r -u ssh ${dateStr} | grep -aE '${filterStr}' | tail -n +${
      (pageNum - 1) * pageSize + 1
    } | head -n ${pageSize}`;
    const result = await runCmd(command);
    const logLines = result.trim().split("\n");
    const dataList = await Promise.all(
      logLines.map(async (item) => {
        if (item.includes("Accepted")) return regexSuccessLog(item);
        else return await regexFailLog(item);
      })
    );

    // 获取日志总数
    const totalCommand = `journalctl ${filePath} -u ssh ${dateStr} | grep -aE '${filterStr}' | wc -l`;
    const totalResult = await runCmd(totalCommand);
    const total = Number(totalResult.trim());

    res.json({
      code: 200,
      data: {
        list: dataList,
        total,
        pageNum,
        pageSize,
      },
      message: "success",
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: 500,
      data: {},
      message: error,
      timestamp: Date.now(),
    });
  }
}
