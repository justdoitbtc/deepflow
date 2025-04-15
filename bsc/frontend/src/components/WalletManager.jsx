import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Card,
  CardHeader,
  CardBody,
  FormControl,
  FormLabel,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Tooltip,
  useColorModeValue,
  useToast,
  Spinner,
  Badge,
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
import { SearchIcon, ExternalLinkIcon, InfoIcon } from '@chakra-ui/icons';
import { FiClock, FiDatabase, FiHash, FiUser, FiDollarSign, FiArrowRight, FiWifi, FiSend } from 'react-icons/fi';
import { fetchAccountBalance, fetchTokenBalance, shortenAddress, formatWei } from '../services/api';

const WalletManager = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [addressInput, setAddressInput] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [transactions, setTransactions] = useState([]);
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // 检查是否安装了MetaMask
  const checkIfWalletIsInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };
  
  // 连接MetaMask钱包
  const connectWallet = async () => {
    if (!checkIfWalletIsInstalled()) {
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
    
    setIsConnecting(true);
    try {
      // 请求用户授权连接钱包
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        
        // 获取账户余额
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });
        
        setBalance(parseInt(balance, 16));
        
        // 模拟获取代币余额
        // 在实际应用中，应该从API获取用户持有的代币列表
        const mockTokens = [
          { symbol: 'BUSD', address: '0xe9e7cea3dedca5984780bafc599bd69add087d56', balance: '1000000000000000000000' },
          { symbol: 'CAKE', address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', balance: '50000000000000000000' },
          { symbol: 'USDT', address: '0x55d398326f99059ff775485246999027b3197955', balance: '500000000000000000000' }
        ];
        
        setTokenBalances(mockTokens);
        
        // 监听账户变化
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        
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
      setIsConnecting(false);
    }
  };
  
  // 处理账户变化
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // 用户断开了钱包连接
      setIsConnected(false);
      setAccount(null);
      setBalance(null);
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
      toast({
        title: '账户已切换',
        description: `当前账户: ${shortenAddress(accounts[0])}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // 断开钱包连接
  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setBalance(null);
    setTokenBalances([]);
    
    // 移除事件监听器
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
    
    toast({
      title: '钱包已断开',
      description: '您已成功断开钱包连接',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // 查询地址余额
  const checkAddressBalance = async () => {
    if (!addressInput.trim()) {
      toast({
        title: '请输入地址',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // 验证地址格式
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(addressInput.trim())) {
      toast({
        title: '请输入有效的地址',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      // 获取账户余额
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [addressInput.trim(), 'latest']
      });
      
      toast({
        title: '查询成功',
        description: `地址余额: ${formatWei(parseInt(balance, 16))} BNB`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('查询余额失败:', error);
      toast({
        title: '查询失败',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // 发送交易
  const sendTransaction = async () => {
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
    
    if (!recipientAddress.trim() || !sendAmount) {
      toast({
        title: '请填写完整信息',
        description: '请输入接收地址和发送金额',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // 验证地址格式
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(recipientAddress.trim())) {
      toast({
        title: '请输入有效的接收地址',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // 验证金额
    if (isNaN(sendAmount) || parseFloat(sendAmount) <= 0) {
      toast({
        title: '请输入有效的金额',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsSending(true);
    try {
      // 将BNB转换为Wei
      const amountInWei = `0x${(parseFloat(sendAmount) * 1e18).toString(16)}`;
      
      // 发送交易
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: recipientAddress.trim(),
          value: amountInWei,
          gas: '0x5208', // 21000 gas
        }],
      });
      
      // 添加到交易历史
      const newTx = {
        hash: txHash,
        from: account,
        to: recipientAddress.trim(),
        value: parseFloat(sendAmount),
        timestamp: Math.floor(Date.now() / 1000),
        status: 'pending'
      };
      
      setTransactions([newTx, ...transactions]);
      
      // 清空输入
      setRecipientAddress('');
      setSendAmount('');
      
      toast({
        title: '交易已发送',
        description: `交易哈希: ${shortenAddress(txHash, 8)}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('发送交易失败:', error);
      toast({
        title: '发送失败',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSending(false);
    }
  };
  
  // 格式化时间戳
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };
  
  return (
    <Box>
      <Heading mb={6}>钱包管理</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        {/* 钱包连接卡片 */}
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
          <CardHeader>
            <Heading size="md">连接钱包</Heading>
          </CardHeader>
          <CardBody>
            {isConnected ? (
              <Box>
                <Flex align="center" mb={4}>
                  <Icon as={FiWifi} color="green.500" mr={2} />
                  <Text fontWeight="bold">已连接到钱包</Text>
                </Flex>
                
                <Box mb={4}>
                  <Text fontWeight="bold">账户地址:</Text>
                  <Text wordBreak="break-all">{account}</Text>
                </Box>
                
                <Box mb={4}>
                  <Text fontWeight="bold">BNB余额:</Text>
                  <Text fontSize="2xl" fontWeight="bold">{balance ? formatWei(balance) : '0'} BNB</Text>
                </Box>
                
                <Button colorScheme="red" onClick={disconnectWallet}>断开连接</Button>
              </Box>
            ) : (
              <Box>
                <Text mb={4}>连接您的MetaMask钱包以管理资产和发送交易</Text>
                <Button
                  colorScheme="brand"
                  onClick={connectWallet}
                  isLoading={isConnecting}
                  loadingText="连接中"
                  leftIcon={<Icon as={FiWifi} />}
                >
                  连接MetaMask
                </Button>
                
                {error && (
                  <Alert status="error" mt={4}>
                    <AlertIcon />
                    <AlertTitle mr={2}>错误!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </Box>
            )}
          </CardBody>
        </Card>
        
        {/* 地址查询卡片 */}
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
          <CardHeader>
            <Heading size="md">查询地址</Heading>
          </CardHeader>
          <CardBody>
            <Text mb={4}>输入BSC地址查询余额</Text>
            <InputGroup mb={4}>
              <Input
                placeholder="输入BSC地址..."
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={checkAddressBalance}>
                  <SearchIcon />
                </Button>
              </InputRightElement>
            </InputGroup>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {isConnected && (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
          {/* 代币余额卡片 */}
          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
            <CardHeader>
              <Heading size="md">代币余额</Heading>
            </CardHeader>
            <CardBody>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>代币</Th>
                    <Th>地址</Th>
                    <Th isNumeric>余额</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tokenBalances.map((token, index) => (
                    <Tr key={index}>
                      <Td>{token.symbol}</Td>
                      <Td isTruncated maxW="150px">
                        <Tooltip label={token.address}>
                          <Text>{shortenAddress(token.address)}</Text>
                        </Tooltip>
                      </Td>
                      <Td isNumeric>{formatWei(token.balance)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
          
          {/* 发送交易卡片 */}
          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
            <CardHeader>
              <Heading size="md">发送交易</Heading>
            </CardHeader>
            <CardBody>
              <FormControl mb={4}>
                <FormLabel>接收地址</FormLabel>
                <Input
                  placeholder="输入接收地址..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
              </FormControl>
              
              <FormControl mb={4}>
                <FormLabel>发送金额 (BNB)</FormLabel>
                <NumberInput min={0} precision={8} value={sendAmount} onChange={(value) => setSendAmount(value)}>
                  <NumberInputField placeholder="0.0" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText>当前余额: {balance ? formatWei(balance) : '0'} BNB</FormHelperText>
              </FormControl>
              
              <Button
                colorScheme="brand"
                onClick={sendTransaction}
                isLoading={isSending}
                loadingText="发送中"
                leftIcon={<Icon as={FiSend} />}
                isDisabled={!isConnected}
              >
                发送交易
              </Button>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}
      
      {/* 交易历史 */}
      {isConnected && transactions.length > 0 && (
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden" mb={6}>
          <CardHeader>
            <Heading size="md">交易历史</Heading>
          </CardHeader>
          <CardBody>
            <Box maxH="400px" overflowY="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>交易哈希</Th>
                    <Th>接收方</Th>
                    <Th>时间</Th>
                    <Th isNumeric>金额 (BNB)</Th>
                    <Th>状态</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactions.map((tx, index) => (
                    <Tr key={index}>
                      <Td isTruncated maxW="150px">
                        <Tooltip label={tx.hash}>
                          <Text>{shortenAddress(tx.hash, 8)}</Text>
                        </Tooltip>
                      </Td>
                      <Td isTruncated maxW="150px">
                        <Tooltip label={tx.to}>
                          <Text>{shortenAddress(tx.to)}</Text>
                        </Tooltip>
                      </Td>
                      <Td>{formatTimestamp(tx.timestamp)}</Td>
                      <Td isNumeric>{tx.value.toFixed(8)}</Td>
                      <Td>
                        {tx.status === 'pending' ? (
                          <Badge colorScheme="yellow">待确认</Badge>
                        ) : tx.status === 'success' ? (
                          <Badge colorScheme="green">成功</Badge>
                        ) : (
                          <Badge colorScheme="red">失败</Badge>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default WalletManager;