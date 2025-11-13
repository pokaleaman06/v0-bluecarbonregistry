import {
  Card,
  CardBody,
  VStack,
  Button,
  Heading,
  useColorModeValue,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react'
import { FiPlus, FiCheck, FiBarChart, FiDownload } from 'react-icons/fi'

const actions = [
  {
    label: 'New Project',
    icon: FiPlus,
    colorScheme: 'brand',
    action: () => console.log('Create new project'),
  },
  {
    label: 'Verify Data',
    icon: FiCheck,
    colorScheme: 'green',
    action: () => console.log('Verify data'),
  },
  {
    label: 'View Analytics',
    icon: FiBarChart,
    colorScheme: 'purple',
    action: () => console.log('View analytics'),
  },
  {
    label: 'Export Report',
    icon: FiDownload,
    colorScheme: 'blue',
    action: () => console.log('Export report'),
  },
]

export function QuickActions() {
  const cardBg = useColorModeValue('white', 'gray.800')

  return (
    <Card bg={cardBg} borderRadius="2xl" boxShadow="sm">
      <CardBody>
        <VStack align="start" spacing={4}>
          <Heading size="md">Quick Actions</Heading>
          
          <SimpleGrid columns={2} spacing={3} w="full">
            {actions.map((action) => (
              <Button
                key={action.label}
                leftIcon={<Icon as={action.icon} />}
                colorScheme={action.colorScheme}
                variant="outline"
                size="sm"
                borderRadius="xl"
                onClick={action.action}
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'md',
                }}
                transition="all 0.2s"
              >
                {action.label}
              </Button>
            ))}
          </SimpleGrid>
        </VStack>
      </CardBody>
    </Card>
  )
}
