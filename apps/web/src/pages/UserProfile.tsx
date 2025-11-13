import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  useColorModeValue,
  SimpleGrid,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Select,
  useToast,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listSubmissions, type SubmissionRecord } from '../api/verificationMock'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts'
import { useNavigate } from 'react-router-dom'

const MotionBox = motion(Box)
const COLORS = ['#0A9396', '#94D2BD', '#EE9B00']

export function UserProfile() {
  const cardBg = useColorModeValue('white', 'gray.800')
  const toast = useToast()
  const navigate = useNavigate()
  const { data: submissions = [] } = useQuery({ queryKey: ['submissions'], queryFn: listSubmissions })

  // For prototype, assume all current submissions belong to the logged-in user
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [sortKey, setSortKey] = useState<'date' | 'score' | 'status'>('date')

  const filtered = useMemo(() => {
    const base = submissions.slice()
    const mapped = base
      .filter((s) =>
        statusFilter === 'all'
          ? true
          : statusFilter === 'approved'
          ? s.adminStatus === 'approved'
          : statusFilter === 'pending'
          ? s.adminStatus === 'pending' || typeof s.aiHealthScore !== 'number'
          : s.adminStatus === 'rejected'
      )
      .sort((a, b) => {
        if (sortKey === 'date') return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        if (sortKey === 'score') return (b.aiHealthScore || 0) - (a.aiHealthScore || 0)
        return (a.adminStatus || '').localeCompare(b.adminStatus || '')
      })
    return mapped
  }, [submissions, statusFilter, sortKey])

  const stats = useMemo(() => {
    const total = submissions.length
    const pending = submissions.filter((s) => s.adminStatus === 'pending').length
    const approved = submissions.filter((s) => s.adminStatus === 'approved').length
    const rejected = submissions.filter((s) => s.adminStatus === 'rejected').length
    const latest = submissions.find((s) => typeof s.aiHealthScore === 'number')
    const credits = submissions.reduce((sum, s) => sum + (s.mintedCredits || 0), 0)
    return { total, pending, approved, rejected, latest, credits }
  }, [submissions])

  const creditsOverTime = useMemo(() => {
    const points = submissions
      .filter((s) => s.mintedCredits)
      .map((s) => ({ date: new Date(s.submittedAt).toLocaleDateString(), credits: s.mintedCredits }))
    // aggregate by date
    const map = new Map<string, number>()
    for (const p of points) map.set(p.date, (map.get(p.date) || 0) + (p.credits || 0))
    return Array.from(map.entries()).map(([date, credits]) => ({ date, credits }))
  }, [submissions])

  const statusPie = useMemo(() => {
    return [
      { name: 'Approved', value: submissions.filter((s) => s.adminStatus === 'approved').length },
      { name: 'Pending', value: submissions.filter((s) => s.adminStatus === 'pending' || typeof s.aiHealthScore !== 'number').length },
      { name: 'Rejected', value: submissions.filter((s) => s.adminStatus === 'rejected').length },
    ]
  }, [submissions])

  return (
    <Box>
      <VStack align="start" spacing={6} mb={8}>
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Heading size="xl">User Profile</Heading>
          <Text color="gray.600">Overview, submissions, analytics and wallet</Text>
        </MotionBox>
      </VStack>

      <Tabs variant="soft-rounded" colorScheme="brand">
        <TabList mb={4}>
          <Tab>Overview</Tab>
          <Tab>Submissions</Tab>
          <Tab>Analytics</Tab>
          <Tab>Wallet</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={4}>
              <Card bg={cardBg}><CardBody><VStack align="start" spacing={1}><Text fontSize="sm" color="gray.600">Name</Text><Text fontWeight="semibold">John Doe</Text></VStack></CardBody></Card>
              <Card bg={cardBg}><CardBody><VStack align="start" spacing={1}><Text fontSize="sm" color="gray.600">Role</Text><Badge colorScheme="ocean">NGO</Badge></VStack></CardBody></Card>
              <Card bg={cardBg}><CardBody><VStack align="start" spacing={1}><Text fontSize="sm" color="gray.600">Organization</Text><Text>BlueCarbon Foundation</Text></VStack></CardBody></Card>
              <Card bg={cardBg}><CardBody><VStack align="start" spacing={1}><Text fontSize="sm" color="gray.600">Region</Text><Text>Maharashtra</Text></VStack></CardBody></Card>
            </SimpleGrid>

            <SimpleGrid mt={4} columns={{ base: 1, md: 2, xl: 4 }} spacing={4}>
              <Card bg={cardBg}><CardBody><Text fontSize="sm" color="gray.600">Total Plots Submitted</Text><Heading size="lg">{stats.total}</Heading></CardBody></Card>
              <Card bg={cardBg}><CardBody><Text fontSize="sm" color="gray.600">Credits Earned</Text><Heading size="lg">{stats.credits}</Heading></CardBody></Card>
              <Card bg={cardBg}><CardBody><Text fontSize="sm" color="gray.600">Pending</Text><Heading size="lg">{stats.pending}</Heading></CardBody></Card>
              <Card bg={cardBg}><CardBody><Text fontSize="sm" color="gray.600">Approved</Text><Heading size="lg">{stats.approved}</Heading></CardBody></Card>
            </SimpleGrid>

            <SimpleGrid mt={4} columns={{ base: 1, lg: 2 }} spacing={4}>
              <Card bg={cardBg}>
                <CardBody>
                  <Heading size="sm" mb={3}>Latest AI Verification</Heading>
                  {stats.latest ? (
                    <VStack align="start" spacing={1}>
                      <HStack><Text>Health Score:</Text><Badge colorScheme={stats.latest.aiHealthScore! > 85 ? 'green' : 'yellow'}>{stats.latest.aiHealthScore}%</Badge></HStack>
                      <Text>Tree Density: {stats.latest.metrics?.treeDensity} trees/ha</Text>
                      <Text>Canopy Coverage: {stats.latest.metrics?.canopyCoverage}%</Text>
                      <Text>Survival Rate: {stats.latest.metrics?.survivalRate}%</Text>
                    </VStack>
                  ) : (
                    <Text color="gray.500">No AI results yet.</Text>
                  )}
                </CardBody>
              </Card>
              <Card bg={cardBg}><CardBody><Heading size="sm" mb={3}>Notifications</Heading><VStack align="start" spacing={2}><Text>Admin approved submission #001</Text><Text>AI model updated for Plot B</Text><Text>9 credits minted for Plot A</Text></VStack></CardBody></Card>
            </SimpleGrid>
          </TabPanel>

          <TabPanel p={0}>
            <HStack mb={3} spacing={3}>
              <Select maxW="200px" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>
              <Select maxW="200px" value={sortKey} onChange={(e) => setSortKey(e.target.value as any)}>
                <option value="date">Sort by Date</option>
                <option value="score">Sort by Score</option>
                <option value="status">Sort by Status</option>
              </Select>
            </HStack>
            <Card bg={cardBg}>
              <CardBody>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Submission ID</Th>
                      <Th>Project Name</Th>
                      <Th isNumeric>AI Health Score</Th>
                      <Th>Status</Th>
                      <Th isNumeric>Credits</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filtered.map((s) => (
                      <Tr key={s.id}>
                        <Td>{s.id.slice(0, 8)}</Td>
                        <Td>{s.projectName}</Td>
                        <Td isNumeric>{typeof s.aiHealthScore === 'number' ? `${s.aiHealthScore}%` : '-'}</Td>
                        <Td><Badge colorScheme={s.adminStatus === 'approved' ? 'green' : s.adminStatus === 'rejected' ? 'red' : 'orange'}>{s.adminStatus}</Badge></Td>
                        <Td isNumeric>{s.mintedCredits || '-'}</Td>
                        <Td>
                          <HStack>
                            <Button size="xs" variant="outline" onClick={() => navigate('/verifications')}>View</Button>
                            <Button size="xs" onClick={() => toast({ title: 'Re-upload simulated', status: 'info' })}>Re-upload</Button>
                            <Button size="xs" variant="ghost" onClick={() => navigate('/verifications')}>Adjust</Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel p={0}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
              <Card bg={cardBg}>
                <CardBody>
                  <Heading size="sm" mb={3}>Credits Earned Over Time</Heading>
                  <Box height="260px">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={creditsOverTime} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="credits" stroke="#0A9396" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>
              <Card bg={cardBg}>
                <CardBody>
                  <Heading size="sm" mb={3}>Submission Status Breakdown</Heading>
                  <Box height="260px">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                          {statusPie.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>
            </SimpleGrid>
          </TabPanel>

          <TabPanel p={0}>
            <Card bg={cardBg}>
              <CardBody>
                <Heading size="sm" mb={3}>Wallet</Heading>
                <Text>Total Carbon Credits: {stats.credits}</Text>
                <Text color="gray.600" fontSize="sm">Token balances and transfers TBD.</Text>
                {/* TODO: Integrate real wallet and token balances */}
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
