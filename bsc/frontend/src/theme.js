import { extendTheme } from '@chakra-ui/react';

// BSC品牌颜色
const colors = {
  brand: {
    50: '#fff8e6',
    100: '#ffefc3',
    200: '#ffe69f',
    300: '#ffdd7b',
    400: '#ffd457',
    500: '#f0b90b', // BSC主色调
    600: '#e6a800',
    700: '#cc9600',
    800: '#b38300',
    900: '#996f00',
  },
};

// 组件样式覆盖
const components = {
  Button: {
    variants: {
      primary: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'lg',
        boxShadow: 'md',
      },
    },
  },
};

// 全局样式
const styles = {
  global: {
    body: {
      bg: 'gray.50',
      color: 'gray.800',
    },
  },
};

// 字体配置
const fonts = {
  heading: '"Inter", sans-serif',
  body: '"Inter", sans-serif',
};

// 创建主题
const theme = extendTheme({
  colors,
  components,
  styles,
  fonts,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme;