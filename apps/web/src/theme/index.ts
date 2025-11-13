import { extendTheme } from '@chakra-ui/react'
import { COLORS } from '@bluecarbon/shared'

export const theme = extendTheme({
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  colors: {
    brand: {
      50: '#E6F7F9',
      100: '#B3E8ED',
      200: '#80D9E1',
      300: '#4DCAD5',
      400: '#1ABBC9',
      500: COLORS.TEAL,
      600: '#087F7F',
      700: '#065F5F',
      800: '#043F3F',
      900: '#021F1F',
    },
    ocean: {
      50: '#E6F2F4',
      100: '#B3D9DE',
      200: '#80C0C8',
      300: '#4DA7B2',
      400: '#1A8E9C',
      500: COLORS.DEEP_OCEAN_BLUE,
      600: '#004B5C',
      700: '#003845',
      800: '#00252E',
      900: '#001217',
    },
    sand: {
      50: '#FEFCF7',
      100: '#FCF6E6',
      200: '#F9F0D5',
      300: '#F6EAC4',
      400: '#F3E4B3',
      500: COLORS.SAND_BEIGE,
      600: '#D4C18A',
      700: '#B8A66E',
      800: '#9C8B52',
      900: '#807036',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      variants: {
        solid: {
          borderRadius: '2xl',
          fontWeight: 'medium',
          _hover: {
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          transition: 'all 0.2s',
        },
        ghost: {
          borderRadius: '2xl',
          _hover: {
            bg: 'brand.50',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '2xl',
          boxShadow: 'sm',
          border: '1px solid',
          borderColor: 'gray.100',
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            borderRadius: '2xl',
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            },
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
})
