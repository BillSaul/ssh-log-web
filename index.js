import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dayjs from "dayjs";
import cors from "cors";
import { loadSSHData } from "./server/ssh.js";

const app = express();
const port = process.env.SERVER_PORT || 43000;

// 获取当前文件的目录名
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 中间件
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL-encoded 请求体
app.use(cors()); // 使用 CORS 中间件处理跨域请求

// 自定义中间件：输出请求信息
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = `${dayjs().format("YYYY-MM-DD HH:mm:ss")} - ${req.ip} - ${
      req.method
    } - ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;
    console.log(log);
  });
  next();
});

// 提供静态文件web服务
app.use(express.static(path.join(__dirname, "dist")));

// 后端接口
app.post("/api/sshLog", loadSSHData);

// 启动服务器
app.listen(port, () => {
  console.log(`服务运行在 ${port} 端口`);
});
