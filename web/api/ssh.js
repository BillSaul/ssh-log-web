import axios from "axios";

// 获取SSH登录日志
export function getSSHLogs(data) {
  return axios({
    method: "post",
    url: "/api/sshLog",
    data: data,
  });
}
