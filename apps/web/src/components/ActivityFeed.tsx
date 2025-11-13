import {
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Heading,
  useColorModeValue,
  Box,
  Icon,
} from '@chakra-ui/react'
import { FiCheck, FiUpload, FiAward } from 'react-icons/fi'

const activities = [
  {
    id: '1',
    type: 'verification',
    user: 'Dr. Rajesh Kumar',
    action: 'verified field data for',
    project: 'Sundarbans Restoration',
    time: '2 hours ago',
    icon: FiCheck,
    color: 'green',
  },
  {
    id: '2',
    type: 'submission',
    user: 'Priya Sharma',
    action: 'submitted new data for',
    project: 'Kerala Backwaters',
    time: '4 hours ago',
    icon: FiUpload,
    color: 'blue',
  },
  {
    id: '3',
    type: 'credit',
    user: 'System',
    action: 'issued 125 carbon credits for',
    project: 'Gujarat Coastal',
    time: '6 hours ago',
    icon: FiAward,
    color: 'purple',
  },
  {
    id: '4',
    type: 'verification',
    user: 'Dr. Sarah Wilson',
    action: 'verified field data for',
    project: 'Maharashtra Coast',
    time: '1 day ago',
    icon: FiCheck,
    color: 'green',
  },
]

export function ActivityFeed() {
  const cardBg = useColorModeValue('white', 'gray.800')

  return (
    <Card bg={cardBg} borderRadius="2xl" boxShadow="sm" h="full">
      <CardBody>
        <VStack align="start" spacing={4} h="full">
          <Heading size="md">Recent Activity</Heading>
          
          <VStack spacing={4} align="stretch" flex={1} w="full">
            {activities.map((activity) => (
              <HStack key={activity.id} spacing={3} align="start">
                <Box
                  w={8}
                  h={8}
                  bg={`${activity.color}.100`}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Icon as={activity.icon} w={4} h={4} color={`${activity.color}.600`} />
                </Box>
                
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="sm" lineHeight="short">
                    <Text as="span" fontWeight="medium">
                      {activity.user}
                    </Text>{' '}
                    {activity.action}{' '}
                    <Text as="span" fontWeight="medium" color="brand.600">
                      {activity.project}
                    </Text>
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {activity.time}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  )
}
