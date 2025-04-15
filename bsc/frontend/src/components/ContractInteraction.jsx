import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  Card,
  CardHeader,
  CardBody,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
  Tooltip,
  useColorModeValue,
  useToast,
  Spinner,
  Badge,
  Code,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { FiCode, FiDatabase, FiHash, FiUser, FiDollarSign, FiArrowRight, FiWifi, FiSend, FiFileText } from 'react-icons/fi';
import { callContract, shortenAddress } from '../services/api';

const ContractInteraction = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [contractAddress, setContractAddress] = useState('');
  const [contractABI, setContractABI] = useState('');
  const [contractFunctions, setContractFunctions] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [functionInputs, setFunctionInputs] = useState([]);
  const [functionResult, setFunctionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedContracts, setSavedContracts] = useState([]);
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // 检查是否安装了MetaMask
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        try {
          // 检查是否已连接
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
          
          // 监听账户变化
          window.ethereum.on('accountsChanged', handleAccountsChanged);
        } catch (error) {
          console.error('检查钱包连接失败:', error);
        }
      }
    };
    
    checkWalletConnection();
    
    // 从本地存储加载保存的合约
    const loadSavedContracts = () => {
      const saved = localStorage.getItem('savedContracts');
      if (saved) {
        try {
          setSavedContracts(JSON.parse(saved));
        } catch (error) {
          console.error('加载保存的合约失败:', error);
        }
      }
    };
    
    loadSavedContracts();
    
    return () => {
      // 移除事件监听器
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);
  
  // 处理账户变化
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // 用户断开了钱包连接
      setIsConnected(false);
      setAccount(null);
      toast({
        title: '钱包已断开',
        description: '您的钱包连接已断开',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    } else {
      // 用户切换了账户
      setAccount(accounts[0]);
      setIsConnected(true);
      toast({
        title: '账户已切换',
        description: `当前账户: ${shortenAddress(accounts[0])}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // 连接MetaMask钱包
  const connectWallet = async () => {
    if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
      setError('请安装MetaMask钱包');
      toast({
        title: '未检测到钱包',
        description: '请安装MetaMask钱包后再试',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // 请求用户授权连接钱包
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        
        toast({
          title: '钱包已连接',
          description: `已连接到账户: ${shortenAddress(accounts[0])}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('连接钱包失败:', error);
      setError('连接钱包失败');
      toast({
        title: '连接失败',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 解析ABI
  const parseABI = () => {
    if (!contractABI.trim()) {
      toast({
        title: '请输入合约ABI',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      const abiArray = JSON.parse(contractABI);
      
      // 提取函数
      const functions = abiArray.filter(item => 
        item.type === 'function'
      );
      
      setContractFunctions(functions);
      setSelectedFunction(null);
      setFunctionInputs([]);
      setFunctionResult(null);
      
      toast({
        title: 'ABI解析成功',
        description: `找到 ${functions.length} 个函数`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('解析ABI失败:', error);
      toast({
        title: '解析ABI失败',
        description: '请确保输入的是有效的JSON格式',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // 选择函数
  const handleFunctionSelect = (func) => {
    setSelectedFunction(func);
    
    // 初始化输入值
    if (func.inputs && func.inputs.length > 0) {
      const initialInputs = func.inputs.map(input => ({
        name: input.name,
        type: input.type,
        value: ''
      }));
      setFunctionInputs(initialInputs);
    } else {
      setFunctionInputs([]);
    }
    
    setFunctionResult(null);
  };
  
  // 更新输入值
  const handleInputChange = (index, value) => {
    const updatedInputs = [...functionInputs];
    updatedInputs[index].value = value;
    setFunctionInputs(updatedInputs);
  };
  
  // 调用合约函数
  const callContractFunction = async () => {
    if (!isConnected) {
      toast({
        title: '未连接钱包',
        description: '请先连接钱包',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (!contractAddress.trim()) {
      toast({
        title: '请输入合约地址',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (!selectedFunction) {
      toast({
        title: '请选择要调用的函数',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // 验证所有必填输入
    const missingInputs = functionInputs.filter(input => input.value === '');
    if (missingInputs.length > 0) {
      toast({
        title: '请填写所有输入参数',
        description: `缺少参数: ${missingInputs.map(i => i.name).join(', ')}`,
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // 准备参数
      const params = functionInputs.map(input => input.value);
      
      // 在实际应用中，这里应该使用web3.js或ethers.js调用合约
      // 这里我们模拟调用
      const contractCall = {
        address: contractAddress.trim(),
        method: selectedFunction.name,
        params: params,
        from: account
      };
      
      // 模拟调用结果
      let result;
      if (selectedFunction.stateMutability === 'view' || selectedFunction.constant) {
        // 模拟读取函数
        result = `0x${Math.floor(Math.random() * 1000000).toString(16)}`;
      } else {
        // 模拟写入函数（交易）
        result = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      }
      
      setFunctionResult({
        success: true,
        data: result,
        timestamp: Date.now()
      });
      
      toast({
        title: '调用成功',
        description: selectedFunction.stateMutability === 'view' || selectedFunction.constant 
          ? '函数调用成功' 
          : '交易已提交',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('调用合约失败:', error);
      setFunctionResult({
        success: false,
        error: error.message,
        timestamp: Date.now()
      });
      
      toast({
        title: '调用失败',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 保存合约
  const saveContract = () => {
    if (!contractAddress.trim() || !contractABI.trim()) {
      toast({
        title: '无法保存',
        description: '请输入合约地址和ABI',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // 检查是否已存在
    const exists = savedContracts.some(c => c.address === contractAddress.trim());
    if (exists) {
      toast({
        title: '合约已存在',
        description: '此合约地址已保存',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // 创建新的保存合约
    const newContract = {
      address: contractAddress.trim(),
      abi: contractABI.trim(),
      name: `合约 ${savedContracts.length + 1}`,
      timestamp: Date.now()
    };
    
    const updatedContracts = [...savedContracts, newContract];
    setSavedContracts(updatedContracts);
    
    // 保存到本地存储
    localStorage.setItem('savedContracts', JSON.stringify(updatedContracts));
    
    toast({
      title: '合约已保存',
      description: '您可以在已保存合约列表中找到它',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // 加载保存的合约
  const loadContract = (contract) => {
    setContractAddress(contract.address);
    setContractABI(contract.abi);
    
    // 解析ABI
    try {
      const abiArray = JSON.parse(contract.abi);
      
      // 提取函数
      const functions = abiArray.filter(item => 
        item.type === 'function'
      );
      
      setContractFunctions(functions);
      setSelectedFunction(null);
      setFunctionInputs([]);
      setFunctionResult(null);
      
      toast({
        title: '合约已加载',
        description: `找到 ${functions.length} 个函数`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('解析ABI失败:', error);
      toast({
        title: '解析ABI失败',
        description: '保存的ABI格式无效',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // 删除保存的合约
  const deleteContract = (address) => {
    const updatedContracts = savedContracts.filter(c => c.address !== address);
    setSavedContracts(updatedContracts);
    
    // 更新本地存储
    localStorage.setItem('savedContracts', JSON.stringify(updatedContracts));
    
    toast({
      title: '合约已删除',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // 格式化时间戳
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  
  return (
    <Box>
      <Heading mb={6}>合约交互</Heading>
      
      {/* 钱包连接状态 */}
      <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden" mb={6}>
        <CardBody>
          <Flex justify="space-between" align="center">
            <Box>
              {isConnected ? (
                <Flex align="center">
                  <Badge colorScheme="green" mr={2}>已连接</Badge>
                  <Text>账户: {shortenAddress(account)}</Text>
                </Flex>
              ) : (
                <Text>未连接钱包</Text>
              )}
            </Box>
            
            {!isConnected && (
              <Button
                colorScheme="brand"
                onClick={connectWallet}
                isLoading={isLoading}
                loadingText="连接中"
                size="sm"
              >
                连接钱包
              </Button>
            )}
          </Flex>
        </CardBody>
      </Card>
      
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* 合约输入区域 */}
        <Box>
          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden" mb={6}>
            <CardHeader>
              <Heading size="md">合约信息</Heading>
            </CardHeader>
            <CardBody>
              <FormControl mb={4}>
                <FormLabel>合约地址</FormLabel>
                <Input
                  placeholder="输入合约地址..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                />
              </FormControl>
              
              <FormControl mb={4}>
                <FormLabel>合约ABI</FormLabel>
                <Textarea
                  placeholder="粘贴合约ABI JSON..."
                  value={contractABI}
                  onChange={(e) => setContractABI(e.target.value)}
                  minH="200px"
                />
              </FormControl>
              
              <Flex justify="space-between">
                <Button
                  colorScheme="brand"
                  onClick={parseABI}
                  isDisabled={!contractABI.trim()}
                >
                  解析ABI
                </Button>
                
                <Button
                  colorScheme="green"
                  onClick={saveContract}
                  isDisabled={!contractAddress.trim() || !contractABI.trim()}
                >
                  保存合约
                </Button>
              </Flex>
            </CardBody>
          </Card>
          
          {/* 已保存的合约 */}
          {savedContracts.length > 0 && (
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
              <CardHeader>
                <Heading size="md">已保存的合约</Heading>
              </CardHeader>
              <CardBody>
                <Box maxH="300px" overflowY="auto">
                  {savedContracts.map((contract, index) => (
                    <Box
                      key={index}
                      p={3}
                      mb={2}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={borderColor}
                      _hover={{ bg: 'gray.50' }}
                    >
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Text fontWeight="bold">{contract.name}</Text>
                          <Text fontSize="sm" isTruncated maxW="200px">
                            <Tooltip label={contract.address}>
                              <Text>{shortenAddress(contract.address)}</Text>
                            </Tooltip>
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            保存于: {formatTimestamp(contract.timestamp)}
                          </Text>
                        </Box>
                        <Flex>
                          <Button size="sm" colorScheme="brand" mr={2} onClick={() => loadContract(contract)}>
                            加载
                          </Button>
                          <Button size="sm" colorScheme="red" onClick={() => deleteContract(contract.address)}>
                            删除
                          </Button>
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                </Box>
              </CardBody>
            </Card>
          )}
        </Box>
        
        {/* 函数调用区域 */}
        <Box>
          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden" mb={6}>
            <CardHeader>
              <Heading size="md">合约函数</Heading>
            </CardHeader>
            <CardBody>
              {contractFunctions.length > 0 ? (
                <Box>
                  <Text mb={4}>选择要调用的函数:</Text>
                  <Box maxH="200px" overflowY="auto" mb={4}>
                    {contractFunctions.map((func, index) => (
                      <Box
                        key={index}
                        p={2}
                        mb={2}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor={selectedFunction?.name === func.name ? 'brand.500' : borderColor}
                        bg={selectedFunction?.name === func.name ? 'brand.50' : 'transparent'}
                        _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                        onClick={() => handleFunctionSelect(func)}
                      >
                        <Flex align="center" justify="space-between">
                          <Box>
                            <Text fontWeight="bold">{func.name}</Text>
                            <Text fontSize="sm">
                              {func.inputs.map(input => `${input.type} ${input.name}`).join(', ')}
                            </Text>
                          </Box>
                          <Badge colorScheme={func.stateMutability === 'view' || func.constant ? 'green' : 'orange'}>
                            {func.stateMutability || (func.constant ? 'view' : 'nonpayable')}
                          </Badge>
                        </Flex>
                      </Box>
                    ))}
                  </Box>
                  
                  {selectedFunction && (
                    <Box>
                      <Divider my={4} />
                      
                      <Text fontWeight="bold" mb={2}>
                        {selectedFunction.name}
                      </Text>
                      
                      {functionInputs.length > 0 ? (
                        <Box mb={4}>
                          {functionInputs.map((input, index) => (
                            <FormControl key={index} mb={2}>
                              <FormLabel>{input.name} ({input.type})</FormLabel>
                              <Input
                                placeholder={`输入 ${input.type} 类型的值...`}
                                value={input.value}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                              />
                            </FormControl>
                          ))}
                        </Box>
                      ) : (
                        <Text mb={4}>此函数没有输入参数</Text>
                      )}
                      
                      <Button
                        colorScheme="brand"
                        onClick={callContractFunction}
                        isLoading={isLoading}
                        loadingText="调用中"
                        isDisabled={!isConnected}
                      >
                        调用函数
                      </Button>
                    </Box>
                  )}
                </Box>
              ) : (
                <Flex direction="column" align="center" justify="center" py={10}>
                  <Icon as={FiCode} boxSize={12} color="gray.400" mb={4} />
                  <Text color="gray.500">请输入合约ABI并解析</Text>
                </Flex>
              )}
            </CardBody>
          </Card>
          
          {/* 调用结果 */}
          {functionResult && (
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
              <CardHeader>
                <Heading size="md">调用结果</Heading>
              </CardHeader>
              <CardBody>
                <Box
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={functionResult.success ? 'green.200' : 'red.200'}
                  bg={functionResult.success ? 'green.50' : 'red.50'}
                >
                  <Flex align="center" mb={2}>
                    <Badge colorScheme={functionResult.success ? 'green' : 'red'} mr={2}>
                      {functionResult.success ? '成功' : '失败'}
                    </Badge>
                    <Text fontSize="sm">{formatTimestamp(functionResult.timestamp)}</Text>
                  </Flex>
                  
                  {functionResult.success ? (
                    <Box>
                      <Text fontWeight="bold" mb={1}>返回值:</Text>
                      <Code p={2} borderRadius="md" wordBreak="break-all">
                        {functionResult.data}
                      </Code>
                    </Box>
                  ) : (
                    <Box>
                      <Text fontWeight="bold" mb={1}>错误:</Text>
                      <Text color="red.500">{functionResult.error}</Text>
                    </Box>
                  )}
                </Box>
              </CardBody>
            </Card>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default ContractInteraction;