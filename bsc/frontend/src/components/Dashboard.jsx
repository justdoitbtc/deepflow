import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  SimpleGrid, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  Card, 
  CardHeader, 
  CardBody,
  Flex,
  Text,
  Icon,
  Spinner,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { FiClock, FiDatabase, FiDollarSign, FiActivity } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

// 导入服务
import { API_URL } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [gasHistory, setGasHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // 获取BSC网络统计信息
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/stats`);
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('无法获取网络统计信息');
      }
    };
    
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // 每30秒更新一次
    
    return () => clearInterval(interval);
  }, []);
  
  // 获取最新区块
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/blocks/latest/10`);
        setBlocks(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blocks:', err);
        setError('无法获取最新区块');
        setLoading(false);
      }
    };
    
    fetchBlocks();
    const interval = setInterval(fetchBlocks, 15000); // 每15秒更新一次
    
    return () => clearInterval(interval);
  }, []);
  
  // 模拟Gas价格历史数据
  useEffect(() => {
    // 在实际应用中，这应该从API获取
    const mockGasHistory = [];
    const now = Date.now();
    for (let i = 0; i < 24; i++) {
      mockGasHistory.push({
        time: new Date(now - (23 - i) * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: 5 + Math.random() * 3 // 模拟5-8 Gwei的波动
      });
    }
    setGasHistory(mockGasHistory);
  }, []);
  
  // 连接WebSocket获取实时Gas价格更新
  useEffect(() => {
    const ws = new WebSocket(`ws://${API_URL.replace('http://', '')}/ws/gas`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === 'gas_update') {
        setGasHistory(prev => {
          const newHistory = [...prev];
          if (newHistory.length >= 24) {
            newHistory.shift(); // 移除最旧的数据点
          }
          newHistory.push({
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            price: data.data.gas_price_gwei
          });
          return newHistory;
        });
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return () => {
      ws.close();
    };
  }, []);
  
  if (loading) {
    return (
      <Flex justify="center" align="center" height="50vh">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }
  
  if (error) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Heading as="h2" size="xl" color="red.500">
          错误
        </Heading>
        <Text mt={4} mb={8}>
          {error}
        </Text>
      </Box>
    );
  }
  
  return (
    <Box>
      <Heading mb={6}>BSC网络概览</Heading>
      
      {/* 网络统计卡片 */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
          <CardBody>
            <Flex align="center">
              <Box p={2} bg="brand.100" borderRadius="md" mr={4}>
                <Icon as={FiDatabase} color="brand.500" boxSize={6} />
              </Box>
              <Stat>
                <StatLabel>最新区块</StatLabel>
                <StatNumber>{stats?.latest_block_number.toLocaleString()}</StatNumber>
                <StatHelpText>
                  {new Date(stats?.latest_block_timestamp * 1000).toLocaleString()}
                </StatHelpText>
              </Stat>
            </Flex>
          </CardBody>
        </Card>
        
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
          <CardBody>
            <Flex align="center">
              <Box p={2} bg="blue.100" borderRadius="md" mr={4}>
                <Icon as={FiClock} color="blue.500" boxSize={6} />
              </Box>
              <Stat>
                <StatLabel>平均区块时间</StatLabel>
                <StatNumber>{stats?.avg_block_time.toFixed(2)} 秒</StatNumber>
                <StatHelpText>
                  基于最近10个区块
                </StatHelpText>
              </Stat>
            </Flex>
          </CardBody>
        </Card>
        
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
          <CardBody>
            <Flex align="center">
              <Box p={2} bg="green.100" borderRadius="md" mr={4}>
                <Icon as={FiDollarSign} color="green.500" boxSize={6} />
              </Box>
              <Stat>
                <StatLabel>Gas价格</StatLabel>
                <StatNumber>{stats?.gas_price_gwei.toFixed(2)} Gwei</StatNumber>
                <StatHelpText>
                  {new Date().toLocaleTimeString()}
                </StatHelpText>
              </Stat>
            </Flex>
          </CardBody>
        </Card>
        
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
          <CardBody>
            <Flex align="center">
              <Box p={2} bg="purple.100" borderRadius="md" mr={4}>
                <Icon as={FiActivity} color="purple.500" boxSize={6} />
              </Box>
              <Stat>
                <StatLabel>最新区块交易数</StatLabel>
                <StatNumber>{stats?.latest_block_tx_count}</StatNumber>
                <StatHelpText>
                  区块 #{stats?.latest_block_number}
                </StatHelpText>
              </Stat>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* Gas价格趋势图 */}
      <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden" mb={8}>
        <CardHeader>
          <Heading size="md">Gas价格趋势 (24小时)</Heading>
        </CardHeader>
        <CardBody>
          <Box height="300px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gasHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#F0B90B" strokeWidth={2} name="Gas价格 (Gwei)" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardBody>
      </Card>
      
      {/* 最新区块列表 */}
      <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
        <CardHeader>
          <Heading size="md">最新区块</Heading>
        </CardHeader>
        <CardBody>
          <Box overflowX="auto">
            <Box as="table" width="100%" style={{ borderCollapse: 'collapse' }}>
              <Box as="thead" bg="gray.50">
                <Box as="tr">
                  <Box as="th" px={4} py={2} textAlign="left">区块高度</Box>
                  <Box as="th" px={4} py={2} textAlign="left">时间</Box>
                  <Box as="th" px={4} py={2} textAlign="left">交易数</Box>
                  <Box as="th" px={4} py={2} textAlign="left">Gas使用量</Box>
                  <Box as="th" px={4} py={2} textAlign="left">矿工</Box>
                </Box>
              </Box>
              <Box as="tbody">
                {blocks.map((block) => (
                  <Box as="tr" key={block.number} _hover={{ bg: 'gray.50' }}>
                    <Box as="td" px={4} py={3} borderTopWidth="1px" borderColor={borderColor}>
                      <Badge colorScheme="yellow">{block.number}</Badge>
                    </Box>
                    <Box as="td" px={4} py={3} borderTopWidth="1px" borderColor={borderColor}>
                      {new Date(block.timestamp * 1000).toLocaleString()}
                    </Box>
                    <Box as="td" px={4} py={3} borderTopWidth="1px" borderColor={borderColor}>
                      {block.transactions.length}
                    </Box>
                    <Box as="td" px={4} py={3} borderTopWidth="1px" borderColor={borderColor}>
                      {parseInt(block.gasUsed).toLocaleString()}
                    </Box>
                    <Box as="td" px={4} py={3} borderTopWidth="1px" borderColor={borderColor}>
                      <Text isTruncated maxW="200px">{block.miner}</Text>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Dashboard;