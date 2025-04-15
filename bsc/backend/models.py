# BSC链可视化页面 - 数据模型

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

# 区块相关模型
class Block(BaseModel):
    """区块数据模型"""
    number: int = Field(..., description="区块高度")
    hash: str = Field(..., description="区块哈希")
    parentHash: str = Field(..., description="父区块哈希")
    timestamp: int = Field(..., description="区块时间戳")
    transactions: List[Any] = Field(..., description="交易列表")
    miner: str = Field(..., description="矿工地址")
    gasUsed: int = Field(..., description="Gas使用量")
    gasLimit: int = Field(..., description="Gas限制")
    size: int = Field(..., description="区块大小(字节)")
    
    def formatted_timestamp(self) -> str:
        """格式化时间戳为可读格式"""
        return datetime.fromtimestamp(self.timestamp).strftime('%Y-%m-%d %H:%M:%S')

# 交易相关模型
class Transaction(BaseModel):
    """交易数据模型"""
    hash: str = Field(..., description="交易哈希")
    blockNumber: int = Field(..., description="区块高度")
    from_address: str = Field(..., alias="from", description="发送地址")
    to: Optional[str] = Field(None, description="接收地址")
    value: int = Field(..., description="交易金额(wei)")
    gas: int = Field(..., description="Gas限制")
    gasPrice: int = Field(..., description="Gas价格(wei)")
    input: str = Field(..., description="输入数据")
    nonce: int = Field(..., description="交易序号")
    
    def value_in_bnb(self) -> float:
        """将wei转换为BNB"""
        return self.value / 1e18
    
    def gas_price_in_gwei(self) -> float:
        """将wei转换为Gwei"""
        return self.gasPrice / 1e9

# 交易收据模型
class TransactionReceipt(BaseModel):
    """交易收据数据模型"""
    transactionHash: str = Field(..., description="交易哈希")
    blockNumber: int = Field(..., description="区块高度")
    gasUsed: int = Field(..., description="Gas使用量")
    status: int = Field(..., description="交易状态(1成功,0失败)")
    logs: List[Dict[str, Any]] = Field(..., description="日志列表")
    contractAddress: Optional[str] = Field(None, description="创建的合约地址")

# 账户相关模型
class AccountBalance(BaseModel):
    """账户余额数据模型"""
    address: str = Field(..., description="账户地址")
    balance_wei: int = Field(..., description="余额(wei)")
    balance_bnb: float = Field(..., description="余额(BNB)")
    timestamp: str = Field(..., description="查询时间")

# 代币相关模型
class TokenBalance(BaseModel):
    """代币余额数据模型"""
    token_address: str = Field(..., description="代币合约地址")
    wallet_address: str = Field(..., description="钱包地址")
    balance: int = Field(..., description="代币余额")
    timestamp: str = Field(..., description="查询时间")

# 合约相关模型
class ContractCall(BaseModel):
    """合约调用数据模型"""
    contract_address: str = Field(..., description="合约地址")
    function_name: str = Field(..., description="函数名称")
    function_args: List[Any] = Field(default=[], description="函数参数")
    abi: List[Dict[str, Any]] = Field(..., description="合约ABI")

class ContractCallResult(BaseModel):
    """合约调用结果数据模型"""
    contract_address: str = Field(..., description="合约地址")
    function_name: str = Field(..., description="函数名称")
    result: Any = Field(..., description="调用结果")
    timestamp: str = Field(..., description="调用时间")

# 网络统计模型
class BSCStats(BaseModel):
    """BSC网络统计数据模型"""
    latest_block_number: int = Field(..., description="最新区块高度")
    latest_block_timestamp: int = Field(..., description="最新区块时间戳")
    latest_block_tx_count: int = Field(..., description="最新区块交易数")
    gas_price_gwei: float = Field(..., description="当前Gas价格(Gwei)")
    avg_block_time: float = Field(..., description="平均区块时间(秒)")
    timestamp: str = Field(..., description="统计时间")
    
    def formatted_block_timestamp(self) -> str:
        """格式化区块时间戳为可读格式"""
        return datetime.fromtimestamp(self.latest_block_timestamp).strftime('%Y-%m-%d %H:%M:%S')

# WebSocket事件模型
class WebSocketEvent(BaseModel):
    """WebSocket事件数据模型"""
    event: str = Field(..., description="事件类型")
    data: Dict[str, Any] = Field(..., description="事件数据")