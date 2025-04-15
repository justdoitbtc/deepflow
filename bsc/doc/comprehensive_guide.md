# BSC链可视化项目综合指南

本文档包含BSC链可视化项目的技术栈详解、部署说明、API参考、组件说明、示例代码和版本更新日志等内容。

## 技术栈详解

### 前端技术栈

- **React 18**: 用于构建用户界面的JavaScript库
- **Chakra UI**: 现代化的React组件库，提供美观且可定制的UI组件
- **React Router**: 用于前端路由管理
- **Web3.js/ethers.js**: 用于与以太坊兼容区块链交互的JavaScript库
- **Axios**: 用于HTTP请求的客户端库
- **Recharts**: 基于React的图表库，用于数据可视化
- **React Icons**: 提供常用图标集合

### 后端技术栈

- **Python**: 主要编程语言
- **FastAPI**: 高性能的Web框架，用于构建API
- **DeepFlow Web3**: DeepFlow框架的Web3模块，用于区块链交互
- **WebSocket**: 用于实时数据推送
- **Pydantic**: 用于数据验证和设置管理

### 区块链交互

- **BSC节点**: 连接到币安智能链节点
- **Web3.py**: Python的Web3库，用于与区块链交互
- **ABI解析**: 用于解析和调用智能合约

## 部署说明

### 环境要求

- **Node.js**: v16.0.0或更高版本
- **Python**: v3.8或更高版本
- **npm/yarn**: 包管理工具

### 后端部署

1. **安装依赖**

   ```bash
   cd /path/to/DeepFlow/bsc/backend
   pip install -r requirements.txt
   ```

2. **配置环境变量**

   创建`.env`文件并设置以下变量：

   ```
   BSC_PROVIDER_URL=https://bsc-dataseed.binance.org/
   BSC_CHAIN_ID=56
   API_HOST=0.0.0.0
   API_PORT=8000
   ```

3. **启动API服务**

   ```bash
   uvicorn api:app --host 0.0.0.0 --port 8000 --reload
   ```

### 前端部署

1. **安装依赖**

   ```bash
   cd /path/to/DeepFlow/bsc/frontend
   npm install
   ```

2. **配置环境变量**

   创建`.env`文件并设置以下变量：

   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

3. **开发模式运行**

   ```bash
   npm start
   ```

4. **生产环境构建**

   ```bash
   npm run build
   ```

### Docker部署

1. **构建Docker镜像**

   ```bash
   docker-compose build
   ```

2. **启动服务**

   ```bash
   docker-compose up -d
   ```

## API参考

### 区块相关API

- **GET /api/blocks/latest**: 获取最新区块信息
- **GET /api/blocks/latest/{count}**: 获取最新的多个区块
- **GET /api/blocks/{block_number}**: 通过区块号获取区块信息

### 交易相关API

- **GET /api/transactions/{tx_hash}**: 获取交易信息
- **GET /api/transactions/{tx_hash}/receipt**: 获取交易收据
- **GET /api/transactions/latest/{count}**: 获取最新的多个交易

### 账户相关API

- **GET /api/accounts/{address}/balance**: 获取账户余额
- **GET /api/tokens/{token_address}/balances/{wallet_address}**: 获取代币余额

### 合约相关API

- **POST /api/contracts/call**: 调用合约方法（读取状态）

### WebSocket API

- **WebSocket /ws/blocks**: 实时区块更新
- **WebSocket /ws/gas**: 实时Gas价格更新

## 组件说明

### Dashboard.jsx

仪表盘组件，展示BSC网络概览信息，包括最新区块、平均区块时间、Gas价格和交易量等统计数据。

### BlockExplorer.jsx

区块浏览器组件，提供区块查询和浏览功能，包括区块列表、区块详情和区块内交易列表。

### TransactionList.jsx

交易列表组件，提供交易查询和浏览功能，包括交易列表、交易详情和交易收据。

### WalletManager.jsx

钱包管理组件，提供钱包连接、余额查询和交易发送功能，支持MetaMask等钱包。

### ContractInteraction.jsx

合约交互组件，提供合约ABI解析、函数调用和事件监听功能，支持读取和写入操作。

## 示例代码

### 连接MetaMask钱包

```javascript
const connectWallet = async () => {
  if (typeof window.ethereum === 'undefined') {
    console.error('请安装MetaMask钱包');
    return;
  }
  
  try {
    // 请求用户授权连接钱包
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
      
      // 获取账户余额
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      });
      
      setBalance(parseInt(balance, 16));
    }
  } catch (error) {
    console.error('连接钱包失败:', error);
  }
};
```

### 调用智能合约

```javascript
const callContractFunction = async () => {
  if (!contractAddress || !selectedFunction) return;
  
  // 准备参数
  const params = functionInputs.map(input => input.value);
  
  try {
    const result = await callContract({
      contract_address: contractAddress,
      function_name: selectedFunction.name,
      function_args: params,
      abi: JSON.parse(contractABI)
    });
    
    setFunctionResult({
      success: true,
      data: result,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('调用合约失败:', error);
    setFunctionResult({
      success: false,
      error: error.message,
      timestamp: Date.now()
    });
  }
};
```

### 获取区块数据

```python
@app.get("/api/blocks/{block_number}", response_model=Dict[str, Any])
async def get_block_by_number(block_number: int):
    """通过区块号获取区块信息"""
    try:
        bsc_service = get_bsc_service()
        return bsc_service.get_block_by_number(block_number)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 版本更新日志

### v0.1.0 (初始版本)

- 基本框架搭建
- 实现区块浏览器功能
- 实现交易列表功能
- 实现钱包连接功能
- 实现合约交互功能

### 计划功能

- 交易历史记录保存
- 多钱包支持
- 合约验证功能
- 代币列表和价格查询
- 数据导出功能

## 常见问题解答

### Q: 如何连接到测试网络？

A: 修改后端配置中的`BSC_PROVIDER_URL`为测试网节点URL，例如`https://data-seed-prebsc-1-s1.binance.org:8545/`，并将`BSC_CHAIN_ID`设置为97。

### Q: 如何添加自定义代币？

A: 在钱包管理页面，输入代币合约地址并点击"添加代币"按钮。系统将自动获取代币信息并显示余额。

### Q: 如何解决MetaMask连接问题？

A: 确保MetaMask已安装并已登录，然后刷新页面重试。如果问题仍然存在，尝试在MetaMask设置中重置账户。