import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    50: '#E6F6FF',
    100: '#BAE3FF',
    200: '#7CC4FA',
    300: '#47A3F3',
    400: '#2186EB',
    500: '#0967D2',
    600: '#0552B5',
    700: '#03449E',
    800: '#01337D',
    900: '#002159',
  },
  accent: {
    50: '#FFE5F5',
    100: '#FFB8E2',
    200: '#FF8ACF',
    300: '#FF5CBB',
    400: '#FF2EA8',
    500: '#FF0095',
    600: '#DB007E',
    700: '#B70068',
    800: '#930052',
    900: '#70003C',
  },
};

const theme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
  colors,
  semanticTokens: {
    colors: {
      "chakra-body-bg": {
        _light: 'gray.50',
        _dark: 'gray.900',
      },
      "chakra-body-text": {
        _light: 'gray.800',
        _dark: 'whiteAlpha.900',
      },
      "page-bg": {
        _light: 'white',
        _dark: 'gray.900',
      },
      "card-bg": {
        _light: 'white',
        _dark: 'gray.800',
      },
      "card-border": {
        _light: 'gray.200',
        _dark: 'whiteAlpha.100',
      },
      "input-bg": {
        _light: 'white',
        _dark: 'whiteAlpha.50',
      },
      "input-border": {
        _light: 'gray.300',
        _dark: 'whiteAlpha.200',
      },
      "input-hover": {
        _light: 'gray.400',
        _dark: 'whiteAlpha.300',
      },
      "input-focus": {
        _light: 'brand.500',
        _dark: 'brand.400',
      },
      "button-bg": {
        _light: 'brand.500',
        _dark: 'brand.400',
      },
      "button-hover": {
        _light: 'brand.600',
        _dark: 'brand.500',
      },
      "text-primary": {
        _light: 'gray.800',
        _dark: 'white',
      },
      "text-secondary": {
        _light: 'gray.600',
        _dark: 'gray.300',
      },
      "text-tertiary": {
        _light: 'gray.500',
        _dark: 'gray.400',
      },
      "border-color": {
        _light: 'gray.200',
        _dark: 'whiteAlpha.100',
      },
      "highlight-bg": {
        _light: 'blue.50',
        _dark: 'blue.900',
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: 'chakra-body-bg',
        color: 'chakra-body-text',
      },
      '*::selection': {
        bg: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'blackAlpha.300',
      },
      '*::-webkit-scrollbar': {
        w: '10px',
        h: '10px',
      },
      '*::-webkit-scrollbar-track': {
        bg: props.colorMode === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      },
      '*::-webkit-scrollbar-thumb': {
        bg: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderRadius: 'full',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'lg',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        _active: {
          transform: 'translateY(0)',
        },
      },
      variants: {
        solid: (props) => ({
          bg: 'button-bg',
          color: 'white',
          _hover: {
            bg: 'button-hover',
          },
        }),
        outline: (props) => ({
          borderColor: 'border-color',
          color: 'text-primary',
          _hover: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50',
          },
        }),
        ghost: (props) => ({
          color: 'text-primary',
          _hover: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50',
          },
        }),
        gradient: {
          bgGradient: 'linear(to-r, brand.500, accent.500)',
          color: 'white',
          _hover: {
            bgGradient: 'linear(to-r, brand.600, accent.600)',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'card-bg',
          borderRadius: 'xl',
          borderWidth: '1px',
          borderColor: 'card-border',
          overflow: 'hidden',
          transition: 'all 0.2s',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: 'input-bg',
            borderColor: 'input-border',
            _hover: {
              borderColor: 'input-hover',
            },
            _focus: {
              borderColor: 'input-focus',
              boxShadow: 'none',
            },
          },
        },
      },
    },
    Select: {
      variants: {
        outline: {
          field: {
            bg: 'input-bg',
            borderColor: 'input-border',
            _hover: {
              borderColor: 'input-hover',
            },
            _focus: {
              borderColor: 'input-focus',
              boxShadow: 'none',
            },
          },
        },
      },
    },
    Textarea: {
      variants: {
        outline: {
          bg: 'input-bg',
          borderColor: 'input-border',
          _hover: {
            borderColor: 'input-hover',
          },
          _focus: {
            borderColor: 'input-focus',
            boxShadow: 'none',
          },
        },
      },
    },
  },
  layerStyles: {
    gradient: {
      bgGradient: 'linear(to-r, brand.500, accent.500)',
      color: 'white',
    },
    card: {
      bg: 'card-bg',
      borderRadius: 'xl',
      borderWidth: '1px',
      borderColor: 'card-border',
      overflow: 'hidden',
      transition: 'all 0.2s',
      _hover: {
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      },
    },
    glass: (props) => ({
      bg: props.colorMode === 'dark' ? 'whiteAlpha.50' : 'blackAlpha.50',
      backdropFilter: 'blur(10px)',
      borderRadius: 'xl',
      borderWidth: '1px',
      borderColor: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100',
    }),
  },
  textStyles: {
    gradient: {
      bgGradient: 'linear(to-r, brand.500, accent.500)',
      bgClip: 'text',
    },
    emphasis: {
      color: 'text-primary',
      fontWeight: 'semibold',
    },
  },
});

export default theme;
