# BSC链可视化项目部署说明

本文档提供BSC链可视化项目的详细部署步骤，包括环境配置、后端部署、前端部署和Docker部署方式。

## 环境要求

### 系统要求

- 操作系统：Linux、macOS或Windows
- 内存：至少4GB RAM
- 存储：至少1GB可用空间

### 软件要求

- **Node.js**: v16.0.0或更高版本
- **Python**: v3.8或更高版本
- **npm/yarn**: 包管理工具
- **Git**: 版本控制工具

## 获取代码

```bash
# 克隆仓库
git clone https://github.com/your-organization/DeepFlow.git
cd DeepFlow
```

## 后端部署

### 1. 安装Python依赖

```bash
cd bsc/backend
pip install -r requirements.txt
```

如果`requirements.txt`不存在，请安装以下依赖：

```bash
pip install fastapi uvicorn web3 pydantic python-dotenv
```

### 2. 配置环境变量

在`bsc/backend`目录下创建`.env`文件，并设置以下变量：

```
# BSC节点配置
BSC_PROVIDER_URL=https://bsc-dataseed.binance.org/
BSC_CHAIN_ID=56

# API服务配置
API_HOST=0.0.0.0
API_PORT=8000

# 日志级别
LOG_LEVEL=info
```

对于测试网络，可以使用以下配置：

```
BSC_PROVIDER_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
BSC_CHAIN_ID=97
```

### 3. 启动API服务

```bash
cd bsc/backend
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

服务启动后，可以通过访问`http://localhost:8000/docs`查看API文档。

## 前端部署

### 1. 安装Node.js依赖

```bash
cd bsc/frontend
npm install
```

### 2. 配置环境变量

在`bsc/frontend`目录下创建`.env`文件，并设置以下变量：

```
REACT_APP_API_URL=http://localhost:8000
```

如果后端部署在不同的主机或端口，请相应地修改API_URL。

### 3. 开发模式运行

```bash
npm start
```

应用将在开发模式下启动，并自动在浏览器中打开`http://localhost:3000`。

### 4. 生产环境构建

```bash
npm run build
```

构建完成后，生成的静态文件将位于`build`目录中，可以使用任何静态文件服务器进行部署。

#### 使用serve部署静态文件

```bash
npm install -g serve
serve -s build
```

## Docker部署

### 1. 创建Docker配置文件

在项目根目录下创建`docker-compose.yml`文件：

```yaml
version: '3'

services:
  backend:
    build:
      context: ./bsc/backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - BSC_PROVIDER_URL=https://bsc-dataseed.binance.org/
      - BSC_CHAIN_ID=56
      - API_HOST=0.0.0.0
      - API_PORT=8000
    volumes:
      - ./bsc/backend:/app
    restart: unless-stopped

  frontend:
    build:
      context: ./bsc/frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    restart: unless-stopped
```

在`bsc/backend`目录下创建`Dockerfile`：

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
```

在`bsc/frontend`目录下创建`Dockerfile`：

```dockerfile
# 构建阶段
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

在`bsc/frontend`目录下创建`nginx.conf`：

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /ws/ {
        proxy_pass http://backend:8000/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

### 2. 构建和启动Docker容器

```bash
docker-compose build
docker-compose up -d
```

服务启动后，可以通过访问`http://localhost:3000`使用应用。

## 生产环境部署建议

### 安全配置

1. 使用HTTPS保护API通信
2. 配置适当的CORS策略
3. 使用环境变量管理敏感信息
4. 定期更新依赖包

### 性能优化

1. 配置API缓存
2. 使用CDN加速静态资源
3. 启用Gzip压缩
4. 配置适当的连接池大小

### 监控和日志

1. 配置应用日志
2. 设置性能监控
3. 配置错误报警
4. 定期备份数据

## 故障排除

### 后端无法启动

1. 检查Python版本是否满足要求
2. 确认所有依赖已正确安装
3. 检查环境变量配置
4. 查看日志输出寻找错误信息

### 前端无法连接后端

1. 确认后端服务已启动
2. 检查API_URL配置是否正确
3. 确认CORS配置允许前端域名
4. 检查网络连接和防火墙设置

### 区块链数据获取失败

1. 确认BSC节点URL可访问
2. 检查网络连接状态
3. 尝试使用不同的BSC节点
4. 查看后端日志获取详细错误信息