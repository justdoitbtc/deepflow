# BSC链可视化页面 - 区块链交互模块

from deepflow.web3 import Web3Agent
from deepflow.tools import BlockchainTool
from deepflow.models import get_model
import asyncio
import time
from typing import Dict, List, Any, Optional

class BSCBlockchainService:
    """BSC区块链服务，提供与BSC链交互的核心功能"""
    
    def __init__(self, provider_url: str = "https://bsc-dataseed.binance.org/", chain_id: int = 56):
        """初始化BSC区块链服务
        
        Args:
            provider_url: BSC节点URL
            chain_id: 链ID (56为BSC主网)
        """
        # 初始化模型
        model = get_model("gpt-4")
        
        # 创建BSC区块链工具
        self.blockchain_tool = BlockchainTool(
            provider_url=provider_url,
            chain_id=chain_id
        )
        
        # 创建Web3智能体
        self.agent = Web3Agent(
            tools=[self.blockchain_tool],
            model=model
        )
        
        # 缓存
        self._block_cache = {}
        self._tx_cache = {}
    
    def get_latest_block(self) -> Dict[str, Any]:
        """获取最新区块信息"""
        block = self.blockchain_tool.get_latest_block()
        self._block_cache[block['number']] = block
        return block
    
    def get_block_by_number(self, block_number: int) -> Dict[str, Any]:
        """通过区块号获取区块信息"""
        if block_number in self._block_cache:
            return self._block_cache[block_number]
        
        block = self.blockchain_tool.w3.eth.get_block(block_number, full_transactions=True)
        block_dict = dict(block)
        # 转换bytes类型为十六进制字符串
        for key, value in block_dict.items():
            if isinstance(value, bytes):
                block_dict[key] = value.hex()
        
        self._block_cache[block_number] = block_dict
        return block_dict
    
    def get_latest_blocks(self, count: int = 10) -> List[Dict[str, Any]]:
        """获取最新的多个区块
        
        Args:
            count: 要获取的区块数量
            
        Returns:
            区块列表，按区块号降序排列
        """
        latest_block = self.get_latest_block()
        latest_number = latest_block['number']
        
        blocks = []
        for i in range(count):
            block_number = latest_number - i
            if block_number < 0:
                break
            blocks.append(self.get_block_by_number(block_number))
        
        return blocks
    
    def get_transaction(self, tx_hash: str) -> Dict[str, Any]:
        """获取交易信息"""
        if tx_hash in self._tx_cache:
            return self._tx_cache[tx_hash]
        
        tx = self.blockchain_tool.get_transaction(tx_hash)
        self._tx_cache[tx_hash] = tx
        return tx
    
    def get_transaction_receipt(self, tx_hash: str) -> Dict[str, Any]:
        """获取交易收据"""
        return self.blockchain_tool.wait_for_transaction_receipt(tx_hash)
    
    def get_balance(self, address: str) -> int:
        """获取账户余额（单位：wei）"""
        return self.blockchain_tool.get_balance(address)
    
    def get_token_balance(self, token_address: str, wallet_address: str) -> int:
        """获取ERC20代币余额
        
        Args:
            token_address: 代币合约地址
            wallet_address: 钱包地址
            
        Returns:
            代币余额
        """
        # ERC20标准的balanceOf ABI
        abi = [
            {
                "constant": True,
                "inputs": [{"name": "_owner", "type": "address"}],
                "name": "balanceOf",
                "outputs": [{"name": "balance", "type": "uint256"}],
                "type": "function"
            }
        ]
        
        return self.blockchain_tool.call_contract(
            contract_address=token_address,
            abi=abi,
            function_name="balanceOf",
            function_args=[wallet_address]
        )
    
    def get_gas_price(self) -> int:
        """获取当前Gas价格（单位：wei）"""
        return self.blockchain_tool.get_gas_price()
    
    def call_contract(self, contract_address: str, abi: List[Dict], 
                     function_name: str, function_args: Optional[List] = None) -> Any:
        """调用合约方法（读取状态）
        
        Args:
            contract_address: 合约地址
            abi: 合约ABI
            function_name: 函数名
            function_args: 函数参数列表
            
        Returns:
            函数返回值
        """
        if function_args is None:
            function_args = []
            
        return self.blockchain_tool.call_contract(
            contract_address=contract_address,
            abi=abi,
            function_name=function_name,
            function_args=function_args
        )
    
    def send_contract_transaction(self, contract_address: str, abi: List[Dict],
                                 function_name: str, function_args: List,
                                 from_address: str, private_key: str) -> str:
        """发送合约交易（修改状态）
        
        Args:
            contract_address: 合约地址
            abi: 合约ABI
            function_name: 函数名
            function_args: 函数参数列表
            from_address: 发送地址
            private_key: 私钥
            
        Returns:
            交易哈希
        """
        return self.blockchain_tool.send_contract_transaction(
            contract_address=contract_address,
            abi=abi,
            function_name=function_name,
            function_args=function_args,
            from_address=from_address,
            private_key=private_key
        )
    
    def get_bsc_stats(self) -> Dict[str, Any]:
        """获取BSC网络统计信息
        
        Returns:
            包含网络统计信息的字典
        """
        latest_block = self.get_latest_block()
        gas_price = self.get_gas_price()
        
        # 计算平均区块时间
        blocks = self.get_latest_blocks(10)
        timestamps = [block['timestamp'] for block in blocks]
        avg_block_time = sum([timestamps[i] - timestamps[i+1] for i in range(len(timestamps)-1)]) / (len(timestamps)-1)
        
        return {
            "latest_block_number": latest_block['number'],
            "latest_block_timestamp": latest_block['timestamp'],
            "latest_block_tx_count": len(latest_block['transactions']),
            "gas_price_gwei": gas_price / 1e9,  # 转换为Gwei
            "avg_block_time": avg_block_time
        }

# 单例模式实例
_bsc_service = None

def get_bsc_service(provider_url: str = "https://bsc-dataseed.binance.org/", chain_id: int = 56) -> BSCBlockchainService:
    """获取BSC服务单例"""
    global _bsc_service
    if _bsc_service is None:
        _bsc_service = BSCBlockchainService(provider_url, chain_id)
    return _bsc_service