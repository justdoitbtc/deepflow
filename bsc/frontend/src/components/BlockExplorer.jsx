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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
  StatHelpText,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { SearchIcon, ExternalLinkIcon, InfoIcon } from '@chakra-ui/icons';
import { FiClock, FiDatabase, FiHash, FiUser } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { fetchLatestBlocks, fetchBlockByNumber, shortenAddress } from '../services/api';

const BlockExplorer = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [blockLoading, setBlockLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // 获取最新区块
  useEffect(() => {
    const getBlocks = async () => {
      try {
        const latestBlocks = await fetchLatestBlocks(20);
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
  
  // 处理区块搜索
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: '请输入区块号',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const blockNumber = parseInt(searchQuery.trim());
    if (isNaN(blockNumber)) {
      toast({
        title: '请输入有效的区块号',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setBlockLoading(true);
    try {
      const block = await fetchBlockByNumber(blockNumber);
      setSelectedBlock(block);
      setBlockLoading(false);
    } catch (error) {
      console.error('Error fetching block:', error);
      toast({
        title: '获取区块失败',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setBlockLoading(false);
    }
  };
  
  // 处理区块选择
  const handleBlockSelect = async (blockNumber) => {
    setBlockLoading(true);
    try {
      const block = await fetchBlockByNumber(blockNumber);
      setSelectedBlock(block);
      setBlockLoading(false);
    } catch (error) {
      console.error('Error fetching block:', error);
      toast({
        title: '获取区块失败',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setBlockLoading(false);
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
      <Heading mb={6}>区块浏览器</Heading>
      
      {/* 搜索区块 */}
      <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" mb={6}>
        <CardBody>
          <InputGroup size="lg">
            <Input
              placeholder="输入区块号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleSearch} isLoading={blockLoading}>
                <SearchIcon />
              </Button>
            </InputRightElement>
          </InputGroup>
        </CardBody>
      </Card>
      
      <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
        {/* 区块列表 */}
        <Box flex="1" minW={{ base: '100%', lg: '300px' }}>
          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
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
                    borderColor={selectedBlock?.number === block.number ? 'brand.500' : borderColor}
                    bg={selectedBlock?.number === block.number ? 'brand.50' : 'transparent'}
                    _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                    onClick={() => handleBlockSelect(block.number)}
                  >
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Flex align="center">
                          <Badge colorScheme="yellow" mr={2}>#{block.number}</Badge>
                          <Text fontSize="sm" color="gray.500">{formatTimestamp(block.timestamp)}</Text>
                        </Flex>
                        <Text mt={1} fontSize="sm">交易: {block.transactions.length}</Text>
                      </Box>
                      <Box textAlign="right">
                        <Text fontSize="sm">Gas: {formatGas(block.gasUsed)}</Text>
                        <Text fontSize="sm" isTruncated maxW="150px">矿工: {shortenAddress(block.miner)}</Text>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </Box>
            </CardBody>
          </Card>
        </Box>
        
        {/* 区块详情 */}
        <Box flex="2">
          {selectedBlock ? (
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
              <CardHeader>
                <Heading size="md">区块 #{selectedBlock.number} 详情</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
                  <Stat>
                    <StatLabel>区块高度</StatLabel>
                    <StatNumber>{selectedBlock.number}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>时间戳</StatLabel>
                    <StatNumber>{formatTimestamp(selectedBlock.timestamp)}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>交易数</StatLabel>
                    <StatNumber>{selectedBlock.transactions.length}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Gas使用量</StatLabel>
                    <StatNumber>{formatGas(selectedBlock.gasUsed)}</StatNumber>
                  </Stat>
                </SimpleGrid>
                
                <Divider my={4} />
                
                <Box mb={4}>
                  <Flex align="center" mb={2}>
                    <Icon as={FiHash} mr={2} />
                    <Text fontWeight="bold">区块哈希:</Text>
                  </Flex>
                  <Text wordBreak="break-all" pl={6}>{selectedBlock.hash}</Text>
                </Box>
                
                <Box mb={4}>
                  <Flex align="center" mb={2}>
                    <Icon as={FiHash} mr={2} />
                    <Text fontWeight="bold">父区块哈希:</Text>
                  </Flex>
                  <Text wordBreak="break-all" pl={6}>{selectedBlock.parentHash}</Text>
                </Box>
                
                <Box mb={4}>
                  <Flex align="center" mb={2}>
                    <Icon as={FiUser} mr={2} />
                    <Text fontWeight="bold">矿工地址:</Text>
                  </Flex>
                  <Text wordBreak="break-all" pl={6}>{selectedBlock.miner}</Text>
                </Box>
                
                <Divider my={4} />
                
                <Tabs isFitted variant="enclosed">
                  <TabList mb="1em">
                    <Tab>交易 ({selectedBlock.transactions.length})</Tab>
                    <Tab>其他信息</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Box maxH="400px" overflowY="auto">
                        {selectedBlock.transactions.length > 0 ? (
                          <Table variant="simple" size="sm">
                            <Thead>
                              <Tr>
                                <Th>交易哈希</Th>
                                <Th>发送方</Th>
                                <Th>接收方</Th>
                                <Th isNumeric>价值</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {selectedBlock.transactions.map((tx, index) => (
                                <Tr key={index}>
                                  <Td isTruncated maxW="150px">
                                    <Tooltip label={tx.hash}>
                                      <Text>{shortenAddress(tx.hash, 8)}</Text>
                                    </Tooltip>
                                  </Td>
                                  <Td isTruncated maxW="150px">
                                    <Tooltip label={tx.from}>
                                      <Text>{shortenAddress(tx.from)}</Text>
                                    </Tooltip>
                                  </Td>
                                  <Td isTruncated maxW="150px">
                                    <Tooltip label={tx.to || '合约创建'}>
                                      <Text>{tx.to ? shortenAddress(tx.to) : '合约创建'}</Text>
                                    </Tooltip>
                                  </Td>
                                  <Td isNumeric>
                                    {tx.value ? (parseInt(tx.value) / 1e18).toFixed(4) : '0'} BNB
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        ) : (
                          <Text>此区块没有交易</Text>
                        )}
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontWeight="bold">Gas限制:</Text>
                          <Text>{formatGas(selectedBlock.gasLimit)}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">区块大小:</Text>
                          <Text>{parseInt(selectedBlock.size).toLocaleString()} 字节</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">难度:</Text>
                          <Text>{parseInt(selectedBlock.difficulty).toLocaleString()}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Nonce:</Text>
                          <Text>{selectedBlock.nonce}</Text>
                        </Box>
                      </SimpleGrid>
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
                  <Heading size="md" color="gray.500" mb={2}>选择一个区块查看详情</Heading>
                  <Text color="gray.500">从左侧列表选择一个区块，或使用搜索框查找特定区块</Text>
                </Flex>
              </CardBody>
            </Card>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default BlockExplorer;