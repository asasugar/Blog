# QQ 邮箱 + Cloudflare 邮件路由配置指南

通过 Cloudflare Email Routing 将自定义域名邮件转发到 QQ 邮箱，再由 QQ 邮箱 IMAP 接收验证码。

::: tip 整体流程
注册邮件 → 自定义域名（Cloudflare 转发）→ QQ 邮箱收件 → IMAP 读取验证码
:::

---

## 前置条件

- 已有一个域名（在阿里云购买）
- 已有 Cloudflare 账号（免费）
- 已有 QQ 邮箱账号

---

## 第零步：将阿里云域名托管到 Cloudflare

域名在阿里云购买后，默认使用阿里云 DNS。需要将 DNS 切换到 Cloudflare 才能使用 Email Routing。

### 0.1 在 Cloudflare 添加域名

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击右上角 **添加站点**
3. 输入你的域名（如 `yourdomain.com`），点击**继续**
4. 选择免费计划，点击**继续**
5. Cloudflare 会自动扫描现有 DNS 记录，确认后点击**继续**
6. 页面会显示两个 Cloudflare NS 地址，例如：

   ```
   ali.ns.cloudflare.com
   bob.ns.cloudflare.com
   ```

   **复制这两个地址，下一步要用。**

### 0.2 在阿里云修改 DNS 服务器

1. 登录 [阿里云域名控制台](https://dc.console.aliyun.com/next/index#/domain/list/all-domain)
2. 找到你的域名，点击**管理**
3. 左侧菜单点击 **DNS 管理** → **DNS 修改**
4. 点击**修改 DNS 服务器**
5. 将默认的阿里云 NS（`dns1.hichina.com` 等）**全部删除**
6. 添加 Cloudflare 的两个 NS 地址：

   ```
   ali.ns.cloudflare.com
   bob.ns.cloudflare.com
   ```

   （填写你在 0.1 步骤中复制的实际地址）

7. 确认保存

::: warning DNS 生效时间
DNS 修改全球生效通常需要 **5 分钟 ~ 48 小时**，一般 30 分钟内完成。可在 Cloudflare 控制台查看域名状态，变为「活跃」后即可继续操作。
:::

### 0.3 确认托管成功

回到 Cloudflare Dashboard，域名状态显示 **活跃（Active）** 即表示托管成功。

---

---

## 第一步：开启 QQ 邮箱 IMAP 服务

1. 登录 [QQ 邮箱](https://mail.qq.com)
2. 点击顶部 **设置** → **账户**
3. 找到「POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务」
4. 开启 **IMAP/SMTP 服务**
5. 按提示发送短信验证，完成后会生成一个**授权码**

::: warning 注意
授权码不是 QQ 密码，是专门用于第三方客户端登录的独立密码，请妥善保存。
:::

IMAP 连接信息：

| 参数 | 值 |
|------|-----|
| IMAP 主机 | `imap.qq.com` |
| IMAP 端口 | `993` |
| 加密方式 | SSL |
| 用户名 | 完整 QQ 邮箱地址，如 `123456@qq.com` |
| 密码 | 上面生成的**授权码** |

---

## 第二步：Cloudflare 配置邮件路由

### 2.1 开启 Email Routing

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择你的域名
3. 左侧菜单点击 **电子邮件** → **Email Routing**
4. 点击**开始使用**，Cloudflare 会自动添加所需 MX 记录

### 2.2 添加转发规则

1. 进入 **Email Routing** → **路由规则**
2. 点击**创建地址**（或「添加规则」）
3. 配置规则：

   | 设置项 | 填写内容 |
   |--------|---------|
   | 类型 | 捕获所有（Catch-all） |
   | 操作 | 发送到电子邮件 |
   | 目标地址 | 你的 QQ 邮箱，如 `123456@qq.com` |

   ::: tip 使用 Catch-all
   选择「捕获所有」可以接收该域名下**任意**邮箱地址的邮件，这样注册时可以随机生成邮箱前缀（如 `nb12345@yourdomain.com`），所有邮件都会转发到 QQ 邮箱。
   :::

4. 保存规则

### 2.3 验证目标邮箱

首次添加 QQ 邮箱作为目标地址时，Cloudflare 会发送一封验证邮件到 QQ 邮箱，点击邮件中的验证链接即可激活。

---

## 第三步：验证 DNS 记录

Email Routing 开启后，Cloudflare 会自动添加 MX 记录，在 **DNS** 页面确认以下记录已存在：

| 类型 | 名称 | 内容 |
|------|------|------|
| MX | `@` | `route1.mx.cloudflare.net` |
| MX | `@` | `route2.mx.cloudflare.net` |
| MX | `@` | `route3.mx.cloudflare.net` |
| TXT | `@` | `v=spf1 include:_spf.mx.cloudflare.net ~all` |

::: warning 如果之前有其他 MX 记录
需要删除旧的 MX 记录，避免邮件路由冲突。
:::

---

## 第四步：填入系统配置

打开项目前端 → 系统配置 → **邮箱设置**：

| 配置项 | 填写内容 |
|--------|---------|
| 邮箱域名 | 你的域名，如 `yourdomain.com` |
| IMAP 主机 | `imap.qq.com` |
| IMAP 端口 | `993` |
| IMAP 用户名 | `123456@qq.com` |
| IMAP 密码 | QQ 邮箱授权码 |
| 邮箱前缀 | 自定义前缀，如 `nb`（生成邮箱格式：`nb12345@yourdomain.com`） |

保存后即可开始注册任务。

---

## 验证是否生效

手动发送一封邮件到 `test@yourdomain.com`，检查 QQ 邮箱是否收到。

收到后启动注册任务，日志中出现以下内容说明配置成功：

```
[OpenAI] 注册邮箱: nb28664@yourdomain.com
[OpenAI] Step 5: 等待邮箱验证码...
等待验证码... (目标: nb28664@yourdomain.com)
验证码: 823804 (邮件时间: ...)
[OpenAI] 获取到验证码: 823804
```

---

## 常见问题

**Q：IMAP 连接失败，提示密码错误？**

填写的是 QQ 邮箱**授权码**，不是 QQ 登录密码。重新到邮箱设置生成一个新授权码。

**Q：收到邮件但日志显示「收件人不匹配，跳过」？**

可能是 Cloudflare 转发后邮件头中 `To` 字段变成了转发地址。已在代码中处理了 `Delivered-To`、`X-Original-To` 等头的匹配，升级到最新代码即可。

**Q：Cloudflare Email Routing 有使用限制吗？**

免费计划每月可转发 **100 封**邮件，超出后暂停转发直到下个月重置。如果注册量大，建议升级 Cloudflare 付费计划或使用其他邮件服务。

**Q：注册邮箱能使用通配符吗？**

可以。Catch-all 规则会匹配该域名下所有地址，配合随机前缀生成（如 `nb` + 5位随机数），每次注册使用全新邮箱地址。
