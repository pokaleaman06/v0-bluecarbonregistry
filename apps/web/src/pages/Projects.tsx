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
  Input,
  Select,
  Flex,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FiPlus, FiMapPin, FiCalendar, FiUser } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MotionBox = motion(Box)

// Mock project data
const mockProjects = [
  {
    id: '1',
    name: 'Sundarbans Mangrove Restoration',
    location: 'West Bengal',
    area: 245.6,
    credits: 1250,
    status: 'active',
    owner: 'Sundarbans Foundation',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Kerala Backwater Conservation',
    location: 'Kerala',
    area: 189.3,
    credits: 890,
    status: 'active',
    owner: 'Kerala Coastal Authority',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Gujarat Coastal Protection',
    location: 'Gujarat',
    area: 312.8,
    credits: 1680,
    status: 'completed',
    owner: 'Gujarat Forest Department',
    createdAt: '2023-11-10',
  },
]

export function Projects() {
  const { t } = useTranslation()
  const cardBg = useColorModeValue('white', 'gray.800')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green'
      case 'completed':
        return 'blue'
      case 'suspended':
        return 'red'
      default:
        return 'gray'
    }
  }

  return (
    <Box>
      <VStack align="start" spacing={6} mb={8}>
        <Flex justify="space-between" align="center" w="full">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading size="xl" color="gray.800">
              {t('projects.title')}
            </Heading>
            <Text color="gray.600" fontSize="lg" mt={2}>
              Manage and monitor blue carbon restoration projects
            </Text>
          </MotionBox>

          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="brand"
            size="lg"
            borderRadius="2xl"
          >
            {t('projects.createNew')}
          </Button>
        </Flex>

        <HStack spacing={4} w="full">
          <Input
            placeholder="Search projects..."
            borderRadius="2xl"
            maxW="300px"
          />
          <Select placeholder="Filter by status" borderRadius="2xl" maxW="200px">
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="suspended">Suspended</option>
          </Select>
          <Select placeholder="Filter by region" borderRadius="2xl" maxW="200px">
            <option value="west-bengal">West Bengal</option>
            <option value="kerala">Kerala</option>
            <option value="gujarat">Gujarat</option>
            <option value="maharashtra">Maharashtra</option>
          </Select>
        </HStack>
      </VStack>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
        {mockProjects.map((project, index) => (
          <GridItem key={project.id}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                bg={cardBg}
                borderRadius="2xl"
                boxShadow="sm"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                }}
                transition="all 0.2s"
                cursor="pointer"
                as={Link}
                to={`/projects/${project.id}`}
              >
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <HStack justify="space-between" w="full">
                      <Badge
                        colorScheme={getStatusColor(project.status)}
                        borderRadius="full"
                        px={3}
                        py={1}
                      >
                        {t(`projects.status.${project.status}`)}
                      </Badge>
                    </HStack>

                    <VStack align="start" spacing={2} w="full">
                      <Heading size="md" noOfLines={2}>
                        {project.name}
                      </Heading>
                      
                      <HStack spacing={2} color="gray.600">
                        <Icon as={FiMapPin} w={4} h={4} />
                        <Text fontSize="sm">{project.location}</Text>
                      </HStack>

                      <HStack spacing={2} color="gray.600">
                        <Icon as={FiUser} w={4} h={4} />
                        <Text fontSize="sm" noOfLines={1}>
                          {project.owner}
                        </Text>
                      </HStack>

                      <HStack spacing={2} color="gray.600">
                        <Icon as={FiCalendar} w={4} h={4} />
                        <Text fontSize="sm">{project.createdAt}</Text>
                      </HStack>
                    </VStack>

                    <Grid templateColumns="1fr 1fr" gap={4} w="full">
                      <VStack align="start" spacing={1}>
                        <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                          {t('projects.details.area')}
                        </Text>
                        <Text fontWeight="semibold">
                          {project.area} ha
                        </Text>
                      </VStack>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                          {t('projects.details.credits')}
                        </Text>
                        <Text fontWeight="semibold">
                          {project.credits} tCO₂
                        </Text>
                      </VStack>
                    </Grid>
                  </VStack>
                </CardBody>
              </Card>
            </MotionBox>
          </GridItem>
        ))}
      </Grid>
    </Box>
  )
}
