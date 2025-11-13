import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Avatar,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { FiTrendingUp, FiUsers, FiAlertTriangle, FiCheckCircle, FiClock } from 'react-icons/fi'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

// Mock data for admin dashboard
const mockAdminStats = {
  totalProjects: 156,
  activeProjects: 142,
  pendingVerifications: 23,
  totalCredits: 8924,
  issuedCredits: 7845,
  retiredCredits: 1079,
  totalStakeholders: 89,
  verifiedStakeholders: 76,
  blockchainTransactions: 1247,
  systemHealth: 98.5,
}

const mockRecentActivities = [
  {
    id: '1',
    type: 'verification',
    description: 'Field data verified for Sundarbans Mangrove Project',
    timestamp: '2 hours ago',
    status: 'success',
    user: 'Dr. Rajesh Kumar',
  },
  {
    id: '2',
    type: 'credit_issuance',
    description: 'Carbon credits issued for Kerala Backwater Project',
    timestamp: '4 hours ago',
    status: 'success',
    amount: '125.5 tCO₂',
  },
  {
    id: '3',
    type: 'stakeholder_registration',
    description: 'New NGO registered: Coastal Conservation Society',
    timestamp: '6 hours ago',
    status: 'pending',
    user: 'Priya Sharma',
  },
  {
    id: '4',
    type: 'system_alert',
    description: 'High verification queue detected',
    timestamp: '8 hours ago',
    status: 'warning',
  },
]

const mockSystemMetrics = [
  {
    name: 'Blockchain Sync Status',
    value: 100,
    status: 'healthy',
    color: 'green',
  },
  {
    name: 'Database Performance',
    value: 95,
    status: 'healthy',
    color: 'green',
  },
  {
    name: 'API Response Time',
    value: 87,
    status: 'warning',
    color: 'yellow',
  },
  {
    name: 'Storage Usage',
    value: 72,
    status: 'healthy',
    color: 'green',
  },
]

export function AdminDashboard() {
  const cardBg = useColorModeValue('white', 'gray.800')

  const stats = [
    {
      label: 'Total Projects',
      value: mockAdminStats.totalProjects.toString(),
      unit: 'projects',
      change: 12.5,
      icon: FiTrendingUp,
      color: 'blue',
    },
    {
      label: 'Pending Verifications',
      value: mockAdminStats.pendingVerifications.toString(),
      unit: 'pending',
      change: -5.1,
      icon: FiClock,
      color: 'orange',
    },
    {
      label: 'Total Credits',
      value: mockAdminStats.totalCredits.toLocaleString(),
      unit: 'tCO₂',
      change: 8.2,
      icon: FiCheckCircle,
      color: 'green',
    },
    {
      label: 'Active Stakeholders',
      value: mockAdminStats.totalStakeholders.toString(),
      unit: 'users',
      change: 15.3,
      icon: FiUsers,
      color: 'purple',
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'verification':
        return FiCheckCircle
      case 'credit_issuance':
        return FiTrendingUp
      case 'stakeholder_registration':
        return FiUsers
      case 'system_alert':
        return FiAlertTriangle
      default:
        return FiClock
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'green'
      case 'warning':
        return 'orange'
      case 'pending':
        return 'blue'
      default:
        return 'gray'
    }
  }

  return (
    <Box>
      <VStack align="start" spacing={6} mb={8}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="xl" color="gray.800">
            NCCR Admin Dashboard
          </Heading>
          <Text color="gray.600" fontSize="lg" mt={2}>
            Monitor and manage the Blue Carbon Registry platform
          </Text>
        </MotionBox>
      </VStack>

      {/* System Health Alert */}
      {mockAdminStats.systemHealth < 95 && (
        <Alert status="warning" mb={6} borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>System Performance Alert!</AlertTitle>
            <AlertDescription>
              System health is at {mockAdminStats.systemHealth}%. Please monitor closely.
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {/* Main Stats Grid */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(4, 1fr)' }} gap={6} mb={8}>
        {stats.map((stat, index) => (
          <GridItem key={stat.label}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card bg={cardBg} borderRadius="2xl" boxShadow="sm">
                <CardBody>
                  <Stat>
                    <Flex justify="space-between" align="start" mb={2}>
                      <StatLabel fontSize="sm" color="gray.600">
                        {stat.label}
                      </StatLabel>
                      <Icon
                        as={stat.icon}
                        w={5}
                        h={5}
                        color={`${stat.color}.500`}
                      />
                    </Flex>
                    <StatNumber fontSize="2xl" fontWeight="bold">
                      {stat.value}
                      <Text as="span" fontSize="sm" color="gray.500" ml={1}>
                        {stat.unit}
                      </Text>
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow
                        type={stat.change > 0 ? 'increase' : 'decrease'}
                      />
                      {Math.abs(stat.change)}% from last week
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </MotionBox>
          </GridItem>
        ))}
      </Grid>

      <Grid templateColumns={{ base: '1fr', xl: '2fr 1fr' }} gap={6} mb={8}>
        {/* System Metrics */}
        <GridItem>
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card bg={cardBg} borderRadius="2xl" boxShadow="sm">
              <CardBody>
                <Heading size="md" mb={6}>System Metrics</Heading>
                <VStack spacing={4} align="stretch">
                  {mockSystemMetrics.map((metric) => (
                    <Box key={metric.name}>
                      <Flex justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="medium">
                          {metric.name}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {metric.value}%
                        </Text>
                      </Flex>
                      <Progress
                        value={metric.value}
                        colorScheme={metric.color}
                        size="sm"
                        borderRadius="full"
                      />
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>
        </GridItem>

        {/* Recent Activities */}
        <GridItem>
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card bg={cardBg} borderRadius="2xl" boxShadow="sm">
              <CardBody>
                <Heading size="md" mb={6}>Recent Activities</Heading>
                <VStack spacing={4} align="stretch">
                  {mockRecentActivities.map((activity) => (
                    <HStack key={activity.id} spacing={3} align="start">
                      <Icon
                        as={getActivityIcon(activity.type)}
                        w={4}
                        h={4}
                        color={`${getActivityColor(activity.status)}.500`}
                        mt={1}
                      />
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontSize="sm" noOfLines={2}>
                          {activity.description}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {activity.timestamp}
                        </Text>
                        {activity.user && (
                          <Text fontSize="xs" color="gray.600">
                            by {activity.user}
                          </Text>
                        )}
                        {activity.amount && (
                          <Badge size="sm" colorScheme="green">
                            {activity.amount}
                          </Badge>
                        )}
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>
        </GridItem>
      </Grid>

      {/* Blockchain & Credits Overview */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card bg={cardBg} borderRadius="2xl" boxShadow="sm">
          <CardBody>
            <Tabs variant="soft-rounded" colorScheme="brand">
              <TabList mb={6}>
                <Tab>Blockchain Status</Tab>
                <Tab>Credit Management</Tab>
                <Tab>Stakeholder Management</Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                    <GridItem>
                      <VStack spacing={2}>
                        <Text fontSize="sm" color="gray.600">Total Transactions</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                          {mockAdminStats.blockchainTransactions.toLocaleString()}
                        </Text>
                        <Badge colorScheme="green">Synced</Badge>
                      </VStack>
                    </GridItem>
                    <GridItem>
                      <VStack spacing={2}>
                        <Text fontSize="sm" color="gray.600">Network Status</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="green.500">
                          Online
                        </Text>
                        <Badge colorScheme="green">Polygon</Badge>
                      </VStack>
                    </GridItem>
                    <GridItem>
                      <VStack spacing={2}>
                        <Text fontSize="sm" color="gray.600">Gas Fees</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                          0.001 MATIC
                        </Text>
                        <Badge colorScheme="blue">Low</Badge>
                      </VStack>
                    </GridItem>
                  </Grid>
                </TabPanel>

                <TabPanel p={0}>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                    <GridItem>
                      <VStack spacing={2}>
                        <Text fontSize="sm" color="gray.600">Issued Credits</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="green.500">
                          {mockAdminStats.issuedCredits.toLocaleString()}
                        </Text>
                        <Text fontSize="sm" color="gray.500">tCO₂</Text>
                      </VStack>
                    </GridItem>
                    <GridItem>
                      <VStack spacing={2}>
                        <Text fontSize="sm" color="gray.600">Retired Credits</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                          {mockAdminStats.retiredCredits.toLocaleString()}
                        </Text>
                        <Text fontSize="sm" color="gray.500">tCO₂</Text>
                      </VStack>
                    </GridItem>
                    <GridItem>
                      <VStack spacing={2}>
                        <Text fontSize="sm" color="gray.600">Available Credits</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                          {(mockAdminStats.issuedCredits - mockAdminStats.retiredCredits).toLocaleString()}
                        </Text>
                        <Text fontSize="sm" color="gray.500">tCO₂</Text>
                      </VStack>
                    </GridItem>
                  </Grid>
                </TabPanel>

                <TabPanel p={0}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Stakeholder Type</Th>
                        <Th>Total</Th>
                        <Th>Verified</Th>
                        <Th>Pending</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>
                          <HStack spacing={3}>
                            <Avatar size="sm" name="NGO" />
                            <Text fontWeight="medium">NGOs</Text>
                          </HStack>
                        </Td>
                        <Td>45</Td>
                        <Td>
                          <Badge colorScheme="green">38</Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme="orange">7</Badge>
                        </Td>
                        <Td>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <HStack spacing={3}>
                            <Avatar size="sm" name="Panchayat" />
                            <Text fontWeight="medium">Panchayats</Text>
                          </HStack>
                        </Td>
                        <Td>28</Td>
                        <Td>
                          <Badge colorScheme="green">25</Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme="orange">3</Badge>
                        </Td>
                        <Td>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <HStack spacing={3}>
                            <Avatar size="sm" name="Verifier" />
                            <Text fontWeight="medium">Verifiers</Text>
                          </HStack>
                        </Td>
                        <Td>16</Td>
                        <Td>
                          <Badge colorScheme="green">13</Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme="orange">3</Badge>
                        </Td>
                        <Td>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </MotionBox>
    </Box>
  )
}
