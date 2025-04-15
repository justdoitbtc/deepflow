# BSC链可视化页面 - API服务

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import asyncio
import json
import time
from datetime import datetime

from .blockchain import get_bsc_service

app = FastAPI(title="BSC可视化页面API", description="DeepFlow BSC区块链可视化页面的后端API服务")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该限制为特定域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据模型
class AddressModel(BaseModel):
    address: str = Field(..., description="区块链地址")

class ContractCallModel(BaseModel):
    contract_address: str = Field(..., description="合约地址")
    function_name: str = Field(..., description="函数名称")
    function_args: List[Any] = Field(default=[], description="函数参数")
    abi: List[Dict[str, Any]] = Field(..., description="合约ABI")

class TransactionModel(BaseModel):
    tx_hash: str = Field(..., description="交易哈希")

# 区块相关API
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

@app.get("/api/blocks/{block_number}", response_model=Dict[str, Any])
async def get_block_by_number(block_number: int):
    """通过区块号获取区块信息"""
    try:
        bsc_service = get_bsc_service()
        return bsc_service.get_block_by_number(block_number)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 交易相关API
@app.get("/api/transactions/{tx_hash}", response_model=Dict[str, Any])
async def get_transaction(tx_hash: str):
    """获取交易信息"""
    try:
        bsc_service = get_bsc_service()
        return bsc_service.get_transaction(tx_hash)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/transactions/{tx_hash}/receipt", response_model=Dict[str, Any])
async def get_transaction_receipt(tx_hash: str):
    """获取交易收据"""
    try:
        bsc_service = get_bsc_service()
        return bsc_service.get_transaction_receipt(tx_hash)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 账户相关API
@app.get("/api/accounts/{address}/balance", response_model=Dict[str, Any])
async def get_account_balance(address: str):
    """获取账户余额"""
    try:
        bsc_service = get_bsc_service()
        balance_wei = bsc_service.get_balance(address)
        return {
            "address": address,
            "balance_wei": balance_wei,
            "balance_bnb": balance_wei / 1e18,  # 转换为BNB
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tokens/{token_address}/balances/{wallet_address}", response_model=Dict[str, Any])
async def get_token_balance(token_address: str, wallet_address: str):
    """获取代币余额"""
    try:
        bsc_service = get_bsc_service()
        balance = bsc_service.get_token_balance(token_address, wallet_address)
        return {
            "token_address": token_address,
            "wallet_address": wallet_address,
            "balance": balance,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 合约相关API
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

# 网络统计API
@app.get("/api/stats", response_model=Dict[str, Any])
async def get_bsc_stats():
    """获取BSC网络统计信息"""
    try:
        bsc_service = get_bsc_service()
        stats = bsc_service.get_bsc_stats()
        stats["timestamp"] = datetime.now().isoformat()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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

# 实时Gas价格更新WebSocket
@app.websocket("/ws/gas")
async def websocket_gas(websocket: WebSocket):
    await manager.connect(websocket)
    bsc_service = get_bsc_service()
    
    try:
        while True:
            # 每10秒更新一次Gas价格
            await asyncio.sleep(10)
            gas_price = bsc_service.get_gas_price()
            
            await websocket.send_json({
                "event": "gas_update",
                "data": {
                    "gas_price_wei": gas_price,
                    "gas_price_gwei": gas_price / 1e9,
                    "timestamp": datetime.now().isoformat()
                }
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# 健康检查
@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)