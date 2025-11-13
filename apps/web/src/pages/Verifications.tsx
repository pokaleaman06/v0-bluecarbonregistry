import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Card,
  CardBody,
  Progress,
  Input,
  Image,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createSubmission,
  runAiVerification,
  setAdminDecision,
  mintTokens,
  listSubmissions,
  adjustAiResults,
  type SubmissionRecord,
} from '../api/verificationMock'

const MotionBox = motion(Box)

export function Verifications() {
  const cardBg = useColorModeValue('white', 'gray.800')
  const toast = useToast()
  const queryClient = useQueryClient()

  const [projectName, setProjectName] = useState('Demo Mangrove Plot A')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isAdjustOpen, setIsAdjustOpen] = useState(false)
  const [adjustValue, setAdjustValue] = useState<number>(85)

  const { data: submissions } = useQuery({
    queryKey: ['submissions'],
    queryFn: listSubmissions,
  })

  const active = useMemo<SubmissionRecord | undefined>(() => {
    return submissions?.find((s) => s.id === activeId) || submissions?.[0]
  }, [submissions, activeId])

  const createMutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['submissions'] }),
  })

  const aiMutation = useMutation({
    mutationFn: (id: string) => runAiVerification(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['submissions'] }),
  })

  const decisionMutation = useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: 'approved' | 'rejected' }) =>
      setAdminDecision(id, decision),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['submissions'] }),
  })

  const adjustMutation = useMutation({
    mutationFn: ({ id, score }: { id: string; score: number }) =>
      adjustAiResults(id, { aiHealthScore: score }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['submissions'] }),
  })

  const mintMutation = useMutation({
    mutationFn: (id: string) => mintTokens(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['submissions'] }),
  })

  const startScan = async (submissionId: string) => {
    setIsScanning(true)
    setProgress(0)
    setActiveId(submissionId)
    const timer = setInterval(() => {
      setProgress((p) => Math.min(99, p + Math.floor(Math.random() * 15)))
    }, 250)
    try {
      await aiMutation.mutateAsync(submissionId)
      setProgress(100)
    } finally {
      clearInterval(timer)
      setTimeout(() => setIsScanning(false), 400)
    }
  }

  const onUpload = async () => {
    let imageUrl = imagePreview
    if (!imageUrl) {
      // fallback demo image
      imageUrl =
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&w=1200&q=60'
    }
    const rec = await createMutation.mutateAsync({ projectName, imageUrl })
    toast({ title: 'Submission created', status: 'success', duration: 2000, isClosable: true })
    await startScan(rec.id)
  }

  const onApprove = async (id: string) => {
    await decisionMutation.mutateAsync({ id, decision: 'approved' })
    toast({ title: 'Admin approved submission', status: 'success' })
    const res = await mintMutation.mutateAsync(id)
    toast({
      title: `${res.mintedCredits} Carbon Credits minted to NGO wallet`,
      description: `Token ${res.tokenId} • Tx ${res.txHash?.slice(0, 10)}...`,
      status: 'success',
    })
  }

  const onReject = async (id: string) => {
    await decisionMutation.mutateAsync({ id, decision: 'rejected' })
    toast({ title: 'Admin rejected submission', status: 'error' })
  }

  const onAdjust = async () => {
    if (!active) return
    await adjustMutation.mutateAsync({ id: active.id, score: adjustValue })
    setIsAdjustOpen(false)
    toast({ title: 'Score adjusted', status: 'info' })
  }

  return (
    <Box>
      <VStack align="start" spacing={6} mb={8}>
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Heading size="xl" color="gray.800">AI Verification + Tokenization</Heading>
          <Text color="gray.600" fontSize="lg" mt={2}>Upload a drone image, run AI, approve, and mint credits.</Text>
        </MotionBox>
      </VStack>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card bg={cardBg}>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Heading size="md">AI Verification</Heading>
              <FormControl>
                <FormLabel>Project Name</FormLabel>
                <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g., Sundarbans Plot 12" />
              </FormControl>
              <FormControl>
                <FormLabel>Upload Drone Image</FormLabel>
                <Input type="file" accept="image/*" onChange={(e) => {
                  const f = e.target.files?.[0] || null
                  setImageFile(f || null)
                  if (f) {
                    const reader = new FileReader()
                    reader.onload = () => setImagePreview(reader.result as string)
                    reader.readAsDataURL(f)
                  } else {
                    setImagePreview('')
                  }
                }} />
              </FormControl>
              {imagePreview && (
                <Image src={imagePreview} alt="preview" borderRadius="xl" objectFit="cover" maxH="240px" />
              )}
              <Button onClick={onUpload} isLoading={createMutation.isPending || aiMutation.isPending} loadingText="Processing">
                Start AI Verification
              </Button>
              {isScanning && (
                <Box>
                  <Text mb={2} fontWeight="medium">AI Verification in Progress…</Text>
                  <Progress value={progress} colorScheme="ocean" borderRadius="xl" />
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Heading size="md">Results & Admin Oversight</Heading>
              {active ? (
                <>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="semibold">{active.projectName}</Text>
                      <Text fontSize="sm" color="gray.500">Submitted {new Date(active.submittedAt).toLocaleString()}</Text>
                    </VStack>
                    <Badge colorScheme={
                      active.adminStatus === 'approved' ? 'green' : active.adminStatus === 'rejected' ? 'red' : active.adminStatus === 'adjusted' ? 'yellow' : 'orange'
                    } borderRadius="full" px={3} py={1}>
                      {active.adminStatus}
                    </Badge>
                  </HStack>

                  {typeof active.aiHealthScore === 'number' ? (
                    <Card bg={useColorModeValue('gray.50', 'gray.700')}>
                      <CardBody>
                        <HStack justify="space-between" mb={3}>
                          <Text>AI Health Score</Text>
                          <Badge colorScheme={active.aiHealthScore > 85 ? 'green' : 'yellow'}>{active.aiHealthScore}%</Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.600" mb={4}>AI model estimates high mangrove health in this plot.</Text>
                        <SimpleGrid columns={3} spacing={3}>
                          <Stat>
                            <StatLabel>Tree Density</StatLabel>
                            <StatNumber>{active.metrics?.treeDensity}</StatNumber>
                            <StatHelpText>trees/ha = 50 + score/2</StatHelpText>
                          </Stat>
                          <Stat>
                            <StatLabel>Canopy Coverage</StatLabel>
                            <StatNumber>{active.metrics?.canopyCoverage}%</StatNumber>
                            <StatHelpText>% = score × 0.8</StatHelpText>
                          </Stat>
                          <Stat>
                            <StatLabel>Survival Rate</StatLabel>
                            <StatNumber>{active.metrics?.survivalRate}%</StatNumber>
                            <StatHelpText>% = score − 10</StatHelpText>
                          </Stat>
                        </SimpleGrid>
                      </CardBody>
                    </Card>
                  ) : (
                    <Text color="gray.500">Run AI to view calculated metrics.</Text>
                  )}

                  <HStack>
                    <Button variant="outline" onClick={() => active && startScan(active.id)} isDisabled={!active}>
                      Re-run AI
                    </Button>
                    <Button colorScheme="green" onClick={() => active && onApprove(active.id)} isDisabled={!active || active.adminStatus === 'approved' || typeof active.aiHealthScore !== 'number'}>
                      Approve
                    </Button>
                    <Button colorScheme="red" variant="outline" onClick={() => active && onReject(active.id)} isDisabled={!active}>
                      Reject
                    </Button>
                    <Button variant="ghost" onClick={() => {
                      setAdjustValue(active?.aiHealthScore ?? 85)
                      setIsAdjustOpen(true)
                    }} isDisabled={!active || typeof active.aiHealthScore !== 'number'}>
                      Adjust
                    </Button>
                  </HStack>

                  {active.mintedCredits ? (
                    <Card bg={useColorModeValue('green.50', 'green.900')}>
                      <CardBody>
                        <Heading size="sm" mb={2}>Tokenization Complete</Heading>
                        <Text>{active.mintedCredits} Carbon Credits minted to NGO wallet.</Text>
                        <Text fontSize="sm" color="gray.600">Token ID: {active.tokenId}</Text>
                        <Text fontSize="sm" color="gray.600">Tx Hash: {active.txHash}</Text>
                      </CardBody>
                    </Card>
                  ) : active.adminStatus === 'approved' ? (
                    <Text color="gray.600">Minting in progress or awaiting confirmation…</Text>
                  ) : null}
                </>
              ) : (
                <Text color="gray.500">No submissions yet. Upload an image to begin.</Text>
              )}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card mt={6} bg={cardBg}>
        <CardBody>
          <Heading size="md" mb={4}>Submission History</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
            {submissions?.map((s) => (
              <Card key={s.id} onClick={() => setActiveId(s.id)} cursor="pointer" _hover={{ boxShadow: 'md' }}>
                <CardBody>
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">{s.projectName}</Text>
                      <Badge colorScheme={
                        s.adminStatus === 'approved' ? 'green' : s.adminStatus === 'rejected' ? 'red' : s.adminStatus === 'adjusted' ? 'yellow' : 'orange'
                      }>{s.adminStatus}</Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">{new Date(s.submittedAt).toLocaleString()}</Text>
                    {typeof s.aiHealthScore === 'number' && (
                      <HStack>
                        <Badge colorScheme={s.aiHealthScore > 85 ? 'green' : 'yellow'}>{s.aiHealthScore}%</Badge>
                        <Text fontSize="sm" color="gray.600">Credits: {Math.floor(s.aiHealthScore / 10)}</Text>
                      </HStack>
                    )}
                    {s.mintedCredits && (
                      <Text fontSize="sm" color="gray.600">Minted: {s.mintedCredits} • {s.tokenId}</Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      <Modal isOpen={isAdjustOpen} onClose={() => setIsAdjustOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adjust AI Health Score</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Health Score (%)</FormLabel>
              <NumberInput min={0} max={100} value={adjustValue} onChange={(value) => setAdjustValue(Number(value))}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <Text mt={4} fontSize="sm" color="gray.600">Metrics update rules:</Text>
            <VStack align="start" spacing={1} mt={1}>
              <Text fontSize="sm">Tree Density = 50 + score/2</Text>
              <Text fontSize="sm">Canopy Coverage = score × 0.8</Text>
              <Text fontSize="sm">Survival Rate = score − 10</Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button variant="ghost" onClick={() => setIsAdjustOpen(false)}>Cancel</Button>
              <Button onClick={onAdjust} isLoading={adjustMutation.isPending}>Apply</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
