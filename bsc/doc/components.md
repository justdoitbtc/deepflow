# BSC链可视化项目组件说明

本文档详细介绍BSC链可视化项目的前端组件，包括组件功能、属性和使用方法。

## 核心组件

### Dashboard.jsx

仪表盘组件，展示BSC网络概览信息。

**功能**：
- 显示BSC网络关键指标（最新区块、平均区块时间、Gas价格等）
- 展示Gas价格趋势图
- 显示最新区块和交易统计

**主要属性**：
- 自动刷新数据（默认30秒）
- 支持WebSocket实时更新
- 响应式布局，适配不同屏幕尺寸

**使用示例**：
```jsx
<Dashboard refreshInterval={30000} />  // 30秒刷新一次
```

### BlockExplorer.jsx

区块浏览器组件，提供区块查询和浏览功能。

**功能**：
- 显示最新区块列表
- 区块详情查看（包括区块头信息、交易列表等）
- 区块搜索功能
- 区块内交易浏览

**主要属性**：
- `blockCount`: 显示的区块数量，默认为20
- `autoRefresh`: 是否自动刷新，默认为true
- `refreshInterval`: 刷新间隔（毫秒），默认为15000

**使用示例**：
```jsx
<BlockExplorer blockCount={10} autoRefresh={true} refreshInterval={10000} />
```

### TransactionList.jsx

交易列表组件，提供交易查询和浏览功能。

**功能**：
- 显示最新交易列表
- 交易详情查看（包括交易状态、Gas使用、事件日志等）
- 交易哈希搜索功能
- 交易收据和事件解析

**主要属性**：
- `txCount`: 显示的交易数量，默认为20
- `autoRefresh`: 是否自动刷新，默认为true
- `refreshInterval`: 刷新间隔（毫秒），默认为15000

**使用示例**：
```jsx
<TransactionList txCount={15} autoRefresh={true} />
```

### WalletManager.jsx

钱包管理组件，提供钱包连接和交易功能。

**功能**：
- 支持MetaMask等钱包连接
- 账户余额查询（BNB和其他代币）
- 交易发送功能
- 交易历史记录查看

**主要属性**：
- `onConnect`: 钱包连接成功回调函数
- `onDisconnect`: 钱包断开连接回调函数
- `showBalance`: 是否显示余额，默认为true

**使用示例**：
```jsx
<WalletManager 
  onConnect={(account) => console.log(`Connected: ${account}`)} 
  onDisconnect={() => console.log('Disconnected')} 
/>
```

### ContractInteraction.jsx

合约交互组件，提供智能合约调用功能。

**功能**：
- 合约ABI导入和解析
- 合约函数调用（读取和写入）
- 合约事件监听
- 常用合约模板和保存功能

**主要属性**：
- `defaultContractAddress`: 默认合约地址
- `defaultAbi`: 默认合约ABI
- `onCallSuccess`: 调用成功回调函数
- `onCallError`: 调用失败回调函数

**使用示例**：
```jsx
<ContractInteraction 
  defaultContractAddress="0x..." 
  onCallSuccess={(result) => console.log('Call result:', result)} 
/>
```

## 辅助组件

### Navbar.jsx

导航栏组件，提供应用导航功能。

**功能**：
- 应用标题和logo显示
- 主要功能模块导航
- 钱包连接状态显示
- 暗黑模式切换

**主要属性**：
- `title`: 应用标题
- `logo`: 应用logo URL
- `links`: 导航链接数组

**使用示例**：
```jsx
<Navbar 
  title="BSC可视化" 
  links={[
    { name: '仪表盘', path: '/' },
    { name: '区块浏览器', path: '/blocks' },
    { name: '交易列表', path: '/transactions' },
    { name: '钱包管理', path: '/wallet' },
    { name: '合约交互', path: '/contract' }
  ]} 
/>
```

## 组件间通信

组件间通信主要通过以下方式实现：

1. **Props传递**：父组件向子组件传递数据和回调函数
2. **Context API**：共享全局状态，如钱包连接状态
3. **自定义事件**：组件间触发和监听事件

示例：使用Context API共享钱包状态

```jsx
// WalletContext.js
import React, { createContext, useState, useContext } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const connectWallet = async () => {
    // 实现钱包连接逻辑
  };
  
  const disconnectWallet = () => {
    // 实现钱包断开连接逻辑
  };
  
  return (
    <WalletContext.Provider value={{ 
      account, 
      isConnected, 
      connectWallet, 
      disconnectWallet 
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
```

## 组件样式

项目使用Chakra UI作为组件库，提供了一致的样式和主题。

主要样式特点：

1. **响应式设计**：适配不同屏幕尺寸
2. **主题定制**：支持亮色和暗色模式
3. **一致的视觉风格**：使用统一的颜色、字体和间距

示例：自定义主题配置

```jsx
// theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      500: '#0070f3',
      900: '#00305a',
    },
  },
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});

export default theme;
```

## 最佳实践

### 组件使用建议

1. **组合使用**：根据需求组合使用不同组件
2. **自定义配置**：通过属性定制组件行为
3. **响应式布局**：使用Chakra UI的响应式工具适配不同屏幕

### 性能优化

1. **使用React.memo**：避免不必要的重渲染
2. **使用useCallback和useMemo**：优化函数和计算值
3. **合理设置刷新间隔**：避免过于频繁的数据请求

### 扩展建议

1. **添加新组件**：创建新的专用组件，如代币浏览器、NFT展示等
2. **增强现有组件**：为现有组件添加新功能，如更详细的数据分析
3. **自定义主题**：根据项目需求定制组件样式和主题