# Nanobot openai_codex 如何支持自定义 Responses

## 背景

Nanobot 的 **openai_codex** 使用 OpenAI 的 [Responses API](https://platform.openai.com/docs/api-reference/responses)，支持 OAuth 与自定义端点两种模式。配置里需指定 `provider` 与 `model`（如 `openai-codex/gpt-5.1-codex`）。本文说明如何通过传递 `api_key` / `api_base` 使用自定义 Responses 端点，参考 [PR #1550](https://github.com/HKUDS/nanobot/pull/1550)。

## 行为说明

- **OAuth 模式**：不配置 `api_key`，使用默认 Codex 端点，通过 `nanobot provider login openai-codex` 登录。
- **自定义 Responses 模式**：在 `providers.openaiCodex` 下配置 `apiKey` 和/或 `apiBase`，直接请求自建或第三方 Responses 端点。

## 修改步骤（参考 PR #1550）

### 1. 支持传递 api_key / api_base（OAuth 与自定义 Responses 双模式）

参考 [PR #1550 commit 7b531bd](https://github.com/HKUDS/nanobot/pull/1550/changes/7b531bd8883b67126e72881f411f300332f3c67b#diff-39b2eb0f7fc50c39153fb55c8cd261769ecbb4f233ca8e8f9f5ea57dbcf70a57)：

**1.1 `nanobot/cli/commands.py`（路径示例：`/root/nanobot/nanobot/cli/commands.py`）**

在 `_make_provider` 里创建 openai_codex 时，从 config 读出 `api_key`、`api_base` 并传入，而不是只传 `default_model`：

原逻辑：

```python
# OpenAI Codex (OAuth)
if provider_name == "openai_codex" or model.startswith("openai-codex/"):
    return OpenAICodexProvider(default_model=model)
```

改为：

```python
# OpenAI Codex (OAuth or direct Responses API via api_key/api_base)
if provider_name == "openai_codex" or model.startswith("openai-codex/"):
    return OpenAICodexProvider(
        default_model=model,
        api_key=p.api_key if p else None,
        api_base=p.api_base if p else None,
    )
```

**1.2 `nanobot/providers/openai_codex_provider.py`（路径示例：`/root/nanobot/nanobot/providers/openai_codex_provider.py`）**


配置里在 `providers.openaiCodex` 下设置 `api_key` 和/或 `api_base` 后，即使用自定义 Responses 端点；不配置则仍为 OAuth 模式。

- **`__init__`**：增加参数 `api_key`、`api_base`，并传给 `super().__init__`，同时保留 `self.default_model`。

原逻辑：

```python
"""Use Codex OAuth to call the Responses API."""
def __init__(self, default_model: str = "openai-codex/gpt-5.1-codex"):
        super().__init__(api_key=None, api_base=None)
```

改为：

```python
"""Use Codex OAuth or custom Responses API to call the Responses endpoint."""

    def __init__(
        self,
        default_model: str = "openai-codex/gpt-5.1-codex",
        api_key: str | None = None,
        api_base: str | None = None,
    ):
        super().__init__(api_key=api_key, api_base=api_base)
```

- **`chat`**：若配置了 `api_key` 或 `api_base`（`use_custom_responses = bool(self.api_base or self.api_key)`），则走自定义 Responses：用 `_build_custom_headers(self.api_key)` 构造请求头、`_build_responses_url(self.api_base)` 得到 URL；否则走 OAuth（`get_codex_token` + `DEFAULT_CODEX_URL`）。
- **新增**：
  - `_build_custom_headers(api_key)`：设置 `Authorization: Bearer {api_key}`（若存在）及常用 headers。
  - `_build_responses_url(api_base)`：若 `api_base` 为空则返回 `DEFAULT_RESPONSES_URL`（如 `https://api.openai.com/v1/responses`）；否则按 `.../responses`、`.../v1`、`...` 等形式拼出 `/v1/responses` 或 `/responses` 的完整 URL。

原逻辑：

```python
token = await asyncio.to_thread(get_codex_token)
headers = _build_headers(token.account_id, token.access)
```

改为：

```python
# url = DEFAULT_CODEX_URL 注释写死的 url
use_custom_responses = bool(self.api_base or self.api_key)
if use_custom_responses:
    headers = _build_custom_headers(self.api_key)
    url = _build_responses_url(self.api_base)
else:
    token = await asyncio.to_thread(get_codex_token)
    headers = _build_headers(token.account_id, token.access)
    url = DEFAULT_CODEX_URL
```

新增函数

```python
def _build_custom_headers(api_key: str | None) -> dict[str, str]:
    headers = {
        "accept": "text/event-stream",
        "content-type": "application/json",
        "User-Agent": "nanobot (python)",
    }
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    return headers


def _build_responses_url(api_base: str | None) -> str:
    base = (api_base or "").strip()
    if not base:
        return DEFAULT_RESPONSES_URL

    base = base.rstrip("/")
    if base.endswith("/responses"):
        return base
    if base.endswith("/v1"):
        return f"{base}/responses"
    return f"{base}/v1/responses"
```


## 配置示例

OAuth 模式（不配 api_key/api_base）：

```json
{
  "agents": {
    "defaults": {
      "provider": "auto",
      "model": "openai-codex/gpt-5.1-codex"
    }
  }
}
```

使用自定义 Responses 端点时，在 `providers.openaiCodex` 下配置 `api_key`、`api_base`：

```json
{
  "agents": {
    "defaults": {
      "provider": "auto",
      "model": "openai-codex/gpt-5.1-codex"
    }
  },
  "providers": {
    "openaiCodex": {
      "api_key": "your-api-key",
      "api_base": "https://your-endpoint.com/v1"
    }
  }
}
```

## 小结

- **自定义 Responses**：nanobot 的 openaiCodex 使用 Responses API；通过传递 `api_key` / `api_base` 可同时支持 OAuth 与自定义 Responses 双模式。
- **实现要点**：① `nanobot/cli/commands.py`：`_make_provider` 中把 `config.get_provider(model)` 的 `api_key`、`api_base` 传入 `OpenAICodexProvider`。② `nanobot/providers/openai_codex_provider.py`：`__init__` 接收 `api_key`/`api_base`，`chat` 中根据是否配置二者选择 OAuth 或自定义 URL/headers，并实现 `_build_custom_headers`、`_build_responses_url`。
- **参考**：[PR #1550 - feat(codex): 在 openaiCodex 中同时支持 OAuth 与自定义 Responses 模式](https://github.com/HKUDS/nanobot/pull/1550)，[commands + provider 修改 diff](https://github.com/HKUDS/nanobot/pull/1550/changes/7b531bd8883b67126e72881f411f300332f3c67b#diff-39b2eb0f7fc50c39153fb55c8cd261769ecbb4f233ca8e8f9f5ea57dbcf70a57)。
