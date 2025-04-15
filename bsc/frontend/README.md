# BSC链可视化页面 - 前端

这是BSC链可视化页面的前端部分，使用React和Chakra UI构建。

## 技术栈

- **React**: UI框架
- **Chakra UI**: 组件库
- **Web3.js**: 区块链交互
- **Recharts**: 数据可视化
- **Axios**: HTTP客户端

## 项目结构

```
src/
├── components/       # UI组件
│   ├── BlockExplorer.jsx    # 区块浏览器组件
│   ├── TransactionList.jsx  # 交易列表组件
│   ├── WalletManager.jsx    # 钱包管理组件
│   └── ContractInteraction.jsx # 合约交互组件
├── services/        # 服务和API调用
├── utils/           # 工具函数
├── App.jsx          # 主应用组件
└── index.jsx        # 应用入口
```

## 主要功能

1. **区块浏览器**：显示最新区块信息，区块详情查看，区块内交易列表
2. **交易监控**：实时交易流，交易详情查看，交易状态跟踪
3. **钱包管理**：钱包连接（MetaMask等），余额显示，交易发送
4. **智能合约交互**：合约浏览和搜索，ABI导入和解析，合约方法调用
5. **数据分析**：BSC网络状态概览，Gas价格趋势，交易量统计

## 安装和运行

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm start
```

### 构建生产版本

```bash
npm run build
```

## 开发指南

### API服务

前端默认连接到`http://localhost:8000`的后端API服务。可以通过`.env`文件修改API地址：

```
REACT_APP_API_URL=http://localhost:8000
```

### 添加新组件

1. 在`src/components`目录下创建新的组件文件
2. 在`App.jsx`中导入并使用该组件

### 连接区块链

前端使用Web3.js直接连接BSC网络，同时也通过后端API获取数据。钱包连接使用Web3Modal实现，支持MetaMask等多种钱包。

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议。请遵循以下步骤：

1. Fork仓库
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request