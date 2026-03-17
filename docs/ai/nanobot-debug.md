# Nanobot 修改与调试过程

## 背景

在服务器上部署 nanobot 并修改了 Python 代码后，需要让 `nanobot agent` 执行的是修改后的代码，而不是已安装的版本。

## 环境

- 系统：Debian（externally-managed Python 环境）
- 项目目录：`~/nanobot`

## 问题与解决

### 1. 如何执行修改后的代码

**方式一：可编辑安装**

```bash
pip install -e .
```

之后 `nanobot agent` 会使用当前目录代码。若系统禁止直接 pip 安装，见下节。

**方式二：用 PYTHONPATH 指定本地代码**

```bash
cd ~/nanobot
PYTHONPATH=. python3 -m nanobot.cli.commands agent
```

不依赖安装方式，始终使用当前目录代码。

### 2. ModuleNotFoundError: No module named 'typer'

缺少依赖。在项目目录执行：

```bash
pip install -e .
```

会安装 nanobot 及 `pyproject.toml` 中的全部依赖。

### 3. externally-managed-environment

系统禁止向系统 Python 直接安装包。可选：

- **推荐：虚拟环境**

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
nanobot agent
```

- **或：强制安装（不推荐）**

```bash
pip install -e . --break-system-packages
```

### 4. 调试时用 -e 安装，但 `nanobot agent` 仍跑未修改的代码

原因：PATH 里的 `nanobot` 来自另一处安装（如 `/root/.local/bin/nanobot`），不是当前项目。

**确认：**

```bash
which nanobot
which python3
python3 -c "import nanobot; print(nanobot.__file__)"
```

若 `nanobot.__file__` 不在当前项目目录，说明用的不是本地代码。

**可靠做法：** 不依赖 `nanobot` 命令，固定用当前目录代码运行：

```bash
cd ~/nanobot
PYTHONPATH=. python3 -m nanobot.cli.commands agent
```

### 5. 调试完成后如何长期使用

代码改完后无需重新安装。若采用「PYTHONPATH + 模块」方式，可用脚本或别名简化命令。

**脚本方式：**

```bash
cd ~/nanobot
./run-nanobot.sh
```

`run-nanobot.sh` 内容：

```bash
#!/usr/bin/env bash
cd "$(dirname "$0")"
PYTHONPATH=. exec python3 -m nanobot.cli.commands "$@"
```

**别名方式：**

在 `~/.bashrc` 添加：

```bash
alias local-nanobot='cd ~/nanobot && ./run-nanobot.sh'
```

执行 `source ~/.bashrc` 后，任意目录输入 `local-nanobot` 即可。

## 总结

| 场景           | 命令 |
|----------------|------|
| 调试 / 日常运行 | `cd ~/nanobot && PYTHONPATH=. python3 -m nanobot.cli.commands agent` 或 `./run-nanobot.sh agent` |
| 确保用本地代码 | 必须带 `PYTHONPATH=.` 或使用 `run-nanobot.sh`，不要依赖 PATH 里的 `nanobot` |
