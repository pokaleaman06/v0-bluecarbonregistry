import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Card,
  CardBody,
  VStack,
  HStack,
  useColorModeValue,
  Select,
  Button,
  Icon,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FiDownload, FiTrendingUp } from 'react-icons/fi'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const MotionBox = motion(Box)

// Mock data for charts
const sequestrationData = [
  { month: 'Jan', value: 1200 },
  { month: 'Feb', value: 1350 },
  { month: 'Mar', value: 1180 },
  { month: 'Apr', value: 1420 },
  { month: 'May', value: 1680 },
  { month: 'Jun', value: 1850 },
]

const regionData = [
  { region: 'West Bengal', projects: 45, credits: 2340 },
  { region: 'Kerala', projects: 32, credits: 1890 },
  { region: 'Gujarat', projects: 28, credits: 1650 },
  { region: 'Maharashtra', projects: 25, credits: 1420 },
  { region: 'Tamil Nadu', projects: 18, credits: 980 },
]

const statusData = [
  { name: 'Active', value: 148, color: '#10B981' },
  { name: 'Completed', value: 89, color: '#3B82F6' },
  { name: 'Suspended', value: 12, color: '#EF4444' },
]

export function Analytics() {
  const { t } = useTranslation()
  const cardBg = useColorModeValue('white', 'gray.800')

  return (
    <Box>
      <VStack align="start" spacing={6} mb={8}>
        <HStack justify="space-between" w="full">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading size="xl" color="gray.800">
              {t('analytics.title')}
            </Heading>
            <Text color="gray.600" fontSize="lg" mt={2}>
              Comprehensive insights into blue carbon restoration
            </Text>
          </MotionBox>

          <HStack spacing={3}>
            <Select placeholder="Last 6 months" borderRadius="2xl" maxW="200px">
              <option value="3m">Last 3 months</option>
              <option value="6m">Last 6 months</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </Select>
            <Button
              leftIcon={<Icon as={FiDownload} />}
              colorScheme="brand"
              variant="outline"
              borderRadius="2xl"
            >
              Export Report
            </Button>
          </HStack>
        </HStack>
      </VStack>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={6}>
        <GridItem>
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card bg={cardBg} borderRadius="2xl" boxShadow="sm" h="400px">
              <CardBody>
                <VStack align="start" spacing={4} h="full">
                  <HStack justify="space-between" w="full">
                    <VStack align="start" spacing={1}>
                      <Heading size="md">Carbon Sequestration Trends</Heading>
                      <Text fontSize="sm" color="gray.600">
                        Monthly carbon sequestration (tCO₂)
                      </Text>
                    </VStack>
                    <HStack spacing={2} color="green.500">
                      <Icon as={FiTrendingUp} />
                      <Text fontSize="sm" fontWeight="medium">+12.5%</Text>
                    </HStack>
                  </HStack>
                  <Box flex={1} w="full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sequestrationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#0A9396"
                          strokeWidth={3}
                          dot={{ fill: '#0A9396', strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>
        </GridItem>

        <GridItem>
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card bg={cardBg} borderRadius="2xl" boxShadow="sm" h="400px">
              <CardBody>
                <VStack align="start" spacing={4} h="full">
                  <VStack align="start" spacing={1}>
                    <Heading size="md">Project Status</Heading>
                    <Text fontSize="sm" color="gray.600">
                      Distribution of project statuses
                    </Text>
                  </VStack>
                  <Box flex={1} w="full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <VStack align="start" spacing={2} w="full">
                    {statusData.map((item) => (
                      <HStack key={item.name} justify="space-between" w="full">
                        <HStack spacing={2}>
                          <Box w={3} h={3} bg={item.color} borderRadius="full" />
                          <Text fontSize="sm">{item.name}</Text>
                        </HStack>
                        <Text fontSize="sm" fontWeight="medium">
                          {item.value}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>
        </GridItem>
      </Grid>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card bg={cardBg} borderRadius="2xl" boxShadow="sm">
          <CardBody>
            <VStack align="start" spacing={4}>
              <VStack align="start" spacing={1}>
                <Heading size="md">Regional Performance</Heading>
                <Text fontSize="sm" color="gray.600">
                  Projects and carbon credits by region
                </Text>
              </VStack>
              <Box w="full" h="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar
                      yAxisId="left"
                      dataKey="projects"
                      fill="#005F73"
                      name="Projects"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="credits"
                      fill="#0A9396"
                      name="Credits (tCO₂)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </MotionBox>
    </Box>
  )
}
