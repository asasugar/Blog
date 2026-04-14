# Ollama Linux 服务器本地部署

参考文档：[Ollama Linux 安装](https://docs.ollama.com/linux#install)

## 1. 安装

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

安装后检查：

```bash
which ollama
ollama -v
```

## 2. 创建 systemd 服务

先确认实际安装路径：

```bash
which ollama
```

如果输出是 `/usr/local/bin/ollama`，执行：

```bash
sudo tee /etc/systemd/system/ollama.service > /dev/null <<'EOF'
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=root
Group=root
Restart=always
RestartSec=3
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

[Install]
WantedBy=multi-user.target
EOF
```

如果 `which ollama` 输出的不是 `/usr/local/bin/ollama`，把 `ExecStart` 改成真实路径。

## 3. 启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable ollama
sudo systemctl restart ollama
sudo systemctl status ollama --no-pager
```

重点检查：

- `ollama` 服务是否正常启动
- `11434` 端口是否已监听
- 云服务器安全组是否已放行 `11434`

如果是云服务器，还需要在控制台安全组放行：

- 协议：`TCP`
- 端口：`11434`
- 来源：按需配置

如果安全组里已经有 `全部IPv4地址 + ALL协议 + ALL端口 + 允许`，说明云侧端口已放开。

## 4. 测试验证

检查服务状态：

```bash
sudo systemctl status ollama --no-pager
```

检查监听端口：

```bash
ss -lntp | grep 11434
```

正常情况下应看到 `0.0.0.0:11434` 或 `:::11434`。

本机接口测试：

```bash
curl http://127.0.0.1:11434/api/tags
```

远程接口测试：

```bash
curl http://服务器公网IP:11434/api/tags
```

查看日志：

```bash
journalctl -u ollama -n 100 --no-pager
```

## 5. 模型拉取与运行

拉取并运行模型：

```bash
ollama run qwen2.5:0.5b
```

查看本地模型：

```bash
ollama list
```

如果模型名写错，例如：

```bash
ollama run qwen:0.5d
```

会报错：

```bash
Error: pull model manifest: file does not exist
```

原因是模型 tag 不存在，改成正确 tag 即可，如 `qwen2.5:0.5b`。

## 6. 云模型配置

如果不想在服务器本地拉模型，也可以直接接云模型。无需强大GPU即可运行，同时提供与本地模型相同的功能，使您能够在运行无法在个人电脑上运行的大型模型时继续使用本地工具。

[model library](https://ollama.com/search?c=cloud)

### 6.1 登录或创建 ollama 账户：

```bash
ollama signin
```

创建 `API Key` 授权之后,拉取对应云模型，执行：

```bash
ollama run gpt-oss:120b-cloud
```

### 6.2 设置环境变量

```bash
export OLLAMA_API_KEY="你的云模型Key"
```

### 6.3 联通性测试

```bash
curl https://ollama.com/api/tags
```

### 6.4 本地模型与云模型怎么选

- 本地模型：数据不出机器，可离线，适合内网和调试环境，对设备要求高
- 云模型：免部署显卡和大模型文件，接入快，适合快速验证和线上能力调用，对设备要求低

### 6.5 常见问题

`401 Unauthorized`

- `API Key` 错误
- 请求头没带 `Authorization`

`404 Not Found`

- `Base URL` 写错
- 路径不是 `/v1/chat/completions` 或平台兼容路径不同
- `Model` 名称不存在

`403 Forbidden`

- 账号无权限
- 模型未开通

`timeout`

- 服务器出网受限
- 域名解析异常
- 云厂商接口不通

## 7. 是否需要重启

执行 `ollama run` 或 `ollama pull` 后，不需要重启服务器，也不需要重启 `ollama` 服务。

只有在以下场景才需要重启服务：

- 修改了 `/etc/systemd/system/ollama.service`
- 修改了 `OLLAMA_HOST`
- 升级了 `ollama`
- 服务异常卡住

重启命令：

```bash
sudo systemctl restart ollama
```

## 8. 常见问题

### 8.1 `could not connect to a running Ollama instance`

说明客户端已安装，但服务未启动。

处理：

```bash
sudo systemctl restart ollama
sudo systemctl status ollama --no-pager
```

### 8.2 `status=217/USER`

说明服务文件里的 `User` 或 `Group` 配置无效。

本次处理方式：直接使用 `root` 运行。

### 8.3 `status=203/EXEC`

说明 `ExecStart` 指向的二进制路径不存在。

处理：

```bash
which ollama
```

然后把 `ExecStart` 改成实际路径。

### 8.4 本机可访问，外网不可访问

按顺序检查：

1. `systemctl status ollama`
2. `ss -lntp | grep 11434`
3. `OLLAMA_HOST` 是否为 `0.0.0.0:11434`
4. 云安全组是否放行 `11434`

### 8.5 卸载旧版本

```bash
sudo systemctl stop ollama 2>/dev/null || true
sudo systemctl disable ollama 2>/dev/null || true
sudo rm -f /etc/systemd/system/ollama.service
sudo rm -rf /etc/systemd/system/ollama.service.d
sudo systemctl daemon-reload
sudo systemctl reset-failed

sudo rm -f /usr/local/bin/ollama
sudo rm -f /usr/bin/ollama
sudo rm -rf /usr/local/lib/ollama
sudo rm -rf /usr/lib/ollama
sudo rm -rf /lib/ollama
sudo rm -rf /usr/share/ollama
sudo rm -rf /root/.ollama
rm -rf ~/.ollama

sudo userdel ollama 2>/dev/null || true
sudo groupdel ollama 2>/dev/null || true
```

## 9. 最小可用流程

```bash
curl -fsSL https://ollama.com/install.sh | sh
which ollama

sudo tee /etc/systemd/system/ollama.service > /dev/null <<'EOF'
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=root
Group=root
Restart=always
RestartSec=3
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable ollama
sudo systemctl restart ollama

ss -lntp | grep 11434
curl http://127.0.0.1:11434/api/tags
ollama run qwen2.5:0.5b
```