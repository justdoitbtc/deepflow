# DeepFlow 开发案例

本文档提供了 DeepFlow 框架的实际开发案例和代码示例，帮助开发者快速上手并理解如何在实际项目中应用 DeepFlow。

## 基础使用案例

### 案例 1: 创建基本智能体

以下示例展示了如何创建一个基本的多步骤智能体并执行简单任务：

```python
from deepflow import MultiStepAgent, Tool
from deepflow.models import get_model

# 初始化模型
model = get_model("gpt-3.5-turbo")

# 定义一个简单的工具
class CalculatorTool(Tool):
    name = "calculator"
    description = "执行基本的数学计算"
    
    def __call__(self, expression: str) -> str:
        """计算数学表达式"""
        try:
            result = eval(expression)
            return f"计算结果: {result}"
        except Exception as e:
            return f"计算错误: {str(e)}"

# 创建智能体
agent = MultiStepAgent(
    tools=[CalculatorTool()],
    model=model,
    max_steps=5
)

# 运行任务
result = agent.run("计算 (15 * 7) + (22 / 2) 的值")
print(result)
```

### 案例 2: 使用工具调用智能体

以下示例展示了如何使用专门的工具调用智能体：

```python
from deepflow import ToolCallingAgent, Tool
from deepflow.models import get_model
from deepflow.tools import WebSearchTool, PythonInterpreterTool

# 初始化模型
model = get_model("gpt-4")

# 创建工具调用智能体
agent = ToolCallingAgent(
    tools=[WebSearchTool(), PythonInterpreterTool()],
    model=model
)

# 运行任务
result = agent.run("查找最新的比特币价格并计算如果我有0.5个比特币，价值多少美元")
print(result)
```

## Web3 开发案例

### 案例 3: 智能合约交互

以下示例展示了如何使用 DeepFlow 与智能合约交互：

```python
from deepflow import Web3Agent
from deepflow.tools import BlockchainTool, PythonInterpreterTool
from deepflow.models import get_model

# 初始化模型
model = get_model("gpt-4")

# 创建区块链工具
blockchain_tool = BlockchainTool(
    provider_url="https://mainnet.infura.io/v3/your-project-id",
    chain_id=1
)

# 创建 Web3 智能体
agent = Web3Agent(
    tools=[blockchain_tool, PythonInterpreterTool()],
    model=model
)

# 智能合约 ABI
contract_abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "type": "function"
    },
    # ... 其他 ABI 定义
]

# 智能合约地址
contract_address = "0x1234567890123456789012345678901234567890"

# 运行任务
result = agent.run(f"使用 ABI {contract_abi} 查询地址为 {contract_address} 的智能合约的名称")
print(result)
```

### 案例 4: 部署智能合约

以下示例展示了如何使用 DeepFlow 部署智能合约：

```python
from deepflow import Web3Agent, CodeAgent
from deepflow.tools import BlockchainTool
from deepflow.models import get_model

# 初始化模型
model = get_model("gpt-4")

# 创建代码智能体生成智能合约
code_agent = CodeAgent(model=model)
contract_code = code_agent.run("创建一个简单的 ERC20 代币智能合约，名称为 'DeepToken'，符号为 'DPT'，总供应量为 1000000")

# 创建区块链工具
blockchain_tool = BlockchainTool(
    provider_url="http://localhost:8545",  # 本地开发网络
    chain_id=1337,
    private_key="your-private-key"  # 用于签署交易的私钥
)

# 创建 Web3 智能体
web3_agent = Web3Agent(
    tools=[blockchain_tool],
    model=model
)

# 部署合约
result = web3_agent.run(f"编译并部署以下智能合约:\n{contract_code}")
print(result)
```

## 高级使用案例

### 案例 5: 自定义工具开发

以下示例展示了如何创建自定义工具：

```python
from deepflow import Tool, MultiStepAgent
from deepflow.models import get_model
import requests

# 创建自定义 API 工具
class WeatherTool(Tool):
    name = "weather_tool"
    description = "获取指定城市的天气信息"
    
    def __call__(self, city: str) -> str:
        """获取指定城市的天气信息"""
        try:
            api_key = "your-weather-api-key"
            url = f"https://api.weatherapi.com/v1/current.json?key={api_key}&q={city}"
            response = requests.get(url)
            data = response.json()
            
            if "error" in data:
                return f"错误: {data['error']['message']}"
                
            current = data["current"]
            location = data["location"]
            
            return f"城市: {location['name']}, {location['country']}\n" \
                   f"温度: {current['temp_c']}°C\n" \
                   f"天气: {current['condition']['text']}\n" \
                   f"湿度: {current['humidity']}%\n" \
                   f"风速: {current['wind_kph']} km/h"
        except Exception as e:
            return f"获取天气信息失败: {str(e)}"

# 初始化模型
model = get_model("gpt-3.5-turbo")

# 创建智能体
agent = MultiStepAgent(
    tools=[WeatherTool()],
    model=model
)

# 运行任务
result = agent.run("北京今天的天气怎么样？")
print(result)
```

### 案例 6: 记忆系统使用

以下示例展示了如何使用 DeepFlow 的记忆系统：

```python
from deepflow import MultiStepAgent, Tool
from deepflow.models import get_model
from deepflow.memory import AgentMemory

# 初始化模型
model = get_model("gpt-4")

# 创建自定义记忆工具
class MemoryTool(Tool):
    name = "memory_tool"
    description = "存储和检索信息"
    
    def __init__(self):
        self.memory = {}
    
    def __call__(self, action: str, key: str = None, value: str = None) -> str:
        """存储或检索信息
        
        参数:
            action: 'store' 或 'retrieve'
            key: 存储或检索的键
            value: 要存储的值（仅在 action='store' 时需要）
        """
        if action == "store" and key and value:
            self.memory[key] = value
            return f"已存储: {key} = {value}"
        elif action == "retrieve" and key:
            if key in self.memory:
                return f"检索结果: {key} = {self.memory[key]}"
            else:
                return f"未找到键: {key}"
        else:
            return "无效的操作或参数"

# 创建智能体
agent = MultiStepAgent(
    tools=[MemoryTool()],
    model=model,
    memory=AgentMemory()
)

# 运行多轮对话
print(agent.run("请记住我的名字是张三"))
print(agent.run("我的生日是1990年1月1日"))
print(agent.run("我叫什么名字？我的生日是什么时候？"))
```

## 实际应用场景

### 场景 1: 智能客服机器人

```python
from deepflow import MultiStepAgent
from deepflow.tools import WebSearchTool, PythonInterpreterTool
from deepflow.models import get_model

# 初始化模型
model = get_model("gpt-3.5-turbo")

# 创建智能客服机器人
bot = MultiStepAgent(
    tools=[WebSearchTool(), PythonInterpreterTool()],
    model=model,
    system_prompt="你是一个专业的客服助手，负责回答用户关于我们产品的问题。"
)

# 模拟对话
questions = [
    "你们的退货政策是什么？",
    "我的订单什么时候能到？订单号是 ABC123",
    "你们的产品支持国际配送吗？"
]

for question in questions:
    print(f"用户: {question}")
    response = bot.run(question)
    print(f"机器人: {response}\n")
```

### 场景 2: 区块链数据分析

```python
from deepflow import MultiStepAgent
from deepflow.tools import BlockchainTool, PythonInterpreterTool
from deepflow.models import get_model

# 初始化模型
model = get_model("gpt-4")

# 创建区块链分析智能体
analyzer = MultiStepAgent(
    tools=[BlockchainTool(), PythonInterpreterTool()],
    model=model,
    system_prompt="你是一个区块链数据分析专家，负责分析以太坊交易和智能合约。"
)

# 分析任务
task = """
分析以下以太坊地址的交易历史，并回答以下问题：
1. 该地址持有哪些主要代币？
2. 该地址与哪些主要 DeFi 协议交互过？
3. 该地址的交易模式是什么？

地址: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
"""

result = analyzer.run(task)
print(result)
```

## 总结

以上示例展示了 DeepFlow 框架在不同场景下的应用。通过这些案例，开发者可以了解如何：

1. 创建和使用不同类型的智能体
2. 开发自定义工具
3. 与区块链和智能合约交互
4. 利用记忆系统实现多轮对话
5. 将 DeepFlow 应用于实际业务场景

这些示例仅展示了 DeepFlow 功能的一部分，开发者可以根据自己的需求进一步探索和扩展框架的能力。