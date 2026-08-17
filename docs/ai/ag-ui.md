# AG-UI：把 Agent 与前端之间的“私有暗号”变成标准协议

> 做 Agent 应用时，难点往往不只是模型调用，而是如何把流式文本、工具执行、页面状态和人工确认稳定地传到前端。AG-UI 解决的正是这一层问题。

## 一、AG-UI 是什么

AG-UI（Agent-User Interaction Protocol）是一套连接 AI Agent 与用户界面的开放、轻量、事件驱动协议。

它不负责模型推理，而是定义：**前端如何发起一次 Agent 运行，以及 Agent 如何持续反馈执行过程。**

- **MCP**：Agent 如何连接工具、资源和提示词
- **A2A**：Agent 如何发现并协作其他 Agent
- **AG-UI**：Agent 如何与用户界面实时交互

AG-UI 当前还提供能力发现和协议握手机制，可作为前端入口连接支持 MCP、A2A 的 Agent。它不会替代 MCP 或 A2A，而是把这些能力统一呈现到 UI。

## 二、为什么不能只定义一个 SSE 接口

SSE 只是传输方式。实际项目仍要自行约定文本增量、工具进度、共享状态、人工确认、取消和异常等格式。

### 接入前

```text
/chat/stream       → 流式回答
/tool/status       → 工具进度
/page/state        → 页面状态
/action/confirm    → 人工确认
/error             → 异常信息
```

### 接入 AG-UI 后

```text
POST /ag-ui
  请求：RunAgentInput
  响应：一条有类型的 AG-UI Event Stream
```

差别不只是少写几个接口，而是文本、工具、状态和生命周期开始使用同一种交互语言。

>AG-UI 简化交互流程
![ag-ui-interaction-flow.svg](https://picobd.yunxuetang.cn/orgsv2/1601046e-d6f9-4d5d-ab12-3b71ee566e4c-tools20240423/kng/images/202608/80a305a48314494a9cd16cf9e9992e6e.svg)

## 三、AG-UI 如何简化交互

### 1. 一个输入携带完整上下文

```text
RunAgentInput
├── threadId / runId     会话与运行标识
├── messages             历史消息
├── tools                前端可执行工具
├── state                当前共享状态
├── context              页面或业务上下文
└── resume               中断恢复信息
```

后端无需再从多个接口拼装消息、工具和页面上下文。

### 2. 一条事件流覆盖完整运行过程

```text
生命周期：RUN_STARTED / RUN_FINISHED / RUN_ERROR
文本消息：TEXT_MESSAGE_START / CONTENT / END
工具调用：TOOL_CALL_START / ARGS / END / TOOL_CALL_RESULT
共享状态：STATE_SNAPSHOT / STATE_DELTA
```

前端只建立一套连接，并按事件语义更新 UI：

```text
TEXT_MESSAGE_CONTENT  → 追加流式文本
TOOL_CALL_*           → 展示工具进度或交互组件
STATE_DELTA           → 更新页面局部状态
RUN_FINISHED          → 结束 loading 或进入中断状态
```

### 3. 工具调用直接变成生成式 UI

Agent 不再只能返回 Markdown。它可以调用前端工具，由页面渲染卡片、图表、按钮或表单。用户操作结果再回到 Agent，形成连续的人机协作。

### 4. 共享状态不再依赖轮询

`STATE_SNAPSHOT` 发送完整状态，`STATE_DELTA` 发送增量变化。适合表单协作、长任务进度、结构化数据编辑和页面恢复。

### 5. 人工确认有标准的暂停与恢复方式

AG-UI 能力模型支持 approvals、interventions、feedback 和 interrupts。敏感操作可先返回 interrupt，用户确认或修改参数后，再通过 `RunAgentInput.resume` 恢复。

### 6. Agent 可以声明自身能力

客户端可读取 Agent capabilities，判断它是否支持传输方式、工具调用、结构化输出、状态同步、多模态和人工确认，再动态启用对应组件。

### 7. MCP 负责连接工具，AG-UI 负责连接用户

```text
用户操作
  → AG-UI 发送上下文
  → Agent 通过 MCP 调用工具
  → AG-UI 返回工具、文本和状态事件
  → 前端实时展示过程与结果
```

新增 MCP Server 后，工具来源虽然变化，但前端仍消费同一套 AG-UI 事件。

## 四、AG-UI 带来的主要收益

- **统一交互模型**：文本、工具、状态、生命周期使用同一套事件
- **减少私有接口**：不必分别设计工具进度、状态同步和确认回调
- **降低前端耦合**：替换模型或 Agent 框架时，UI 协议基本不变
- **提升实时体验**：回答、进度、工具参数和状态都能增量呈现
- **支持生成式 UI**：Agent 可以驱动卡片、图表、按钮和表单
- **支持共享状态**：Agent 与页面围绕同一份状态协作
- **支持人机协同**：审批、中断、修改参数和恢复运行有统一表达
- **支持能力发现**：前端可以根据 Agent capabilities 动态适配
- **兼容 MCP 与 A2A**：工具和其他 Agent 能力可以进入同一用户体验

## 五、一套可迁移的接入结构

目录不必完全一致，关键是找到四个职责：Agent 构建、AG-UI Endpoint、服务端 Runtime 和 UI 渲染。

```text
backend/
├── app/agents/chat_agent.py    # 构建 Agent graph
├── app/api/ag_ui.py            # 挂载 AG-UI Endpoint
└── app/main.py                 # FastAPI 入口

frontend/
├── src/app/api/copilotkit/route.ts  # Runtime 代理
├── src/app/providers.tsx            # Provider
└── src/features/agent/
    ├── agent-chat.tsx                # 聊天 UI
    └── use-agent-tools.tsx           # 前端工具
```

单文件、DDD、插件化或微服务项目同样适用，只需把示例文件映射到自己的扩展点。

>AG-UI 通用接入架构图
![ag-ui-architecture.svg](https://picobd.yunxuetang.cn/orgsv2/1601046e-d6f9-4d5d-ab12-3b71ee566e4c-tools20240423/kng/images/202608/38358a3090a741ae8b189870bdad5aa0.svg)

## 六、Python 侧：把现有 Agent 暴露为 AG-UI Endpoint

### 1. 安装依赖

```bash
pip install fastapi uvicorn langgraph ag-ui-protocol ag-ui-langgraph
```

### 2. 保留现有 Agent 构建方式

**示例：`app/agents/chat_agent.py`**

```python
from my_agent.workflow import build_workflow


def create_chat_graph():
    """返回已经 compile 的 LangGraph graph。"""
    return build_workflow().compile()
```

`my_agent.workflow` 是占位。实际项目应继续复用自己的模型、工具、checkpoint、依赖注入和可观测性配置。

### 3. 使用 CopilotKit 前端能力时接入 Middleware

如果只需要基础 AG-UI 消息和事件传输，协议适配器本身即可工作；如果还要使用 `useFrontendTool`、共享状态、中断恢复等 CopilotKit 能力，则应在创建 Agent 时加入 `CopilotKitMiddleware`。

```bash
pip install copilotkit deepagents
```

**示例：在 Agent Builder 中注册 Middleware**

```python
from copilotkit import CopilotKitMiddleware
from deepagents import create_deep_agent

agent = create_deep_agent(
    model=model,
    tools=tools,
    middleware=[CopilotKitMiddleware()],
)
```

如果项目使用自定义 Descriptor 或工厂，可以把 Middleware 作为配置传入：

```python
middleware=(CopilotKitMiddleware(),)
```

AG-UI Endpoint 负责协议传输和事件流，`CopilotKitMiddleware` 负责让 Agent 执行过程识别前端工具、上下文及 CopilotKit 交互能力。两者职责不同，完整的生成式 UI 接入通常需要同时配置。

### 4. 单独封装协议路由

**示例：`app/api/ag_ui.py`**

```python
from ag_ui_langgraph import add_langgraph_fastapi_endpoint
from fastapi import FastAPI

from app.agents.chat_agent import create_chat_graph


def register_ag_ui(app: FastAPI) -> None:
    add_langgraph_fastapi_endpoint(
        app,
        create_chat_graph(),
        "/ag-ui",
    )
```

这个文件只负责协议适配。以后更换 Agent 时，只需要替换 `create_chat_graph()`。

### 5. 挂载到 FastAPI

**示例：`app/main.py`**

```python
from fastapi import FastAPI
from app.api.ag_ui import register_ag_ui

app = FastAPI()
register_ag_ui(app)
```

如果 graph 依赖数据库、异步 checkpoint 或运行时配置，可在 lifespan 中初始化：

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    await initialize_dependencies()
    register_ag_ui(app)
    yield
    await close_dependencies()


app = FastAPI(lifespan=lifespan)
```

### 6. 启动服务

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

至此，后端得到一个接收 `RunAgentInput`、返回 AG-UI 事件流的 `POST /ag-ui`。

> 非 LangGraph 项目可以选择对应适配器；没有现成适配器时，也可使用 `RunAgentInput`、`EventEncoder` 和 `StreamingResponse` 手动发送事件。

## 七、Next.js 侧：建立 Runtime 代理并渲染 UI

以下采用 App Router。Pages Router 的目录不同，但 Runtime、Provider 和 `HttpAgent` 的职责相同。

### 1. 安装依赖

```bash
pnpm add @ag-ui/client @copilotkit/runtime @copilotkit/react-core zod
```

### 2. 配置后端地址

**示例：`.env.development`**

```bash
BACKEND_API_URL=http://localhost:8080
```

该变量只在服务端读取，不需要暴露为 `NEXT_PUBLIC_*`。

### 3. 创建 Runtime 代理

**示例：`src/app/api/copilotkit/route.ts`**

```typescript
import { HttpAgent } from '@ag-ui/client';
import {
  CopilotRuntime,
  createCopilotRuntimeHandler
} from '@copilotkit/runtime/v2';

const backendUrl = process.env.BACKEND_API_URL;
if (!backendUrl) throw new Error('BACKEND_API_URL is required');

const runtime = new CopilotRuntime({
  agents: {
    assistant: new HttpAgent({
      agentId: 'assistant',
      url: `${backendUrl}/ag-ui`
    })
  }
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: '/api/copilotkit',
  mode: 'single-route'
});

export const GET = handler;
export const POST = handler;
export const OPTIONS = handler;
```

这层代理用于隐藏后端地址、集中处理认证，并把浏览器请求转发到 AG-UI Endpoint。已有 BFF 或 API Gateway 的项目也可把 `HttpAgent` 注册在那里。

### 4. 挂载 Provider

**示例：`src/app/providers.tsx`**

```tsx
'use client';

import { CopilotKitProvider } from '@copilotkit/react-core/v2';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKitProvider
      runtimeUrl='/api/copilotkit'
      useSingleEndpoint>
      {children}
    </CopilotKitProvider>
  );
}
```

Provider 可以挂在根布局，也可以只包裹需要 Agent 的业务页面。使用内置聊天组件时，还需要在布局文件中引入样式：

```tsx
import '@copilotkit/react-core/v2/styles.css';
```

### 5. 渲染聊天组件

**示例：`src/features/agent/agent-chat.tsx`**

```tsx
'use client';

import { CopilotChat } from '@copilotkit/react-core/v2';
import { useAgentTools } from './use-agent-tools';

export function AgentChat() {
  useAgentTools();

  return (
    <CopilotChat
      agentId='assistant'
      labels={{ welcomeMessageText: '今天想处理什么？' }}
    />
  );
}
```

`agentId='assistant'` 必须与 Runtime key 和 `HttpAgent.agentId` 一致。

### 6. 注册前端工具

**示例：`src/features/agent/use-agent-tools.tsx`**

```tsx
'use client';

import { useFrontendTool } from '@copilotkit/react-core/v2';
import { z } from 'zod';

export function useAgentTools() {
  useFrontendTool({
    name: 'show_summary',
    description: '在页面中展示结构化摘要',
    parameters: z.object({
      title: z.string(),
      items: z.array(z.string())
    }),
    handler: async ({ title }) => `已展示摘要：${title}`,
    render: ({ args }) => (
      <section>
        <h3>{args.title}</h3>
        <ul>
          {args.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    )
  });
}
```

Agent 触发 `show_summary` 时，前端直接渲染结构化组件，而不是让模型拼一段固定格式 Markdown。Vue、原生 TypeScript 或自研组件库也可采用相同映射思路。

## 八、从输入到渲染的完整调用链

1. 用户在聊天组件输入消息
2. Provider 将请求发送到 `/api/copilotkit`
3. Next.js Runtime 根据 `agentId` 找到 `HttpAgent`
4. `HttpAgent` 向 Python `/ag-ui` 发送 `RunAgentInput`
5. Agent 运行模型并按需调用 MCP 或业务工具
6. Python 持续返回文本、工具和状态事件
7. Runtime 将事件流转发给浏览器
8. 聊天组件和前端工具按事件语义更新 UI

业务代码可以变化，但浏览器与 Agent 之间的协议保持稳定。

## 九、接入检查点

- 后端地址是 Next.js 服务端可访问的地址
- 网关关闭 SSE 缓冲，并允许足够长的超时时间
- Agent 名称、Runtime key 和页面 `agentId` 保持一致
- 工具名和参数 Schema 与 Agent 输出一致
- `threadId`、`runId`、`messageId` 保持稳定
- 高风险工具增加鉴权、参数校验和人工确认
- AG-UI、CopilotKit 和 Python 适配器成套升级验证

## 十、适用边界

AG-UI 不会替代鉴权、会话存储、限流和业务权限；这些仍属于应用自身职责。对于一次性返回简单文本的接口，普通 REST 也可能更轻量。

## 十一、总结

AG-UI 的核心价值不是“再做一个聊天接口”，而是把分散的文本流、工具调用、共享状态、人工确认和运行生命周期统一成可复用的实时事件契约。

MCP 负责让 Agent 接上工具，A2A 负责让 Agent 接上其他 Agent，AG-UI 则负责让这些能力真正进入用户界面。

无论目录、Agent 框架和 UI 组件库如何变化，接入时只要找到四个位置即可：**Agent 构建、AG-UI Endpoint、服务端 Runtime、前端渲染。**

## 参考资料

- https://docs.ag-ui.com/introduction
- https://docs.ag-ui.com/quickstart/server
- https://github.com/ag-ui-protocol/ag-ui