# Docker 与 Docker Compose 通用实战指南（从安装到区别）

适用于大多数后端、前后端分离、微服务或 monorepo 项目。

你将获得：

- Docker 与 Docker Compose 的核心区别
- 本地与服务器安装方式
- 两种典型用法（单容器 / 多容器）
- 自动重启、健康检查、日志排障
- 生产环境常见注意事项

---

## 1. 先说结论：两者区别是什么

`Docker`：

- 用来构建镜像、运行单个容器
- 常见命令：`docker build`、`docker run`
- 适合单服务验证、临时测试

`Docker Compose`：

- 用 YAML 描述一整套服务并编排启动
- 常见命令：`docker compose up -d`
- 适合真实项目（Web + API + DB + Redis 等）

一句话：

- `docker` 是“单兵作战”
- `docker compose` 是“团队协同”

---

## 2. 安装（开发机 vs 服务器）

### 开发机（macOS / Windows）

推荐安装 `Docker Desktop`，它包含：

- Docker Engine
- Docker CLI
- Docker Compose
- 本地运行容器所需的虚拟化能力和 UI

macOS（Homebrew）：

```bash
brew install --cask docker
```

安装后启动 Docker Desktop，再验证：

```bash
docker --version
docker compose version
```

### 服务器（Linux）

通常不装 Docker Desktop，而是安装 Docker Engine + Compose 插件（纯命令行，更轻量）。

安装流程（文字版）：

1. 先更新系统软件索引，并安装基础工具（如 `curl`、证书、GPG）。
2. 添加 Docker 官方软件源（而不是用系统默认旧版本）。
3. 安装 Docker Engine、CLI、Buildx、Compose 插件。
4. 启动 Docker 服务并设置开机自启。
5. 用 `docker --version` 和 `docker compose version` 验证安装是否成功。

Ubuntu / Debian 示例：

- Set up Docker's apt repository.

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
# Debian
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
# Ubuntu
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Debian: Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

# Ubuntu: Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
```

- Install the Docker packages.

```bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

CentOS / RHEL / Rocky / AlmaLinux 示例：

```bash
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
```

安装完成后验证：

```bash
docker --version
docker compose version
```

---

## 3. 用法一：只用 Docker（单容器）

适用场景：

- 快速跑一个数据库
- 临时验证镜像
- 单服务工具化运行

示例：

```bash
docker run -d \
  --name my-nginx \
  -p 8080:80 \
  --restart unless-stopped \
  nginx:1.27-alpine
```

常用查看：

```bash
docker ps
docker logs -f my-nginx
docker stop my-nginx && docker rm my-nginx
```

---

## 4. 用法二：Docker Compose（一键启动整套应用）

适用场景：

- 前端 + 后端 + 数据库
- 本地开发环境标准化
- 线上单机部署

最小示例 `docker-compose.yml`：

```yaml
services:
  api:
    image: my-api:latest
    ports:
      - "1455:1455"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:1455/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 15s

  web:
    image: my-web:latest
    ports:
      - "80:80"
    depends_on:
      api:
        condition: service_healthy
    restart: unless-stopped
```

启动与停止：

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f
docker compose down
```

---

## 5. 服务挂了怎么办

不建议只靠手动重启。默认应开启：

- `restart: unless-stopped`
- `healthcheck`

这两者组合可以实现基础自愈：

- 进程崩溃自动拉起
- 服务不可用时可被识别为 `unhealthy`

---

## 6. 健康检查怎么设计才靠谱

建议优先检查“业务可用性”，而不是仅检查进程存在。

推荐顺序：

1. HTTP 服务：探测 `/health` 或 `/ready`
2. DB 服务：使用官方 ping 命令
3. 有启动慢的服务：设置 `start_period`

通用参数建议：

- `interval: 30s`
- `timeout: 3-10s`
- `retries: 3-5`
- `start_period: 10-30s`

---

## 7. Monorepo 项目怎么做 Docker

无论是 `pnpm workspace`、`turbo` 还是其他 monorepo，通用原则都一样：

1. 构建上下文用仓库根目录
2. 先复制 lockfile 和 workspace 配置，最大化缓存命中
3. 通过 filter 只安装/构建目标包

例如 `pnpm`：

```bash
pnpm --filter <target-package> build
```

---

## 8. 构建加速建议（通用）

1. 开启 BuildKit
2. 使用多阶段构建
3. 把“依赖安装层”与“业务代码层”分离
4. 使用缓存挂载（如 pnpm store / pip cache）
5. 不要把 `node_modules`、日志、构建产物带进构建上下文（`.dockerignore`）

---

## 9. 常见错误与排查命令

### 错误 1：`docker: command not found`

说明 CLI 未安装或未生效，优先检查安装与 PATH。

### 错误 2：`service is unhealthy`

排查顺序：

```bash
docker compose ps
docker compose logs <service>
docker inspect <container> --format '{{json .State.Health}}'
```

重点看：

- 应用是否启动即崩溃
- 健康检查命令在容器内是否可执行
- 探测地址/端口是否正确

---

## 10. 生产环境注意事项

1. 只暴露必要端口（尽量通过反向代理统一入口）
2. 敏感配置用环境变量或密钥系统管理
3. 数据目录、配置目录、日志目录做持久化卷
4. 先验证健康状态再切流量
5. 保留可回滚镜像 tag（避免只用 `latest`）
6. 定期清理无用镜像和悬挂资源

---

## 11. 什么时候该用 Kubernetes

当你出现以下需求时再考虑上 K8s：

- 多机调度
- 自动扩缩容
- 灰度/金丝雀发布
- 更复杂的服务治理

否则，中小项目用 `docker compose` 往往更简单高效。

---