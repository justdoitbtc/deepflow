# DeepFlow 部署方法

本文档提供了 DeepFlow 框架的详细安装和部署指南，包括环境准备、安装步骤、配置方法和常见问题解决方案。

## 环境要求

### 基本要求

- **操作系统**: Linux, macOS, 或 Windows
- **Python 版本**: 3.8 或更高版本
- **Git**: 用于源码安装
- **磁盘空间**: 至少 1GB 可用空间（不包括模型存储）

### 推荐硬件配置

- **CPU**: 4+ 核心
- **内存**: 8GB+ RAM
- **GPU**: 推荐用于大型模型（可选）

## 安装方法

### 方法一：使用 pip 安装

这是最简单的安装方法，适合大多数用户：

```bash
pip install deepflow
```

### 方法二：从源码安装

如果您需要最新的开发版本或计划贡献代码，可以从源码安装：

```bash
# 克隆仓库
git clone https://github.com/username/deepflow.git
cd deepflow

# 安装依赖
pip install -e .
```

### 方法三：使用 Docker

如果您希望在隔离环境中运行 DeepFlow，可以使用 Docker：

```bash
# 拉取官方镜像
docker pull username/deepflow:latest

# 运行容器
docker run -it username/deepflow:latest
```

## 配置

### 基本配置

DeepFlow 使用配置文件来管理设置。默认配置文件位于 `~/.deepflow/config.yaml`。您可以通过以下方式创建配置文件：

```bash
mkdir -p ~/.deepflow
touch ~/.deepflow/config.yaml
```

配置文件示例：

```yaml
# DeepFlow 配置文件

# 模型设置
model:
  provider: "huggingface"  # 可选: "openai", "huggingface", "custom"
  name: "gpt-3.5-turbo"   # 模型名称
  api_key: ""             # API 密钥（如果需要）

# 工具设置
tools:
  enabled:
    - "python_executor"
    - "web_search"
    - "file_system"
    - "blockchain"

# Web3 设置
web3:
  provider: "http://localhost:8545"  # 区块链节点 URL
  chain_id: 1                        # 链 ID

# 执行环境设置
runtime:
  executor: "local"  # 可选: "local", "docker", "e2b"
  timeout: 60         # 执行超时（秒）

# 日志设置
logging:
  level: "info"      # 可选: "debug", "info", "warning", "error"
  file: "~/.deepflow/logs/deepflow.log"
```

### 环境变量

您也可以使用环境变量来配置 DeepFlow：

```bash
# 设置 API 密钥
export DEEPFLOW_API_KEY="your-api-key"

# 设置模型提供商
export DEEPFLOW_MODEL_PROVIDER="openai"

# 设置日志级别
export DEEPFLOW_LOG_LEVEL="debug"
```

## Web3 配置

### 连接区块链网络

要使用 DeepFlow 的 Web3 功能，您需要配置区块链连接：

```yaml
# Web3 配置
web3:
  provider: "https://mainnet.infura.io/v3/your-project-id"  # 以太坊主网
  # 或使用本地节点
  # provider: "http://localhost:8545"  # 本地节点
  chain_id: 1  # 以太坊主网的链 ID
```

### 配置钱包

```yaml
# 钱包配置
wallet:
  type: "keystore"  # 可选: "keystore", "mnemonic", "private_key"
  path: "~/.deepflow/keystore"  # 密钥库路径
  # 或使用助记词
  # mnemonic: "your mnemonic phrase here"
  # 或使用私钥（不推荐在配置文件中存储）
  # private_key: "your-private-key"
```

## 验证安装

安装完成后，您可以运行以下命令验证安装：

```bash
python -c "import deepflow; print(deepflow.__version__)"
```

如果显示版本号，则表示安装成功。

## 常见问题

### 依赖冲突

**问题**: 安装时出现依赖冲突。

**解决方案**: 创建虚拟环境后再安装：

```bash
python -m venv deepflow-env
source deepflow-env/bin/activate  # Linux/Mac
# 或
deepflow-env\Scripts\activate    # Windows

pip install deepflow
```

### 模型下载问题

**问题**: 模型下载失败或速度慢。

**解决方案**: 设置 HuggingFace 镜像或使用代理：

```bash
export HF_ENDPOINT=https://hf-mirror.com
# 或设置代理
export HTTPS_PROXY=http://your-proxy:port
```

### GPU 支持

**问题**: 无法使用 GPU 加速。

**解决方案**: 确保已安装正确版本的 CUDA 和 PyTorch：

```bash
pip install torch==1.10.0+cu113 -f https://download.pytorch.org/whl/cu113/torch_stable.html
```

## 升级

要升级到最新版本，请运行：

```bash
pip install --upgrade deepflow
```

## 卸载

如果需要卸载 DeepFlow，请运行：

```bash
pip uninstall deepflow
```

## 总结

DeepFlow 提供了多种安装和配置方法，可以根据您的需求选择最合适的方式。通过正确配置，您可以充分利用 DeepFlow 的 AI 和 Web3 功能，开发强大的智能应用程序。