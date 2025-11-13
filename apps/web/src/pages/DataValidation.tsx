import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Icon,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { FiEye, FiRefreshCw } from 'react-icons/fi'
import { useState, useEffect } from 'react'

interface ValidationRecord {
  id: string;
  ecosystemType: string;
  location: string;
  species: string;
  status: 'pending' | 'valid' | 'invalid';
  errors: string[];
  warnings: string[];
  submittedAt: string;
  validatedAt?: string;
}

export function DataValidation() {
  const [validationRecords, setValidationRecords] = useState<ValidationRecord[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.800');

  // Mock data for validation records
  useEffect(() => {
    const mockRecords: ValidationRecord[] = [
      {
        id: 'val_001',
        ecosystemType: 'Mangrove',
        location: 'Sundarbans, West Bengal',
        species: 'Rhizophora mucronata',
        status: 'valid',
        errors: [],
        warnings: ['Carbon stock slightly above typical range'],
        submittedAt: '2024-01-20T10:30:00Z',
        validatedAt: '2024-01-20T11:15:00Z',
      },
      {
        id: 'val_002',
        ecosystemType: 'Seagrass',
        location: 'Kerala Backwaters',
        species: 'Halophila ovalis',
        status: 'invalid',
        errors: ['Invalid coordinates', 'Species not found in database'],
        warnings: [],
        submittedAt: '2024-01-20T09:45:00Z',
        validatedAt: '2024-01-20T10:20:00Z',
      },
      {
        id: 'val_003',
        ecosystemType: 'Salt Marsh',
        location: 'Gujarat Coast',
        species: 'Salicornia brachiata',
        status: 'pending',
        errors: [],
        warnings: [],
        submittedAt: '2024-01-20T14:20:00Z',
      },
    ];
    setValidationRecords(mockRecords);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'green';
      case 'invalid': return 'red';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  const validateAllPending = async () => {
    setIsValidating(true);
    // Simulate validation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setValidationRecords(prev => 
      prev.map(record => 
        record.status === 'pending' 
          ? { ...record, status: 'valid' as const, validatedAt: new Date().toISOString() }
          : record
      )
    );
    setIsValidating(false);
  };

  const pendingCount = validationRecords.filter(r => r.status === 'pending').length;
  const validCount = validationRecords.filter(r => r.status === 'valid').length;
  const invalidCount = validationRecords.filter(r => r.status === 'invalid').length;

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <VStack align="start" spacing={4}>
          <Heading size="xl" color="blue.600">
            Data Validation
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Review and validate uploaded ecosystem data against FSI, MoSPI, and NCCR datasets.
            Ensure data quality and compliance with blue carbon standards.
          </Text>
        </VStack>

        {/* Validation Stats */}
        <Card bg={cardBg}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Heading size="md">Validation Summary</Heading>
                <Button
                  leftIcon={<Icon as={FiRefreshCw} />}
                  onClick={validateAllPending}
                  isLoading={isValidating}
                  loadingText="Validating..."
                  colorScheme="blue"
                  size="sm"
                >
                  Validate All Pending
                </Button>
              </HStack>
              
              <HStack spacing={6}>
                <VStack spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    {validCount}
                  </Text>
                  <Text fontSize="sm" color="gray.600">Valid Records</Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="red.500">
                    {invalidCount}
                  </Text>
                  <Text fontSize="sm" color="gray.600">Invalid Records</Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="yellow.500">
                    {pendingCount}
                  </Text>
                  <Text fontSize="sm" color="gray.600">Pending Validation</Text>
                </VStack>
              </HStack>

              {pendingCount > 0 && (
                <Alert status="info">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Pending Validations</AlertTitle>
                    <AlertDescription>
                      {pendingCount} records are waiting for validation. Click "Validate All Pending" to process them.
                    </AlertDescription>
                  </Box>
                </Alert>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Validation Records Table */}
        <Card bg={cardBg}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Validation Records</Heading>
              
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Ecosystem</Th>
                      <Th>Location</Th>
                      <Th>Species</Th>
                      <Th>Status</Th>
                      <Th>Issues</Th>
                      <Th>Submitted</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {validationRecords.map((record) => (
                      <Tr key={record.id}>
                        <Td>
                          <Text fontSize="sm" fontFamily="mono">
                            {record.id}
                          </Text>
                        </Td>
                        <Td>
                          <Badge colorScheme="blue">
                            {record.ecosystemType}
                          </Badge>
                        </Td>
                        <Td>
                          <Text fontSize="sm" noOfLines={1}>
                            {record.location}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm" fontStyle="italic">
                            {record.species}
                          </Text>
                        </Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </Td>
                        <Td>
                          <VStack spacing={1} align="start">
                            {record.errors.length > 0 && (
                              <Text fontSize="xs" color="red.500">
                                {record.errors.length} error(s)
                              </Text>
                            )}
                            {record.warnings.length > 0 && (
                              <Text fontSize="xs" color="orange.500">
                                {record.warnings.length} warning(s)
                              </Text>
                            )}
                            {record.errors.length === 0 && record.warnings.length === 0 && (
                              <Text fontSize="xs" color="green.500">
                                No issues
                              </Text>
                            )}
                          </VStack>
                        </Td>
                        <Td>
                          <Text fontSize="xs" color="gray.500">
                            {new Date(record.submittedAt).toLocaleDateString()}
                          </Text>
                        </Td>
                        <Td>
                          <Button
                            size="xs"
                            leftIcon={<Icon as={FiEye} />}
                            variant="outline"
                          >
                            View
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
