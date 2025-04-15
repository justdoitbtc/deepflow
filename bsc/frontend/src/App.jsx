import React from 'react';
import { ChakraProvider, Box, Grid, GridItem, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 导入组件
import BlockExplorer from './components/BlockExplorer';
import TransactionList from './components/TransactionList';
import WalletManager from './components/WalletManager';
import ContractInteraction from './components/ContractInteraction';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

// 主题配置
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box minH="100vh" bg="gray.50">
          <Navbar />
          <Box p={4}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/blocks" element={<BlockExplorer />} />
              <Route path="/transactions" element={<TransactionList />} />
              <Route path="/wallet" element={<WalletManager />} />
              <Route path="/contracts" element={<ContractInteraction />} />
            </Routes>
          </Box>
          <Box as="footer" py={4} textAlign="center" borderTopWidth={1} borderColor="gray.200">
            <Text fontSize="sm" color="gray.500">
              © {new Date().getFullYear()} BSC可视化页面 | 基于DeepFlow框架开发
            </Text>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;