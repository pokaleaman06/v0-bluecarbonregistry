import { Flex, Spinner, Text, VStack } from '@chakra-ui/react'

export function LoadingSpinner() {
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.50"
    >
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
        />
        <Text color="gray.600" fontSize="lg">
          Loading BlueCarbon Registry...
        </Text>
      </VStack>
    </Flex>
  )
}
