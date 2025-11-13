import { ReactNode } from 'react'
import {
  Box,
  useDisclosure,
  Drawer,
  DrawerContent,
  useColorModeValue,
} from '@chakra-ui/react'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Sidebar
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <Sidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>
      
      <MobileNav onOpen={onOpen} />
      
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          borderRadius="2xl"
          boxShadow="sm"
          border="1px solid"
          borderColor={useColorModeValue('gray.100', 'gray.700')}
          minH="calc(100vh - 2rem)"
          p={6}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
