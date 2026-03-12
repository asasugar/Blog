# 服务器搭建 VPN + Clash Verge Rev 配置教程

## 前置条件

- 一台境外 VPS（推荐：腾讯云境外服务器、搬瓦工、Vultr、DigitalOcean 等）
- 本地电脑安装 [Clash Verge Rev](https://github.com/clash-verge-rev/clash-verge-rev)

## 一、服务端搭建

### 1. 安装 v2ray-agent

SSH 登录 VPS 后执行：

```bash
wget -P /root -N --no-check-certificate "https://raw.githubusercontent.com/mack-a/v2ray-agent/master/install.sh" && chmod 700 /root/install.sh && /root/install.sh
```

### 2. 安装流程

执行后进入交互式菜单，按以下步骤操作：

1. 选择 `1. 安装` → `3. 一键无域名Reality` 或根据需求选择其他协议
2. 核心安装选择 `1. Xray-core`，回车随机 `UUID` 、 `用户名` 和 `端口`
3. 安装完成后，脚本会输出节点配置信息，**保存好这些信息**

### 3. 常用管理命令

安装完成后，随时可以重新执行脚本进入管理菜单：

```bash
vasma
```

菜单中可以：

- 查看已安装节点的配置/链接
- 添加、删除、修改用户
- 更换协议或端口
- 查看订阅链接

### 4. 推荐协议选择

| 协议 | 特点 |
|------|------|
| VLESS + Vision + Reality | 最新协议，抗封锁能力强，推荐首选 |
| VLESS + WS + TLS | 兼容性好，支持 CDN 中转 |
| VMess + WS + TLS | 经典方案，兼容性广 |
| Trojan + TLS | 伪装性强 |

## 二、Clash Verge Rev 客户端配置

### 1. 下载安装

前往 [Release 页面](https://github.com/clash-verge-rev/clash-verge-rev/releases) 下载对应系统的安装包：

- Windows：`.exe` 安装包（x64/x86）
- macOS：`.dmg` 安装包（Intel/Apple Silicon）
- Linux：`.deb` / `.AppImage`

### 2. 通过订阅链接导入

v2ray-agent 安装完成后会生成 **Clash 订阅链接**，复制该链接：

1. 打开 Clash Verge Rev
2. 左侧菜单选择 `订阅` (Profiles)
3. 在顶部输入框粘贴订阅链接，点击 `Import`
4. 导入成功后，点击该配置文件使其激活（高亮选中）

### 3. 通过配置文件导入

如果没有订阅链接，可以手动创建配置文件。v2ray-agent 会输出节点信息，将其转换为 Clash 配置格式：

```yaml
mixed-port: 7890
allow-lan: false
mode: rule
log-level: info

proxies:
  - name: "我的节点"
    type: vless
    server: your-domain.com
    port: 443
    uuid: your-uuid-here
    network: tcp
    tls: true
    udp: true
    flow: xtls-rprx-vision
    servername: your-domain.com
    reality-opts:
      public-key: your-public-key
      short-id: your-short-id

proxy-groups:
  - name: "代理"
    type: select
    proxies:
      - "我的节点"
      - DIRECT

rules:
  - GEOIP,LAN,DIRECT
  - GEOIP,CN,DIRECT
  - MATCH,代理
```

将内容保存为 `.yaml` 文件，然后在 Clash Verge Rev 中：`订阅` → `Local File` → 选择该文件导入。

### 4. 开启系统代理

1. 左侧菜单选择 `设置` (Settings)
2. 开启 `系统代理` (System Proxy)
3. 如需全局代理，可开启 `TUN 模式`（需管理员权限）

### 5. 验证连接

- 打开浏览器访问 [https://www.google.com](https://www.google.com)
- 或在终端执行：

```bash
curl -x http://127.0.0.1:7890 https://www.google.com
```

## 三、常见问题

### 证书申请失败

- 确认域名已正确解析到 VPS IP
- 确认 80/443 端口未被占用：`lsof -i:80` `lsof -i:443`
- 等待 DNS 解析生效后重试

### 连接不上节点

- 确认 VPS 防火墙已放行对应端口
- 检查 VPS 的 IP 是否被墙：`ping your-vps-ip`
- 尝试更换端口或协议

### Clash Verge Rev TUN 模式无法开启

- Windows：以管理员身份运行
- macOS：安装时授予权限，或在设置中手动安装 Service Mode
- Linux：需要 root 权限运行
