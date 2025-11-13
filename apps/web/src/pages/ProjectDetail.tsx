import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  HStack,
  VStack,
  Badge,
  Icon,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { FiMapPin, FiCalendar, FiUser, FiDownload } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { InteractiveMap } from '../components/InteractiveMap'

const MotionBox = motion(Box)

export function ProjectDetail() {
  const { id } = useParams()
  const cardBg = useColorModeValue('white', 'gray.800')

  // Mock project data
  const project = {
    id,
    name: 'Sundarbans Mangrove Restoration',
    description: 'Large-scale mangrove restoration project in the Sundarbans delta region, focusing on biodiversity conservation and carbon sequestration.',
    location: 'West Bengal, India',
    area: 245.6,
    verifiedArea: 189.3,
    credits: 1250,
    status: 'active',
    owner: 'Sundarbans Foundation',
    createdAt: '2024-01-15',
    coordinates: [22.2587, 88.9414] as [number, number],
  }

  const stats = [
    {
      label: 'Total Area',
      value: `${project.area} ha`,
      helpText: 'Project boundary',
    },
    {
      label: 'Verified Area',
      value: `${project.verifiedArea} ha`,
      helpText: `${((project.verifiedArea / project.area) * 100).toFixed(1)}% verified`,
    },
    {
      label: 'Carbon Credits',
      value: `${project.credits} tCO₂`,
      helpText: 'Total issued',
    },
    {
      label: 'Sequestration Rate',
      value: '3.14 tCO₂/ha/yr',
      helpText: 'Average rate',
    },
  ]

  return (
    <Box>
      <VStack align="start" spacing={6} mb={8}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          w="full"
        >
          <HStack justify="space-between" align="start" mb={4}>
            <VStack align="start" spacing={2}>
              <HStack>
                <Badge
                  colorScheme="green"
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  Active
                </Badge>
              </HStack>
              <Heading size="xl" color="gray.800">
                {project.name}
              </Heading>
              <Text color="gray.600" fontSize="lg" maxW="2xl">
                {project.description}
              </Text>
            </VStack>

            <Button
              leftIcon={<Icon as={FiDownload} />}
              colorScheme="brand"
              variant="outline"
              borderRadius="2xl"
            >
              Export Data
            </Button>
          </HStack>

          <HStack spacing={6} color="gray.600">
            <HStack spacing={2}>
              <Icon as={FiMapPin} w={4} h={4} />
              <Text fontSize="sm">{project.location}</Text>
            </HStack>
            <HStack spacing={2}>
              <Icon as={FiUser} w={4} h={4} />
              <Text fontSize="sm">{project.owner}</Text>
            </HStack>
            <HStack spacing={2}>
              <Icon as={FiCalendar} w={4} h={4} />
              <Text fontSize="sm">Started {project.createdAt}</Text>
            </HStack>
          </HStack>
        </MotionBox>
      </VStack>

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
                    <StatLabel fontSize="sm" color="gray.600">
                      {stat.label}
                    </StatLabel>
                    <StatNumber fontSize="xl" fontWeight="bold">
                      {stat.value}
                    </StatNumber>
                    <StatHelpText fontSize="xs">
                      {stat.helpText}
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </MotionBox>
          </GridItem>
        ))}
      </Grid>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card bg={cardBg} borderRadius="2xl" boxShadow="sm">
          <CardBody>
            <Tabs variant="soft-rounded" colorScheme="brand">
              <TabList mb={6}>
                <Tab>Overview</Tab>
                <Tab>Field Data</Tab>
                <Tab>Verifications</Tab>
                <Tab>Carbon Credits</Tab>
                <Tab>Timeline</Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
                    <GridItem>
                      <VStack align="start" spacing={4}>
                        <Heading size="md">Project Map</Heading>
                        <Box h="400px" w="full" borderRadius="2xl" overflow="hidden">
                          <InteractiveMap center={project.coordinates} />
                        </Box>
                      </VStack>
                    </GridItem>
                    <GridItem>
                      <VStack align="start" spacing={4}>
                        <Heading size="md">Project Details</Heading>
                        <Text color="gray.600">
                          This project focuses on restoring mangrove ecosystems in the Sundarbans region,
                          one of the world's largest mangrove forests. The restoration efforts include
                          planting native mangrove species, protecting existing forests, and monitoring
                          carbon sequestration rates.
                        </Text>
                        <VStack align="start" spacing={2} w="full">
                          <Text fontWeight="semibold">Key Objectives:</Text>
                          <Text fontSize="sm" color="gray.600">• Restore 245.6 hectares of mangrove forest</Text>
                          <Text fontSize="sm" color="gray.600">• Sequester 1,250+ tons of CO₂ annually</Text>
                          <Text fontSize="sm" color="gray.600">• Protect coastal communities from erosion</Text>
                          <Text fontSize="sm" color="gray.600">• Enhance biodiversity and fish habitats</Text>
                        </VStack>
                      </VStack>
                    </GridItem>
                  </Grid>
                </TabPanel>

                <TabPanel p={0}>
                  <Text color="gray.600">Field data collection and monitoring information will be displayed here.</Text>
                </TabPanel>

                <TabPanel p={0}>
                  <Text color="gray.600">Verification status and history will be displayed here.</Text>
                </TabPanel>

                <TabPanel p={0}>
                  <Text color="gray.600">Carbon credit issuance and trading information will be displayed here.</Text>
                </TabPanel>

                <TabPanel p={0}>
                  <Text color="gray.600">Project timeline and milestones will be displayed here.</Text>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </MotionBox>
    </Box>
  )
}
