# BSC链可视化项目技术栈

本文档详细介绍BSC链可视化项目所使用的技术栈，包括前端、后端和区块链交互层的各项技术。

## 前端技术栈

### 核心框架

- **React 18**: 用于构建用户界面的JavaScript库
  - 采用函数式组件和Hooks API
  - 使用Context API进行状态管理
  - 利用React.memo和useCallback优化性能

### UI组件库

- **Chakra UI 2.8.0**: 现代化的React组件库
  - 提供可定制的UI组件
  - 支持响应式设计
  - 内置暗黑模式支持
  - 提供丰富的表单组件和布局工具

### 路由管理

- **React Router 6.15.0**: 前端路由管理库
  - 声明式路由配置
  - 支持嵌套路由
  - 提供路由参数和查询参数处理

### 区块链交互

- **Web3.js 4.0.3**: 以太坊兼容区块链交互库
  - 提供与BSC节点通信的接口
  - 支持合约调用和交易发送
  - 提供账户管理功能

- **Ethers.js 6.7.1**: 替代Web3.js的轻量级库
  - 提供更现代的API设计
  - 支持ENS解析
  - 提供更好的类型安全性

- **Web3Modal 1.9.12**: 钱包连接库
  - 支持多种钱包提供商
  - 提供统一的连接界面
  - 简化钱包连接流程

### 数据获取

- **Axios 1.4.0**: HTTP客户端库
  - 用于与后端API通信
  - 支持请求和响应拦截器
  - 提供请求取消功能

### 数据可视化

- **Recharts 2.7.3**: 基于React的图表库
  - 提供多种图表类型
  - 支持响应式设计
  - 提供丰富的定制选项

### 图标和动画

- **React Icons 4.10.1**: 图标库
  - 提供多种图标集合
  - 支持按需导入

- **Framer Motion 10.15.1**: 动画库
  - 提供声明式动画API
  - 支持手势和拖拽
  - 提供过渡动画效果

## 后端技术栈

### Web框架

- **FastAPI**: 高性能的Python Web框架
  - 基于标准Python类型提示
  - 自动生成API文档
  - 支持异步请求处理
  - 内置数据验证

### 区块链交互

- **DeepFlow Web3**: DeepFlow框架的Web3模块
  - 提供与区块链交互的高级接口
  - 支持多链操作
  - 集成智能合约调用功能

- **Web3.py**: Python的Web3库
  - 提供与以太坊兼容区块链的底层交互
  - 支持合约ABI解析和调用
  - 提供账户和交易管理

### 数据验证

- **Pydantic**: 数据验证和设置管理库
  - 基于Python类型注解
  - 提供自动数据验证
  - 支持复杂数据模型

### 实时通信

- **WebSocket**: 用于实时数据推送
  - 提供双向通信通道
  - 支持实时区块和交易更新
  - 减少轮询请求的需求

## 开发工具

### 前端开发工具

- **Create React App**: React应用脚手架
  - 提供开发环境配置
  - 内置热重载功能
  - 简化构建流程

- **ESLint**: JavaScript代码检查工具
  - 确保代码质量和一致性
  - 提供自动修复功能

- **Prettier**: 代码格式化工具
  - 确保代码风格一致
  - 与ESLint集成

### 后端开发工具

- **Uvicorn**: ASGI服务器
  - 用于运行FastAPI应用
  - 提供高性能的异步处理

- **pytest**: Python测试框架
  - 用于单元测试和集成测试
  - 支持异步测试

## 版本控制和部署

- **Git**: 版本控制系统
  - 用于代码管理和协作

- **Docker**: 容器化平台
  - 用于应用打包和部署
  - 确保环境一致性

- **Docker Compose**: 多容器应用管理工具
  - 用于定义和运行多容器应用
  - 简化部署流程

## 依赖管理

- **npm/yarn**: JavaScript包管理工具
  - 用于管理前端依赖

- **pip**: Python包管理工具
  - 用于管理后端依赖

## 技术选型理由

### 前端技术选型

- **React**: 选择React作为前端框架是因为其组件化设计、虚拟DOM和丰富的生态系统，适合构建复杂的单页面应用。

- **Chakra UI**: 选择Chakra UI是因为其提供了美观且可定制的组件，支持响应式设计和暗黑模式，提高了开发效率。

- **Web3.js/Ethers.js**: 选择这两个库是为了提供与BSC区块链的交互能力，Ethers.js作为备选提供了更现代的API设计。

### 后端技术选型

- **FastAPI**: 选择FastAPI是因为其高性能、易于使用的API设计和自动文档生成功能，适合构建现代化的API服务。

- **DeepFlow Web3**: 选择DeepFlow Web3是为了利用DeepFlow框架的区块链交互能力，简化与BSC的交互逻辑。

- **WebSocket**: 选择WebSocket是为了提供实时数据更新功能，减少轮询请求的需求，提高用户体验。