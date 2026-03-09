# AWS IP 轮换配置指南

通过 AWS API Gateway 实现每次注册使用不同 IP，有效规避同 IP 注册限制。

::: tip 原理
在 AWS 多个区域创建 API Gateway 作为请求跳板，每个区域出口 IP 不同。注册时自动随机选取一个 Gateway 发出请求，实现 IP 轮换。
:::

::: info 费用
AWS 免费层每月提供 **100 万次** API Gateway 请求，正常使用完全免费。后端关闭时自动清理所有 Gateway，不会产生额外费用。
:::

---

## 前置条件

- 已注册 [AWS 账号](https://aws.amazon.com)
- 信用卡已验证（免费套餐不会扣费）

---

## 第一步：创建 IAM 用户

::: warning 为什么不用根账号？
根账号密钥一旦泄露，整个 AWS 账号都会沦陷。建议创建权限最小化的 IAM 用户。
:::

1. 登录 [AWS IAM 控制台](https://console.aws.amazon.com/iam)
2. 左侧菜单点击 **用户** → **创建用户**
3. 填写用户名，例如 `ai-pool-rotator`
4. **不需要**勾选「提供 AWS 管理控制台访问权限」
5. 点击**下一步**

---

## 第二步：附加权限策略

1. 权限选项选择 **直接附加策略**
2. 搜索框输入：

   ```
   AmazonAPIGatewayAdministrator
   ```

3. 勾选该策略
4. 点击**下一步** → **创建用户**

---

## 第三步：生成访问密钥

1. 点击进入刚创建的用户详情页
2. 切换到 **安全凭证** 标签页
3. 滚动到「访问密钥」区域，点击 **创建访问密钥**
4. 使用场景选择：**在 AWS 以外运行的应用程序**
5. 点击下一步（描述标签可选填）
6. 点击 **创建访问密钥**

::: danger 重要提示
Secret Access Key **只显示一次**，请立即复制保存。如果忘记，只能重新创建密钥。
:::

页面会显示：

| 字段 | 示例 |
|------|------|
| 访问密钥 ID | `AKIAIOSFODNN7EXAMPLE` |
| 秘密访问密钥 | `wJalrXUtnFEMI/K7MDENG/...` |

---

## 第四步：填入系统配置

1. 打开项目前端，点击左下角 **系统配置**
2. 找到 **AWS IP 轮换** 分组
3. 填入刚才的密钥：

   | 配置项 | 填入内容 |
   |--------|---------|
   | Access Key ID | 访问密钥 ID |
   | Secret Key | 秘密访问密钥 |

4. 点击**保存更改**

---

## 验证是否生效

重启后端服务，触发一次注册任务，日志中出现以下内容说明配置成功：

```
[AwsGateway] 正在 8 个区域创建 API Gateway...
[AwsGateway] 创建成功: us-east-1 → https://xxx.execute-api.us-east-1.amazonaws.com/proxy
[AwsGateway] 创建成功: us-west-2 → https://xxx.execute-api.us-west-2.amazonaws.com/proxy
[AwsGateway] 共 8 个 Gateway 就绪
[OpenAI] 使用 AWS Gateway: https://xxx.execute-api.eu-west-1.amazonaws.com/proxy
```

::: tip 首次启动较慢
第一次运行注册任务时会在 AWS 创建 Gateway，耗时约 **10-20 秒**，之后复用不再重建。
:::

---

## python 代码示例

```python
"""
AWS API Gateway IP 轮换器
原理：在 AWS 多个 Region 创建 API Gateway，每个 Gateway 出口 IP 不同，
      httpx 请求随机选 Gateway endpoint 发出，实现每次请求 IP 不同。

使用：
    async with AwsGateway(target="https://auth.openai.com", ...) as gw:
        client = gw.build_client()
        resp = await client.get("/api/...")
"""
import asyncio
import random
from typing import Optional
from contextlib import asynccontextmanager

import boto3
import httpx

from .log_manager import log_manager as log

DEFAULT_REGIONS = [
    "us-east-1", "us-east-2", "us-west-1", "us-west-2",
    "eu-west-1", "eu-west-2", "ap-southeast-1", "ap-northeast-1",
]


class AwsGateway:
    """
    在 AWS 多区域创建 API Gateway REST API，让 httpx 通过随机 Gateway 发请求。
    每个 Gateway 出口 IP 不同，达到 IP 轮换效果。
    """

    def __init__(
        self,
        target: str,
        regions: Optional[list[str]] = None,
        aws_access_key_id: Optional[str] = None,
        aws_secret_access_key: Optional[str] = None,
        api_name: str = "ai-pool-rotator",
    ):
        self.target = target.rstrip("/")
        self.regions = regions or DEFAULT_REGIONS
        self.aws_access_key_id = aws_access_key_id
        self.aws_secret_access_key = aws_secret_access_key
        self.api_name = api_name
        self._endpoints: list[str] = []
        self._created: list[dict] = []

    def _boto_client(self, region: str):
        kwargs = {"region_name": region}
        if self.aws_access_key_id:
            kwargs["aws_access_key_id"] = self.aws_access_key_id
            kwargs["aws_secret_access_key"] = self.aws_secret_access_key
        return boto3.client("apigateway", **kwargs)

    def _create_gateway(self, region: str) -> Optional[str]:
        try:
            client = self._boto_client(region)
            api = client.create_rest_api(
                name=self.api_name,
                endpointConfiguration={"types": ["REGIONAL"]},
            )
            api_id = api["id"]

            resources = client.get_resources(restApiId=api_id)
            root_id = next(r["id"] for r in resources["items"] if r["path"] == "/")

            proxy = client.create_resource(
                restApiId=api_id,
                parentId=root_id,
                pathPart="{proxy+}",
            )
            proxy_id = proxy["id"]

            client.put_method(
                restApiId=api_id,
                resourceId=proxy_id,
                httpMethod="ANY",
                authorizationType="NONE",
                requestParameters={"method.request.path.proxy": True},
            )

            client.put_integration(
                restApiId=api_id,
                resourceId=proxy_id,
                httpMethod="ANY",
                type="HTTP_PROXY",
                integrationHttpMethod="ANY",
                uri=f"{self.target}/{{proxy}}",
                requestParameters={"integration.request.path.proxy": "method.request.path.proxy"},
            )

            client.create_deployment(restApiId=api_id, stageName="proxy")

            endpoint = f"https://{api_id}.execute-api.{region}.amazonaws.com/proxy"
            self._created.append({"api_id": api_id, "region": region})
            log.success(f"[AwsGateway] 创建成功: {region} → {endpoint}")
            return endpoint
        except Exception as e:
            log.error(f"[AwsGateway] 创建失败 [{region}]: {e}")
            return None

    def _delete_gateway(self, api_id: str, region: str):
        try:
            client = self._boto_client(region)
            client.delete_rest_api(restApiId=api_id)
            log.info(f"[AwsGateway] 已删除: {api_id} [{region}]")
        except Exception as e:
            log.error(f"[AwsGateway] 删除失败 [{region}] {api_id}: {e}")

    async def start(self):
        log.info(f"[AwsGateway] 正在 {len(self.regions)} 个区域创建 API Gateway...")
        loop = asyncio.get_event_loop()
        tasks = [
            loop.run_in_executor(None, self._create_gateway, r)
            for r in self.regions
        ]
        results = await asyncio.gather(*tasks)
        self._endpoints = [ep for ep in results if ep]
        if not self._endpoints:
            raise RuntimeError("AwsGateway: 所有区域创建失败，请检查 AWS 凭证和权限")
        log.success(f"[AwsGateway] 共 {len(self._endpoints)} 个 Gateway 就绪")

    async def shutdown(self):
        log.info(f"[AwsGateway] 清理 {len(self._created)} 个 Gateway...")
        loop = asyncio.get_event_loop()
        tasks = [
            loop.run_in_executor(None, self._delete_gateway, info["api_id"], info["region"])
            for info in self._created
        ]
        await asyncio.gather(*tasks)
        self._endpoints.clear()
        self._created.clear()

    def build_client(self, **kwargs) -> httpx.AsyncClient:
        """
        返回一个 httpx.AsyncClient，所有请求通过随机 Gateway 出去。
        使用方式与普通 client 一致，只是 base_url 变成了随机 Gateway。
        """
        if not self._endpoints:
            raise RuntimeError("AwsGateway 尚未启动，请先调用 start()")
        endpoint = random.choice(self._endpoints)
        return httpx.AsyncClient(base_url=endpoint, follow_redirects=True, **kwargs)

    def get_random_endpoint(self) -> str:
        if not self._endpoints:
            raise RuntimeError("AwsGateway 尚未启动")
        return random.choice(self._endpoints)

    async def __aenter__(self):
        await self.start()
        return self

    async def __aexit__(self, *_):
        await self.shutdown()


_gateway_instance: Optional[AwsGateway] = None


async def get_gateway(cfg: dict) -> Optional[AwsGateway]:
    """获取或创建全局 Gateway 实例"""
    global _gateway_instance
    if not cfg.get("aws_access_key_id") or not cfg.get("aws_secret_access_key"):
        return None
    if _gateway_instance and _gateway_instance._endpoints:
        return _gateway_instance
    regions = cfg.get("aws_regions") or DEFAULT_REGIONS[:4]
    _gateway_instance = AwsGateway(
        target="https://auth.openai.com",
        regions=regions,
        aws_access_key_id=cfg["aws_access_key_id"],
        aws_secret_access_key=cfg["aws_secret_access_key"],
    )
    await _gateway_instance.start()
    return _gateway_instance


async def shutdown_gateway():
    global _gateway_instance
    if _gateway_instance:
        await _gateway_instance.shutdown()
        _gateway_instance = None

```
---


## 优先级说明

IP 来源按以下优先级使用：

```
代理池（proxy_pool）> 单代理（proxy）> AWS Gateway > 直连
```

配置了代理池时优先走代理，没有代理时才使用 AWS Gateway。

---

## 常见问题

**Q：创建 Gateway 失败怎么办？**

检查 IAM 用户是否附加了 `AmazonAPIGatewayAdministrator` 策略，密钥是否填写正确。

**Q：后端关闭后 Gateway 还在吗？**

不在。后端正常关闭时会自动调用 `shutdown_gateway()` 清理所有创建的 Gateway。如果意外崩溃，可以到 AWS Console → API Gateway 手动删除名为 `ai-pool-rotator` 的 API。

**Q：免费额度用完怎么办？**

超出免费额度后每 100 万次请求约 $3.5，正常注册用量极低，基本不会超出。
