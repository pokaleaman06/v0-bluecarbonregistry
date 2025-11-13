import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Icon,
  useColorModeValue,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
} from '@chakra-ui/react'
import { FiUpload, FiEye, FiDatabase, FiTrendingUp } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export function DataManagement() {
  const cardBg = useColorModeValue('white', 'gray.800')

  const stats = [
    {
      label: 'Total Datasets',
      value: '1,247',
      change: 12.5,
      icon: FiDatabase,
      color: 'blue',
    },
    {
      label: 'Species Records',
      value: '156',
      change: 8.2,
      icon: FiEye,
      color: 'green',
    },
    {
      label: 'Ecosystems Mapped',
      value: '89',
      change: 15.3,
      icon: FiTrendingUp,
      color: 'purple',
    },
    {
      label: 'Pending Validation',
      value: '23',
      change: -5.1,
      icon: FiUpload,
      color: 'orange',
    },
  ]

  const quickActions = [
    {
      title: 'Upload Data',
      description: 'Upload ecosystem data, species information, and monitoring results',
      icon: FiUpload,
      link: '/data-management/upload',
      color: 'blue',
    },
    {
      title: 'Species Gallery',
      description: 'Browse and filter species data with carbon sequestration potential',
      icon: FiEye,
      link: '/data-management/species',
      color: 'green',
    },
    {
      title: 'Data Validation',
      description: 'Review and validate uploaded data against official datasets',
      icon: FiDatabase,
      link: '/data-management/validation',
      color: 'purple',
    },
  ]

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <VStack align="start" spacing={4}>
          <Heading size="xl" color="blue.600">
            Data Management
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Manage ecosystem data, species information, and monitoring results for blue carbon projects.
            All data is validated against FSI, MoSPI, and NCCR datasets.
          </Text>
        </VStack>

        {/* Stats Grid */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
          {stats.map((stat) => (
            <GridItem key={stat.label}>
              <Card bg={cardBg} borderRadius="2xl" boxShadow="sm">
                <CardBody>
                  <Stat>
                    <HStack justify="space-between" align="start" mb={2}>
                      <StatLabel fontSize="sm" color="gray.600">
                        {stat.label}
                      </StatLabel>
                      <Icon
                        as={stat.icon}
                        w={5}
                        h={5}
                        color={`${stat.color}.500`}
                      />
                    </HStack>
                    <StatNumber fontSize="2xl" fontWeight="bold">
                      {stat.value}
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow
                        type={stat.change > 0 ? 'increase' : 'decrease'}
                      />
                      {Math.abs(stat.change)}% from last month
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Card bg={cardBg} borderRadius="2xl" boxShadow="sm">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Quick Actions</Heading>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                {quickActions.map((action) => (
                  <GridItem key={action.title}>
                    <Card
                      as={Link}
                      to={action.link}
                      bg={`${action.color}.50`}
                      borderColor={`${action.color}.200`}
                      borderWidth="1px"
                      _hover={{
                        bg: `${action.color}.100`,
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                      }}
                      transition="all 0.2s"
                      cursor="pointer"
                    >
                      <CardBody>
                        <VStack spacing={3} align="stretch">
                          <Icon
                            as={action.icon}
                            w={8}
                            h={8}
                            color={`${action.color}.500`}
                          />
                          <VStack spacing={1} align="start">
                            <Heading size="sm" color={`${action.color}.700`}>
                              {action.title}
                            </Heading>
                            <Text fontSize="sm" color="gray.600">
                              {action.description}
                            </Text>
                          </VStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                ))}
              </Grid>
            </VStack>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card bg={cardBg} borderRadius="2xl" boxShadow="sm">
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Recent Activity</Heading>
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between" p={3} bg="gray.50" borderRadius="md">
                  <HStack spacing={3}>
                    <Icon as={FiUpload} color="blue.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="medium">
                        Sundarbans data uploaded
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        2 hours ago
                      </Text>
                    </VStack>
                  </HStack>
                  <Badge colorScheme="green">Validated</Badge>
                </HStack>
                
                <HStack justify="space-between" p={3} bg="gray.50" borderRadius="md">
                  <HStack spacing={3}>
                    <Icon as={FiEye} color="green.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="medium">
                        Species gallery updated
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        4 hours ago
                      </Text>
                    </VStack>
                  </HStack>
                  <Badge colorScheme="blue">Updated</Badge>
                </HStack>
                
                <HStack justify="space-between" p={3} bg="gray.50" borderRadius="md">
                  <HStack spacing={3}>
                    <Icon as={FiDatabase} color="purple.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="medium">
                        Kerala backwater data validated
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        1 day ago
                      </Text>
                    </VStack>
                  </HStack>
                  <Badge colorScheme="green">Approved</Badge>
                </HStack>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  )
}
