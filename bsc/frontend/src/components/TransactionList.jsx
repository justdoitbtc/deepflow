import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Spinner,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Card,
  CardHeader,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Link,
  useColorModeValue,
  useToast,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
  Tooltip,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { SearchIcon, ExternalLinkIcon, InfoIcon } from '@chakra-ui/icons';
import { FiClock, FiDatabase, FiHash, FiUser, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { fetchTransaction, fetchTransactionReceipt, fetchLatestTransactions, shortenAddress } from '../services/api';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // 获取最新交易
  useEffect(() => {
    const getTransactions = async () => {
      try {
        const latestTxs = await fetchLatestTransactions(20);
        setTransactions(latestTxs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('无法获取交易数据');
        setLoading(false);
      }
    };
    
    getTransactions();
    const interval = setInterval(getTransactions, 15000); // 每15秒更新一次
    
    return () => clearInterval(interval);
  }, []);
  
  // 处理交易搜索
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: '请输入交易哈希',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // 验证交易哈希格式
    const txHashRegex = /^0x([A-Fa-f0-9]{64})$/;
    if (!txHashRegex.test(searchQuery.trim())) {
      toast({
        title: '请输入有效的交易哈希',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setTxLoading(true);
    try {
      const tx = await fetchTransaction(searchQuery.trim());
      setSelectedTx(tx);
      
      // 获取交易收据
      try {
        const receipt = await fetchTransactionReceipt(searchQuery.trim());
        setTxReceipt(receipt);
      } catch (receiptError) {
        console.error('Error fetching transaction receipt:', receiptError);
        setTxReceipt(null);
      }
      
      setTxLoading(false);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      toast({
        title: '获取交易失败',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setTxLoading(false);
    }
  };
  
  // 处理交易选择
  const handleTxSelect = async (txHash) => {
    setTxLoading(true);
    try {
      const tx = await fetchTransaction(txHash);
      setSelectedTx(tx);
      
      // 获取交易收据
      try {
        const receipt = await fetchTransactionReceipt(txHash);
        setTxReceipt(receipt);
      } catch (receiptError) {
        console.error('Error fetching transaction receipt:', receiptError);
        setTxReceipt(null);
      }
      
      setTxLoading(false);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      toast({
        title: '获取交易失败',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setTxLoading(false);
    }
  };
  
  // 格式化时间戳
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };
  
  // 格式化Gas
  const formatGas = (gas) => {
    return parseInt(gas).toLocaleString();
  };
  
  // 格式化交易状态
  const formatTxStatus = (status) => {
    if (status === 1 || status === true) {
      return <Badge colorScheme="green">成功</Badge>;
    } else if (status === 0 || status === false) {
      return <Badge colorScheme="red">失败</Badge>;
    } else {
      return <Badge colorScheme="yellow">待确认</Badge>;
    }
  };
  
  // 格式化交易类型
  const formatTxType = (tx) => {
    if (!tx.to) {
      return <Badge colorScheme="purple">合约创建</Badge>;
    } else if (tx.input && tx.input !== '0x') {
      return <Badge colorScheme="blue">合约调用</Badge>;
    } else {
      return <Badge colorScheme="gray">转账</Badge>;
    }
  };
  
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
      <Heading mb={6}>交易浏览器</Heading>
      
      {/* 搜索交易 */}
      <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" mb={6}>
        <CardBody>
          <InputGroup size="lg">
            <Input
              placeholder="输入交易哈希..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleSearch} isLoading={txLoading}>
                <SearchIcon />
              </Button>
            </InputRightElement>
          </InputGroup>
        </CardBody>
      </Card>
      
      <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
        {/* 交易列表 */}
        <Box flex="1" minW={{ base: '100%', lg: '300px' }}>
          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
            <CardHeader>
              <Heading size="md">最新交易</Heading>
            </CardHeader>
            <CardBody>
              <Box maxH="600px" overflowY="auto">
                {transactions.map((tx) => (
                  <Box 
                    key={tx.hash}
                    p={3}
                    mb={2}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={selectedTx?.hash === tx.hash ? 'brand.500' : borderColor}
                    bg={selectedTx?.hash === tx.hash ? 'brand.50' : 'transparent'}
                    _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                    onClick={() => handleTxSelect(tx.hash)}
                  >
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Flex align="center">
                          <Text fontSize="sm" isTruncated maxW="150px">
                            <Tooltip label={tx.hash}>
                              <Text>{shortenAddress(tx.hash, 8)}</Text>
                            </Tooltip>
                          </Text>
                          <Box ml={2}>{formatTxType(tx)}</Box>
                        </Flex>
                        <Text mt={1} fontSize="sm">{formatTimestamp(tx.timestamp || tx.blockTimestamp)}</Text>
                      </Box>
                      <Box textAlign="right">
                        <Flex align="center">
                          <Text fontSize="sm" mr={2}>
                            {tx.from ? shortenAddress(tx.from) : 'N/A'}
                          </Text>
                          <Icon as={FiArrowRight} boxSize={3} />
                          <Text fontSize="sm" ml={2}>
                            {tx.to ? shortenAddress(tx.to) : '合约创建'}
                          </Text>
                        </Flex>
                        <Text fontSize="sm">
                          {tx.value ? (parseInt(tx.value) / 1e18).toFixed(4) : '0'} BNB
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </Box>
            </CardBody>
          </Card>
        </Box>
        
        {/* 交易详情 */}
        <Box flex="2">
          {selectedTx ? (
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
              <CardHeader>
                <Heading size="md">交易详情</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
                  <Stat>
                    <StatLabel>交易状态</StatLabel>
                    <StatNumber>{formatTxStatus(txReceipt?.status)}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>区块高度</StatLabel>
                    <StatNumber>{selectedTx.blockNumber}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>时间戳</StatLabel>
                    <StatNumber>{formatTimestamp(selectedTx.timestamp || selectedTx.blockTimestamp)}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>交易类型</StatLabel>
                    <StatNumber>{formatTxType(selectedTx)}</StatNumber>
                  </Stat>
                </SimpleGrid>
                
                <Divider my={4} />
                
                <Box mb={4}>
                  <Flex align="center" mb={2}>
                    <Icon as={FiHash} mr={2} />
                    <Text fontWeight="bold">交易哈希:</Text>
                  </Flex>
                  <Text wordBreak="break-all" pl={6}>{selectedTx.hash}</Text>
                </Box>
                
                <Box mb={4}>
                  <Flex align="center" mb={2}>
                    <Icon as={FiUser} mr={2} />
                    <Text fontWeight="bold">发送方:</Text>
                  </Flex>
                  <Text wordBreak="break-all" pl={6}>{selectedTx.from}</Text>
                </Box>
                
                <Box mb={4}>
                  <Flex align="center" mb={2}>
                    <Icon as={FiUser} mr={2} />
                    <Text fontWeight="bold">接收方:</Text>
                  </Flex>
                  <Text wordBreak="break-all" pl={6}>{selectedTx.to || '合约创建'}</Text>
                </Box>
                
                <Box mb={4}>
                  <Flex align="center" mb={2}>
                    <Icon as={FiDollarSign} mr={2} />
                    <Text fontWeight="bold">价值:</Text>
                  </Flex>
                  <Text pl={6}>{(parseInt(selectedTx.value) / 1e18).toFixed(8)} BNB</Text>
                </Box>
                
                <Divider my={4} />
                
                <Tabs isFitted variant="enclosed">
                  <TabList mb="1em">
                    <Tab>交易详情</Tab>
                    <Tab>收据信息</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontWeight="bold">Gas价格:</Text>
                          <Text>{(parseInt(selectedTx.gasPrice) / 1e9).toFixed(2)} Gwei</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Gas限制:</Text>
                          <Text>{formatGas(selectedTx.gas)}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Nonce:</Text>
                          <Text>{selectedTx.nonce}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">输入数据:</Text>
                          <Text isTruncated maxW="100%">
                            <Tooltip label={selectedTx.input}>
                              <Text>{selectedTx.input.length > 66 ? `${selectedTx.input.substring(0, 66)}...` : selectedTx.input}</Text>
                            </Tooltip>
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </TabPanel>
                    <TabPanel>
                      {txReceipt ? (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Box>
                            <Text fontWeight="bold">交易状态:</Text>
                            <Text>{formatTxStatus(txReceipt.status)}</Text>
                          </Box>
                          <Box>
                            <Text fontWeight="bold">Gas使用量:</Text>
                            <Text>{formatGas(txReceipt.gasUsed)}</Text>
                          </Box>
                          <Box>
                            <Text fontWeight="bold">累计Gas使用量:</Text>
                            <Text>{formatGas(txReceipt.cumulativeGasUsed)}</Text>
                          </Box>
                          <Box>
                            <Text fontWeight="bold">合约地址:</Text>
                            <Text>{txReceipt.contractAddress || '无'}</Text>
                          </Box>
                          <Box gridColumn="span 2">
                            <Text fontWeight="bold" mb={2}>日志事件:</Text>
                            {txReceipt.logs && txReceipt.logs.length > 0 ? (
                              <Box maxH="200px" overflowY="auto" borderWidth="1px" borderRadius="md" p={2}>
                                {txReceipt.logs.map((log, index) => (
                                  <Box key={index} mb={2} p={2} borderWidth="1px" borderRadius="md">
                                    <Text fontSize="sm">地址: {shortenAddress(log.address)}</Text>
                                    <Text fontSize="sm">主题: {log.topics.length}</Text>
                                    <Text fontSize="sm" isTruncated>数据: {log.data.substring(0, 40)}...</Text>
                                  </Box>
                                ))}
                              </Box>
                            ) : (
                              <Text>无日志事件</Text>
                            )}
                          </Box>
                        </SimpleGrid>
                      ) : (
                        <Flex justify="center" align="center" height="100px">
                          <Text>收据信息不可用</Text>
                        </Flex>
                      )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          ) : (
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
              <CardBody>
                <Flex direction="column" align="center" justify="center" py={10}>
                  <Icon as={FiDatabase} boxSize={12} color="gray.400" mb={4} />
                  <Heading size="md" color="gray.500" mb={2}>选择一个交易查看详情</Heading>
                  <Text color="gray.500">从左侧列表选择一个交易，或使用搜索框查找特定交易</Text>
                </Flex>
              </CardBody>
            </Card>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default TransactionList;