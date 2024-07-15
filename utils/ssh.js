import dayjs from "dayjs";
import { newWithFileOnly } from "./ip2region.js";

const dbPath = "./utils/ip2region.xdb";

/**
 * 匹配登录方式
 * @param {string} log
 * @returns
 */
function matchLogMethod(log) {
  if (log.includes("password")) return "密码";
  else if (log.includes("publickey")) return "密钥";
  else return "未知";
}

/**
 * 查询ip归属地信息
 * @param {string} ip
 * @returns
 */
async function getIPInfo(ip) {
  try {
    // 创建searcher对象
    const searcher = newWithFileOnly(dbPath);
    // 查询
    const data = await searcher.search(ip);
    let regionList = data.region.split("|");
    regionList = regionList.filter((item) => item != "0");
    const region = regionList.join("/");

    return region;
  } catch (e) {
    console.error(e);
    return "";
  }
}

/**
 * 从登录失败的日志中提取信息
 * @param {string} log
 * @returns
 */
export async function regexFailLog(log) {
  if (!!log) {
    // 定义正则表达式
    const regex1 =
      /^(\w+\s\d+\s\d+:\d+:\d+)\s.+\ssshd\[(\d+)\]:\sConnection\s.+\sby\s.+\suser\s(.+)\s(.+)\sport\s(\d+)/;
    const regex2 =
      /^(\w+\s\d+\s\d+:\d+:\d+)\s.+\ssshd\[(\d+)\]:\sDisconnected\sfrom\s.+\suser\s(.+)\s(.+)\sport\s(\d+)/;

    // 使用正则表达式匹配内容
    let matches = null;
    if (log && log.includes("Connection")) matches = regex1.exec(log);
    else if (log && log.includes("Disconnected")) matches = regex2.exec(log);

    // 输出匹配的结果
    if (matches) {
      const address = await getIPInfo(matches[4]);
      return {
        id: matches[2],
        ip: matches[4],
        address,
        port: matches[5],
        method: matchLogMethod(log),
        user: matches[3],
        status: false,
        time: dayjs(matches[1]).format("MM-DD HH:mm:ss"),
        remarks: log,
      };
    } else {
      return {
        id: null,
        ip: null,
        address: null,
        port: null,
        method: null,
        status: null,
        time: null,
        remarks: log,
      };
    }
  }
}

/**
 * 从登录成功的日志中提取信息
 * @param {string} log
 * @returns
 */
export async function regexSuccessLog(log) {
  if (!!log) {
    // 定义正则表达式
    const regex =
      /^(\w+\s\d+\s\d+:\d+:\d+)\s.+\ssshd\[(\d+)\]:\sAccepted\s.+for\s(.+)\sfrom\s(.+)\sport\s(\d+)/;

    // 使用正则表达式匹配内容
    const matches = regex.exec(log);

    // 输出匹配的结果
    if (matches) {
      const address = await getIPInfo(matches[4]);
      return {
        id: matches[2],
        ip: matches[4],
        address,
        port: matches[5],
        method: matchLogMethod(log),
        user: matches[3],
        status: true,
        time: dayjs(matches[1]).format("MM-DD HH:mm:ss"),
        remarks: log,
      };
    } else {
      return {
        id: null,
        ip: null,
        address: null,
        port: null,
        method: null,
        status: null,
        time: null,
        remarks: log,
      };
    }
  }
}
