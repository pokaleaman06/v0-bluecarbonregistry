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
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FiTrendingUp, FiMapPin, FiAward, FiClock } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { InteractiveMap } from '../components/InteractiveMap'
import { ActivityFeed } from '../components/ActivityFeed'
import { QuickActions } from '../components/QuickActions'

const MotionBox = motion(Box)

export function Dashboard() {
  const { t } = useTranslation()
  const cardBg = useColorModeValue('white', 'gray.800')

  const stats = [
    {
      label: t('dashboard.stats.verifiedArea'),
      value: '2,847',
      unit: 'hectares',
      change: 12.5,
      icon: FiMapPin,
      color: 'green',
    },
    {
      label: t('dashboard.stats.tokenizedCredits'),
      value: '8,924',
      unit: 'tCO₂',
      change: 8.2,
      icon: FiAward,
      color: 'blue',
    },
    {
      label: t('dashboard.stats.activeProjects'),
      value: '156',
      unit: 'projects',
      change: 15.3,
      icon: FiTrendingUp,
      color: 'purple',
    },
    {
      label: t('dashboard.stats.pendingVerifications'),
      value: '23',
      unit: 'pending',
      change: -5.1,
      icon: FiClock,
      color: 'orange',
    },
  ]

  return (
    <Box>
      <VStack align="start" spacing={6} mb={8}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="xl" color="gray.800">
            {t('dashboard.welcome')}
          </Heading>
          <Text color="gray.600" fontSize="lg" mt={2}>
            Monitor and manage India's blue carbon restoration projects
          </Text>
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
                      {Math.abs(stat.change)}% from last month
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </MotionBox>
          </GridItem>
        ))}
      </Grid>

      <Grid templateColumns={{ base: '1fr', xl: '2fr 1fr' }} gap={6} mb={8}>
        <GridItem>
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card bg={cardBg} borderRadius="2xl" boxShadow="sm" h="500px">
              <CardBody>
                <HStack justify="space-between" mb={4}>
                  <Heading size="md">Project Locations</Heading>
                  <Button size="sm" variant="ghost" colorScheme="brand">
                    View All
                  </Button>
                </HStack>
                <InteractiveMap />
              </CardBody>
            </Card>
          </MotionBox>
        </GridItem>

        <GridItem>
          <VStack spacing={6} h="full">
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              w="full"
            >
              <QuickActions />
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              w="full"
              flex={1}
            >
              <ActivityFeed />
            </MotionBox>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  )
}
