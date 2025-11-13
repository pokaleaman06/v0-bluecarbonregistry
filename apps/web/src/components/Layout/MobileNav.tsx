import {
  IconButton,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  Box,
  Icon,
} from '@chakra-ui/react'
import { FiMenu, FiStar } from 'react-icons/fi'

interface MobileProps {
  onOpen: () => void
}

export function MobileNav({ onOpen }: MobileProps) {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <HStack spacing={3} display={{ base: 'flex', md: 'none' }}>
        <Box
          w={8}
          h={8}
          bg="brand.500"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={FiStar} color="white" />
        </Box>
        <Text fontSize="xl" fontWeight="bold" color="brand.500">
          BlueCarbon
        </Text>
      </HStack>
    </Flex>
  )
}
