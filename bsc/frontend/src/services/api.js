// BSC链可视化页面 - API服务

import axios from 'axios';

// API基础URL，可以通过环境变量配置
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// 创建axios实例
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 区块相关API
export const fetchLatestBlock = async () => {
  const response = await api.get('/api/blocks/latest');
  return response.data;
};

export const fetchLatestBlocks = async (count = 10) => {
  const response = await api.get(`/api/blocks/latest/${count}`);
  return response.data;
};

export const fetchBlockByNumber = async (blockNumber) => {
  const response = await api.get(`/api/blocks/${blockNumber}`);
  return response.data;
};

// 交易相关API
export const fetchLatestTransactions = async (count = 10) => {
  const response = await api.get(`/api/transactions/latest/${count}`);
  return response.data;
};

export const fetchTransaction = async (txHash) => {
  const response = await api.get(`/api/transactions/${txHash}`);
  return response.data;
};

export const fetchTransactionReceipt = async (txHash) => {
  const response = await api.get(`/api/transactions/${txHash}/receipt`);
  return response.data;
};

// 账户相关API
export const fetchAccountBalance = async (address) => {
  const response = await api.get(`/api/accounts/${address}/balance`);
  return response.data;
};

export const fetchTokenBalance = async (tokenAddress, walletAddress) => {
  const response = await api.get(`/api/tokens/${tokenAddress}/balances/${walletAddress}`);
  return response.data;
};

// 合约相关API
export const callContract = async (contractCall) => {
  const response = await api.post('/api/contracts/call', contractCall);
  return response.data;
};

// 网络统计API
export const fetchBSCStats = async () => {
  const response = await api.get('/api/stats');
  return response.data;
};

// WebSocket连接
export const createBlocksWebSocket = () => {
  return new WebSocket(`ws://${API_URL.replace('http://', '')}/ws/blocks`);
};

export const createGasWebSocket = () => {
  return new WebSocket(`ws://${API_URL.replace('http://', '')}/ws/gas`);
};

// 工具函数
export const formatWei = (wei, decimals = 18) => {
  if (!wei) return '0';
  return (parseInt(wei) / Math.pow(10, decimals)).toFixed(decimals);
};

export const shortenAddress = (address, chars = 4) => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

export default api;