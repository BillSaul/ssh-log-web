# 使用的镜像
FROM node:lts-iron

# 替换镜像源
RUN sed -i 's/deb.debian.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list.d/debian.sources

# 设置时区交互非交互式（这里选择非交互式）
ENV DEBIAN_FRONTEND=noninteractive

# 更新apt包列表并安装相关包
RUN apt update && \
  apt install -y tzdata systemd systemd-sysv && \
  apt clean

# 设置时区为Asia/Shanghai（可以根据需要修改）
ENV TZ=Asia/Shanghai

# 应用时区设置
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 设置工作目录
WORKDIR /www

# 设置环境变量
ENV WORKDIR=/www
ENV RUN_ENVIRONMENT=docker
ENV SERVER_PORT=43000

# 复制package.json
COPY package.json ./

# 安装依赖
RUN npm install --registry=https://registry.npmmirror.com

# 复制项目文件
COPY . .

# 构建web项目
RUN npm run build:web

# 在容器启动时运行的命令，可以根据需要修改
CMD ["npm", "run", "server"]