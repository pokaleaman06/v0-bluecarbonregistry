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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listSubmissions, setAdminDecision, mintTokens, runAiVerification, adjustAiResults } from '../api/verificationMock'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts'
import { useMemo, useState } from 'react'

export function AdminProfile() {
  const cardBg = useColorModeValue('white', 'gray.800')
  const toast = useToast()
  const queryClient = useQueryClient()
  const { data: submissions = [] } = useQuery({ queryKey: ['submissions'], queryFn: listSubmissions })

  const [regionFilter, setRegionFilter] = useState<'all' | 'west' | 'east' | 'south' | 'north'>('all')
  const [projectFilter, setProjectFilter] = useState<string>('all')

  const approveMutation = useMutation({
    mutationFn: (id: string) => setAdminDecision(id, 'approved'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['submissions'] }),
  })
  const rejectMutation = useMutation({
    mutationFn: (id: string) => setAdminDecision(id, 'rejected'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['submissions'] }),
  })
  const adjustMutation = useMutation({
    mutationFn: ({ id, score }: { id: string; score: number }) => adjustAiResults(id, { aiHealthScore: score }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['submissions'] }),
  })
  const mintMutation = useMutation({
    mutationFn: (id: string) => mintTokens(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['submissions'] }),
  })

  const stats = useMemo(() => {
    const reviewed = submissions.filter((s) => s.adminStatus === 'approved' || s.adminStatus === 'rejected').length
    const issued = submissions.reduce((sum, s) => sum + (s.mintedCredits || 0), 0)
    const pending = submissions.filter((s) => s.adminStatus === 'pending').length
    return { reviewed, issued, pending }
  }, [submissions])

  const creditsPerProject = useMemo(() => {
    const map = new Map<string, number>()
    for (const s of submissions) {
      const key = s.projectName
      map.set(key, (map.get(key) || 0) + (s.mintedCredits || 0))
    }
    return Array.from(map.entries()).map(([project, credits]) => ({ project, credits }))
  }, [submissions])

  const submissionsOverTime = useMemo(() => {
    const map = new Map<string, number>()
    for (const s of submissions) {
      const date = new Date(s.submittedAt).toLocaleDateString()
      map.set(date, (map.get(date) || 0) + 1)
    }
    return Array.from(map.entries()).map(([date, total]) => ({ date, total }))
  }, [submissions])

  const filtered = submissions.filter((s) => (projectFilter === 'all' ? true : s.projectName === projectFilter))

  return (
    <Box>
      <VStack align="start" spacing={6} mb={8}>
        <Heading size="xl">Admin Profile</Heading>
        <Text color="gray.600">Manage verifications, credits, and analytics</Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3, xl: 3 }} spacing={4}>
        <Card bg={cardBg}><CardBody><Text fontSize="sm" color="gray.600">Total Reviewed</Text><Heading size="lg">{stats.reviewed}</Heading></CardBody></Card>
        <Card bg={cardBg}><CardBody><Text fontSize="sm" color="gray.600">Credits Issued</Text><Heading size="lg">{stats.issued}</Heading></CardBody></Card>
        <Card bg={cardBg}><CardBody><Text fontSize="sm" color="gray.600">Pending Verifications</Text><Heading size="lg">{stats.pending}</Heading></CardBody></Card>
      </SimpleGrid>

      <SimpleGrid mt={4} columns={{ base: 1, lg: 2 }} spacing={4}>
        <Card bg={cardBg}>
          <CardBody>
            <Heading size="sm" mb={3}>Credits Issued per Project</Heading>
            <Box height="260px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={creditsPerProject}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="project" hide={false} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="credits" fill="#0A9396" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
        <Card bg={cardBg}>
          <CardBody>
            <Heading size="sm" mb={3}>Submissions Reviewed Over Time</Heading>
            <Box height="260px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={submissionsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#005F73" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card mt={4} bg={cardBg}>
        <CardBody>
          <HStack mb={3} spacing={3}>
            <Select maxW="220px" value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
              <option value="all">All Projects</option>
              {Array.from(new Set(submissions.map((s) => s.projectName))).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
          </HStack>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Submission ID</Th>
                <Th>Project</Th>
                <Th isNumeric>AI Health</Th>
                <Th>Status</Th>
                <Th isNumeric>Credits</Th>
                <Th>Admin Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((s) => (
                <Tr key={s.id}>
                  <Td>{s.id.slice(0, 8)}</Td>
                  <Td>{s.projectName}</Td>
                  <Td isNumeric>{typeof s.aiHealthScore === 'number' ? `${s.aiHealthScore}%` : '-'}</Td>
                  <Td><Badge colorScheme={s.adminStatus === 'approved' ? 'green' : s.adminStatus === 'rejected' ? 'red' : s.adminStatus === 'adjusted' ? 'yellow' : 'orange'}>{s.adminStatus}</Badge></Td>
                  <Td isNumeric>{s.mintedCredits || '-'}</Td>
                  <Td>
                    <HStack>
                      <Button size="xs" colorScheme="green" onClick={async () => {
                        await approveMutation.mutateAsync(s.id)
                        toast({ title: 'Approved', status: 'success' })
                        const res = await mintMutation.mutateAsync(s.id)
                        toast({ title: `${res.mintedCredits} credits minted`, status: 'success' })
                      }}>Approve</Button>
                      <Button size="xs" variant="outline" colorScheme="red" onClick={async () => {
                        await rejectMutation.mutateAsync(s.id)
                        toast({ title: 'Rejected', status: 'error' })
                      }}>Reject</Button>
                      <Button size="xs" variant="ghost" onClick={async () => {
                        const newScore = Math.min(100, Math.max(0, (s.aiHealthScore || 80) + (Math.random() * 10 - 5)))
                        await adjustMutation.mutateAsync({ id: s.id, score: Math.round(newScore) })
                        toast({ title: 'Adjusted score', status: 'info' })
                      }}>Adjust</Button>
                      <Button size="xs" variant="outline" onClick={async () => {
                        await runAiVerification(s.id)
                        queryClient.invalidateQueries({ queryKey: ['submissions'] })
                        toast({ title: 'Re-ran AI', status: 'info' })
                      }}>Re-run AI</Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <Card mt={4} bg={cardBg}>
        <CardBody>
          <Heading size="sm" mb={3}>Audit Trail</Heading>
          <VStack align="start" spacing={2}>
            <Text>Admin approved submission #001</Text>
            <Text>AI score adjusted for Plot B</Text>
            <Text>Blockchain transaction simulated for Plot A</Text>
          </VStack>
          {/* TODO: Replace with real audit logs */}
        </CardBody>
      </Card>
    </Box>
  )
}
