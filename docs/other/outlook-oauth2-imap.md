# Outlook OAuth2 IMAP 配置指南

微软已对所有 Outlook.com 个人账号**全面禁用 IMAP 基础认证（Basic Auth）**，必须使用 OAuth2（XOAUTH2）方式接收邮件。本文档覆盖从注册 Azure 应用到系统联调的完整流程。

---

## 第一步：用个人 Outlook 账号登录 Azure 门户

::: warning 重要
必须用**个人 Outlook 账号**（如 `handsome@outlook.com`）登录 Azure，用工作/学校账号注册的应用无法访问个人邮箱。
:::

1. 打开 [https://portal.azure.com](https://portal.azure.com)
2. 退出当前账号（如有），用你的 **个人 Outlook 账号** 重新登录
3. 首次登录会提示创建 Azure 订阅，按提示完成，需要提前准备一张 Visa 卡（免费层即可）

---

## 第二步：注册 Azure 应用

1. 左上角搜索栏输入 **"应用注册"** 或者 **"Application Registrations"**→ 点击进入
2. 点击 **"+ 新注册"**
3. 填写信息：
   - **名称**：随意（如 `OutlookIMAPApp`）
   - **受支持的账户类型**：选 **「仅限个人账户（Microsoft 个人账户，如 Skype、Xbox）」**
4. 点击 **"注册"**
5. 注册完成后，复制页面上的 **"应用程序(客户端) ID"**，并复制到 `.env` 文件中：
   ```
   OUTLOOK_CLIENT_ID=你复制的ID
   ```

---

## 第三步：开启公共客户端流

Device Code Flow 需要开启此选项，否则会报 `AADSTS70002` 错误。

1. 进入刚注册的应用 → 左侧菜单点 **"身份验证（Authentication）"**
2. 滚动到页面最底部，找到 **"允许公共客户端流（Allow public client flows）"**
3. 开关改为 **"是（Yes）"**
4. 点击 **"保存"**

---

## 第四步：为目标邮箱开启 IMAP

1. 用目标邮箱账号（如 `handsome@outlook.com`）登录 [https://outlook.live.com](https://outlook.live.com)
2. 点击右上角 **齿轮图标** → **"查看所有 Outlook 设置"**
3. 导航至：**邮件 → 同步电子邮件 → POP 和 IMAP**
4. 开启 **"让设备和应用使用 IMAP"**
5. 点击 **"保存"**

::: tip
若账号未开启两步验证，建议在 [account.microsoft.com/security](https://account.microsoft.com/security) 开启，之后 OAuth2 流程更稳定。
:::

---

## 第五步：生成 Refresh Token

更新 `.env` 文件，填写目标邮箱：

```env
OUTLOOK_CLIENT_ID=你的ClientID
OUTLOOK_USER=handsome@outlook.com
OUTLOOK_REFRESH_TOKEN=
```

setup_outlook_oauth.py

```python
"""
一次性运行脚本：完成 Outlook OAuth2 授权，获取 refresh_token 并写入 .env

使用方式：
  python setup_outlook_oauth.py

前置条件：
  1. 在 https://portal.azure.com 注册应用（见下方说明）
  2. 在 .env 中填写 OUTLOOK_CLIENT_ID
"""
import os
import sys

from dotenv import load_dotenv, set_key

ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(ENV_PATH)

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "app"))
from outlook_oauth import device_code_flow, imap_login_oauth2

client_id = os.environ.get("OUTLOOK_CLIENT_ID", "").strip()
if not client_id:
    print("请先在 .env 中设置 OUTLOOK_CLIENT_ID")
    print("注册应用步骤：")
    print("  1. 访问 https://portal.azure.com → Azure Active Directory → 应用注册 → 新注册")
    print("  2. 名称随意，受支持账户类型选「个人 Microsoft 账户」")
    print("  3. 重定向 URI 选「公共客户端/本机」→ 填 https://login.microsoftonline.com/common/oauth2/nativeclient")
    print("  4. 注册后复制「应用程序(客户端) ID」填入 .env: OUTLOOK_CLIENT_ID=xxx")
    print("  5. API 权限 → 添加权限 → APIs my organization uses → 搜索 Office 365 Exchange Online")
    print("     → 委托的权限 → IMAP.AccessAsUser.All → 添加")
    sys.exit(1)

user = os.environ.get("OUTLOOK_USER", "").strip()
if not user:
    user = input("请输入 Outlook 邮箱地址: ").strip()

print(f"\n正在为 {user} 发起 OAuth2 授权...")
result = device_code_flow(client_id)
refresh_token = result["refresh_token"]

set_key(ENV_PATH, "OUTLOOK_REFRESH_TOKEN", refresh_token)
print(f"\nrefresh_token 已写入 .env")

print("\n验证 IMAP 连接...")
try:
    m = imap_login_oauth2(user, client_id, refresh_token)
    m.select("INBOX")
    print("IMAP 连接成功!")
    m.logout()
except Exception as e:
    print(f"IMAP 连接失败: {e}")

```

运行授权脚本（一次性操作）：

```bash
cd packages/backend
python setup_outlook_oauth.py
```

脚本会输出类似以下内容：

```
==================================================
To sign in, use a web browser to open the page https://microsoft.com/devicelogin
and enter the code XXXXXXXX to authenticate.
==================================================
```

操作步骤：
1. 浏览器访问 [https://microsoft.com/devicelogin](https://microsoft.com/devicelogin)
2. 输入终端显示的 8 位验证码
3. 用 `handsome@outlook.com` 登录并同意授权
4. 脚本自动将 `OUTLOOK_REFRESH_TOKEN` 写入 `.env`

---

## 第六步：系统配置

在系统设置 → 邮箱设置 → 选择 **Outlook** 预设，填写：

| 字段 | 值 |
|------|-----|
| 邮箱域名 | `outlook.com` |
| IMAP 主机 | `outlook.office365.com` |
| IMAP 端口 | `993` |
| IMAP 用户名 | `handsome@outlook.com` |
| IMAP 密码 | **留空** |

::: info
密码无需填写，系统自动通过 `.env` 中的 `OUTLOOK_CLIENT_ID` 和 `OUTLOOK_REFRESH_TOKEN` 进行 OAuth2 认证。
:::

---

## 第七步：验证连接

```bash
cd packages/backend
python3 -c "
from dotenv import load_dotenv
import os, sys
load_dotenv('../../.env')
sys.path.insert(0, 'app')
from outlook_oauth import imap_login_oauth2

m = imap_login_oauth2(
    os.environ['OUTLOOK_USER'],
    os.environ['OUTLOOK_CLIENT_ID'],
    os.environ['OUTLOOK_REFRESH_TOKEN']
)
m.select('INBOX')
_, data = m.search(None, 'ALL')
print(f'连接成功！收件箱共 {len(data[0].split())} 封邮件')
m.logout()
"
```

---

## 邮箱地址格式

Outlook 支持 **Plus Addressing（+号别名）**，注册账号时生成的邮箱格式为：

```
handsome+nb12345@outlook.com
```

所有发到 `handsome+xxx@outlook.com` 的邮件均投递到 `handsome@outlook.com` 收件箱，系统自动匹配对应验证码。

---

## 常见问题

### AADSTS700016：应用未在目录中找到

**原因**：应用是用工作/学校账号注册的，无法访问个人账号的 Microsoft Accounts 目录。

**解决**：退出 Azure，改用个人 Outlook 账号重新登录并注册应用。

---

### AADSTS70002：客户端未标记为 mobile

**原因**：未开启「允许公共客户端流」。

**解决**：参考[第三步](#第三步-开启公共客户端流)。

---

### User is authenticated but not connected

**原因**：目标邮箱未开启 IMAP。

**解决**：参考[第四步](#第四步-为目标邮箱开启-imap)。

---

### AUTHENTICATE failed

**原因**：Refresh Token 已过期或被撤销。

**解决**：重新运行 `python setup_outlook_oauth.py` 获取新 Token。
