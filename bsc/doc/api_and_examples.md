# BSC链可视化项目API参考与示例代码

本文档提供BSC链可视化项目的API参考和示例代码，帮助开发者理解和使用项目功能。

## API参考

### 区块相关API

#### 获取最新区块

```
GET /api/blocks/latest
```

**响应示例**：

```json
{
  "number": 28651429,
  "hash": "0x8f5aad7e7ad79436247b1d0adf4d8e91f4b3a4b9c0c0f79f629e1a0c3e1f3d5e",
  "parentHash": "0x7a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
  "timestamp": 1678901234,
  "transactions": [...],
  "miner": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  "gasUsed": 12345678,
  "gasLimit": 30000000
}
```

#### 获取多个最新区块

```
GET /api/blocks/latest/{count}
```

**参数**：
- `count`: 要获取的区块数量

**响应示例**：

```json
[
  {
    "number": 28651429,
    "hash": "0x8f5aad7e7ad79436247b1d0adf4d8e91f4b3a4b9c0c0f79f629e1a0c3e1f3d5e",
    "timestamp": 1678901234,
    "transactions": [...]
  },
  {
    "number": 28651428,
    "hash": "0x7e6d5c4b3a2918072635f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3",
    "timestamp": 1678901222,
    "transactions": [...]
  }
]
```

#### 通过区块号获取区块

```
GET /api/blocks/{block_number}
```

**参数**：
- `block_number`: 区块号

**响应示例**：与获取最新区块相同

### 交易相关API

#### 获取交易信息

```
GET /api/transactions/{tx_hash}
```

**参数**：
- `tx_hash`: 交易哈希

**响应示例**：

```json
{
  "hash": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
  "blockHash": "0x8f5aad7e7ad79436247b1d0adf4d8e91f4b3a4b9c0c0f79f629e1a0c3e1f3d5e",
  "blockNumber": 28651429,
  "from": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  "to": "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
  "value": "1000000000000000000",
  "gas": 21000,
  "gasPrice": "5000000000",
  "input": "0x",
  "nonce": 42,
  "timestamp": 1678901234
}
```

#### 获取交易收据

```
GET /api/transactions/{tx_hash}/receipt
```

**参数**：
- `tx_hash`: 交易哈希

**响应示例**：

```json
{
  "transactionHash": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
  "blockHash": "0x8f5aad7e7ad79436247b1d0adf4d8e91f4b3a4b9c0c0f79f629e1a0c3e1f3d5e",
  "blockNumber": 28651429,
  "gasUsed": 21000,
  "status": 1,
  "logs": [...],
  "contractAddress": null
}
```

### 账户相关API

#### 获取账户余额

```
GET /api/accounts/{address}/balance
```

**参数**：
- `address`: 账户地址

**响应示例**：

```json
{
  "address": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  "balance_wei": "1000000000000000000",
  "balance_bnb": 1.0,
  "timestamp": "2023-03-15T12:34:56.789Z"
}
```

#### 获取代币余额

```
GET /api/tokens/{token_address}/balances/{wallet_address}
```

**参数**：
- `token_address`: 代币合约地址
- `wallet_address`: 钱包地址

**响应示例**：

```json
{
  "token_address": "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
  "wallet_address": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  "balance": "1000000000000000000000",
  "timestamp": "2023-03-15T12:34:56.789Z"
}
```

### 合约相关API

#### 调用合约方法

```
POST /api/contracts/call
```

**请求体**：

```json
{
  "contract_address": "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
  "function_name": "balanceOf",
  "function_args": ["0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b"],
  "abi": [...]
}
```

**响应示例**：

```json
{
  "contract_address": "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
  "function_name": "balanceOf",
  "result": "1000000000000000000000",
  "timestamp": "2023-03-15T12:34:56.789Z"
}
```

### WebSocket API

#### 实时区块更新

```
WebSocket /ws/blocks
```

**消息示例**：

```json
{
  "event": "new_block",
  "data": {
    "number": 28651430,
    "hash": "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7",
    "timestamp": 1678901246,
    "transactions": [...]
  }
}
```

#### 实时Gas价格更新

```
WebSocket /ws/gas
```

**消息示例**：

```json
{
  "event": "gas_update",
  "data": {
    "gas_price_wei": "5000000000",
    "gas_price_gwei": 5.0,
    "timestamp": 1678901246
  }
}
```

## 示例代码

### 前端示例

#### 连接MetaMask钱包

```javascript
import React, { useState } from 'react';
import { Button, Text, useToast } from '@chakra-ui/react';

const WalletConnector = () => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const toast = useToast();
  
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: '未检测到钱包',
        description: '请安装MetaMask钱包后再试',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    try {
      // 请求用户授权连接钱包
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        
        toast({
          title: '钱包已连接',
          description: `已连接到账户: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('连接钱包失败:', error);
      toast({
        title: '连接失败',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  return (
    <div>
      {isConnected ? (
        <Text>已连接: {account.substring(0, 6)}...{account.substring(account.length - 4)}</Text>
      ) : (
        <Button colorScheme="blue" onClick={connectWallet}>连接钱包</Button>
      )}
    </div>
  );
};

export default WalletConnector;
```

#### 获取区块数据

```javascript
import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Spinner } from '@chakra-ui/react';
import { fetchLatestBlocks } from '../services/api';

const BlockList = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const getBlocks = async () => {
      try {
        const latestBlocks = await fetchLatestBlocks(10);
        setBlocks(latestBlocks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blocks:', error);
        setError('无法获取区块数据');
        setLoading(false);
      }
    };
    
    getBlocks();
    const interval = setInterval(getBlocks, 15000); // 每15秒更新一次
    
    return () => clearInterval(interval);
  }, []);
  
  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">{error}</Text>;
  
  return (
    <Box>
      <Heading size="md" mb={4}>最新区块</Heading>
      {blocks.map(block => (
        <Box key={block.number} p={3} mb={2} borderWidth="1px" borderRadius="md">
          <Text fontWeight="bold">区块 #{block.number}</Text>
          <Text fontSize="sm">哈希: {block.hash.substring(0, 10)}...</Text>
          <Text fontSize="sm">时间: {new Date(block.timestamp * 1000).toLocaleString()}</Text>
          <Text fontSize="sm">交易数: {block.transactions.length}</Text>
        </Box>
      ))}
    </Box>
  );
};

export default BlockList;
```

#### 调用智能合约

```javascript
import React, { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, Text, useToast } from '@chakra-ui/react';
import { callContract } from '../services/api';

const TokenBalance = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  
  // ERC20代币的balanceOf ABI
  const abi = [
    {
      "constant": true,
      "inputs": [{"name": "_owner", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"name": "balance", "type": "uint256"}],
      "type": "function"
    }
  ];
  
  const getBalance = async () => {
    if (!tokenAddress || !walletAddress) {
      toast({
        title: '请输入地址',
        description: '代币地址和钱包地址不能为空',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await callContract({
        contract_address: tokenAddress,
        function_name: 'balanceOf',
        function_args: [walletAddress],
        abi: abi
      });
      
      // 假设代币有18位小数
      const formattedBalance = parseInt(result.result) / 10**18;
      setBalance(formattedBalance);
    } catch (error) {
      console.error('获取余额失败:', error);
      toast({
        title: '获取失败',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <FormControl mb={3}>
        <FormLabel>代币合约地址</FormLabel>
        <Input 
          value={tokenAddress} 
          onChange={(e) => setTokenAddress(e.target.value)} 
          placeholder="0x..."
        />
      </FormControl>
      
      <FormControl mb={3}>
        <FormLabel>钱包地址</FormLabel>
        <Input 
          value={walletAddress} 
          onChange={(e) => setWalletAddress(e.target.value)} 
          placeholder="0x..."
        />
      </FormControl>
      
      <Button 
        colorScheme="blue" 
        onClick={getBalance} 
        isLoading={loading}
        mb={3}
      >
        查询余额
      </Button>
      
      {balance !== null && (
        <Text mt={2} fontSize="xl">
          余额: {balance.toLocaleString()} 代币
        </Text>
      )}
    </Box>
  );
};

export default TokenBalance;
```

### 后端示例

#### 获取区块数据

```python
from fastapi import FastAPI, HTTPException
from typing import Dict, Any, List

from .blockchain import get_bsc_service

app = FastAPI()

@app.get("/api/blocks/latest", response_model=Dict[str, Any])
async def get_latest_block():
    """获取最新区块信息"""
    try:
        bsc_service = get_bsc_service()
        return bsc_service.get_latest_block()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/blocks/latest/{count}", response_model=List[Dict[str, Any]])
async def get_latest_blocks(count: int = 10):
    """获取最新的多个区块"""
    try:
        bsc_service = get_bsc_service()
        return bsc_service.get_latest_blocks(count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

#### WebSocket实现

```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
import asyncio
import json

app = FastAPI()

# WebSocket连接管理
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# 实时区块更新WebSocket
@app.websocket("/ws/blocks")
async def websocket_blocks(websocket: WebSocket):
    await manager.connect(websocket)
    bsc_service = get_bsc_service()
    last_block_number = 0
    
    try:
        while True:
            # 每3秒检查一次新区块
            await asyncio.sleep(3)
            latest_block = bsc_service.get_latest_block()
            
            if latest_block['number'] > last_block_number:
                last_block_number = latest_block['number']
                await websocket.send_json({
                    "event": "new_block",
                    "data": latest_block
                })
    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

#### 合约调用实现

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any
from datetime import datetime

from .blockchain import get_bsc_service

app = FastAPI()

class ContractCallModel(BaseModel):
    contract_address: str = Field(..., description="合约地址")
    function_name: str = Field(..., description="函数名称")
    function_args: List[Any] = Field(default=[], description="函数参数")
    abi: List[Dict[str, Any]] = Field(..., description="合约ABI")

@app.post("/api/contracts/call", response_model=Dict[str, Any])
async def call_contract(contract_call: ContractCallModel):
    """调用合约方法（读取状态）"""
    try:
        bsc_service = get_bsc_service()
        result = bsc_service.call_contract(
            contract_address=contract_call.contract_address,
            abi=contract_call.abi,
            function_name=contract_call.function_name,
            function_args=contract_call.function_args
        )
        return {
            "contract_address": contract_call.contract_address,
            "function_name": contract_call.function_name,
            "result": result,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 集成示例

### 完整的区块浏览功能

以下示例展示了如何集成前端和后端代码，实现完整的区块浏览功能：

1. 后端API实现区块数据获取
2. 前端组件展示区块列表和详情
3. 使用WebSocket实现实时更新

#### 前端实现

```javascript
// BlockExplorer.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Heading, Text, Flex, Spinner, Button, Input, InputGroup, InputRightElement,
  Card, CardHeader, CardBody, Table, Thead, Tbody, Tr, Th, Td, Badge
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { fetchLatestBlocks, fetchBlockByNumber } from '../services/api';

const BlockExplorer = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // 获取最新区块
  useEffect(() => {
    const getBlocks = async () => {
      try {
        const latestBlocks = await fetchLatestBlocks(10);
        setBlocks(latestBlocks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blocks:', error);
        setLoading(false);
      }
    };
    
    getBlocks();
    
    // 设置WebSocket连接
    const ws = new WebSocket(`ws://${window.location.hostname}:8000/ws/blocks`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === 'new_block') {
        setBlocks(prev => {
          // 添加新区块并保持最多10个
          const newBlocks = [data.data, ...prev];
          return newBlocks.slice(0, 10);
        });
      }
    };
    
    return () => {
      ws.close();
    };
  }, []);
  
  // 处理区块搜索
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    const blockNumber = parseInt(searchQuery.trim());
    if (isNaN(blockNumber)) return;
    
    try {
      const block = await fetchBlockByNumber(blockNumber);
      setSelectedBlock(block);
    } catch (error) {
      console.error('Error fetching block:', error);
    }
  };
  
  // 处理区块选择
  const handleBlockSelect = async (blockNumber) => {
    try {
      const block = await fetchBlockByNumber(blockNumber);
      setSelectedBlock(block);
    } catch (error) {
      console.error('Error fetching block:', error);
    }
  };
  
  if (loading) {
    return <Spinner size="xl" />;
  }
  
  return (
    <Box>
      <Heading mb={6}>区块浏览器</Heading>
      
      {/* 搜索区块 */}
      <InputGroup size="lg" mb={6}>
        <Input
          placeholder="输入区块号..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleSearch}>
            <SearchIcon />
          </Button>
        </InputRightElement>
      </InputGroup>
      
      <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
        {/* 区块列表 */}
        <Box flex="1">
          <Card>
            <CardHeader>
              <Heading size="md">最新区块</Heading>
            </CardHeader>
            <CardBody>
              <Box maxH="600px" overflowY="auto">
                {blocks.map((block) => (
                  <Box
                    key={block.number}
                    p={3}
                    mb={2}
                    borderWidth="1px"
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => handleBlockSelect(block.number)}
                    bg={selectedBlock?.number === block.number ? 'blue.50' : 'transparent'}
                  >
                    <Text fontWeight="bold">区块 #{block.number}</Text>
                    <Text fontSize="sm">时间: {new Date(block.timestamp * 1000).toLocaleString()}</Text>
                    <Text fontSize="sm">交易数: {block.transactions.length}</Text>
                  </Box>
                ))}
              </Box>
            </CardBody>
          </Card>
        </Box>
        
        {/* 区块详情 */}
        {selectedBlock && (
          <Box flex="2">
            <Card>
              <CardHeader>
                <Heading size="md">区块详情 #{selectedBlock.number}</Heading>
              </CardHeader>
              <CardBody>
                <Table variant="simple" size="sm">
                  <Tbody>
                    <Tr>
                      <Th>区块哈希</Th>
                      <Td wordBreak="break-all">{selectedBlock.hash}</Td>
                    </Tr>
                    <Tr>
                      <Th>父区块哈希</Th>
                      <Td wordBreak="break-all">{selectedBlock.parentHash}</Td>
                    </Tr>
                    <Tr>
                      <Th>时间戳</Th>
                      <Td>{new Date(selectedBlock.timestamp * 1000).toLocaleString()}</Td>
                    </Tr>
                    <Tr>
                      <Th>矿工</Th>
                      <Td>{selectedBlock.miner}</Td>
                    </Tr>
                    <Tr>
                      <Th>Gas使用量</Th>
                      <Td>{parseInt(selectedBlock.gasUsed).toLocaleString()}</Td>
                    </Tr>
                    <Tr>
                      <Th>Gas限制</Th>
                      <Td>{parseInt(selectedBlock.gasLimit).toLocaleString()}</Td>
                    </Tr>
                  </Tbody>
                </Table>
                
                <Heading size="sm" mt={6} mb={3}>交易列表</Heading>
                <Box maxH="300px" overflowY="auto">
                  {selectedBlock.transactions.length > 0 ? (
                    selectedBlock.transactions.map((tx, index) => (
                      <Box key={index} p={2} mb={2} borderWidth="1px" borderRadius="md">
                        <Text fontSize="sm" fontWeight="bold" isTruncated>
                          {typeof tx === 'string' ? tx : tx.hash}
                        </Text>
                        {typeof tx !== 'string' && (
                          <>
                            <Text fontSize="xs">From: {tx.from}</Text>
                            <Text fontSize="xs">To: {tx.to || '(合约创建)'}</Text>
                            <Text fontSize="xs">Value: {parseInt(tx.value) / 1e18} BNB</Text>
                          </>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Text>无交易</Text>
                  )}
                </Box>
              </CardBody>
            </Card>
          </Box>
        )}
      </Flex>
    </Box>
  );