/**
 * DataUpload Component for Blue Carbon MRV
 * 
 * INSTRUCTIONS FOR DEVELOPER:
 * - Replace dummy GPS simulation with real GPS capture from mobile devices
 * - Integrate with actual backend API endpoints for data validation
 * - Add real-time data validation against FSI, MoSPI, NCCR datasets
 * - Implement proper error handling for file uploads
 * - Add progress indicators for large file uploads
 */

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Grid,
  GridItem,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiUpload, FiMapPin, FiCheck, FiEye, FiDownload } from 'react-icons/fi';

interface UploadedData {
  id: string;
  ecosystemType: string;
  location: {
    latitude: number;
    longitude: number;
    area: number;
    state: string;
    district: string;
  };
  carbonPools: {
    aboveGroundBiomass: number;
    belowGroundBiomass: number;
    soilOrganicCarbon: number;
  };
  species: string;
  validationStatus: 'pending' | 'valid' | 'invalid';
  validationErrors?: string[];
  timestamp: string;
}

interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export function DataUpload() {
  const [uploadedData, setUploadedData] = useState<UploadedData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [gpsLocation, setGpsLocation] = useState<GPSLocation | null>(null);
  const [isCapturingGPS, setIsCapturingGPS] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState<UploadedData | null>(null);
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');

  // Simulate GPS capture (replace with real GPS implementation)
  const captureGPSLocation = async () => {
    setIsCapturingGPS(true);
    
    // Simulate GPS capture delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock GPS data - replace with real GPS capture
    const mockGPS: GPSLocation = {
      latitude: 22.2587 + (Math.random() - 0.5) * 0.1,
      longitude: 88.9414 + (Math.random() - 0.5) * 0.1,
      accuracy: 5.0,
      timestamp: new Date().toISOString(),
    };
    
    setGpsLocation(mockGPS);
    setIsCapturingGPS(false);
    
    toast({
      title: 'GPS Location Captured',
      description: `Lat: ${mockGPS.latitude.toFixed(6)}, Lng: ${mockGPS.longitude.toFixed(6)}`,
      status: 'success',
      duration: 3000,
    });
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    
    // Simulate file processing
    setIsUploading(true);
    setUploadProgress(0);
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          processFile(file);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Process uploaded file (JSON/CSV)
  const processFile = async (file: File) => {
    try {
      const text = await file.text();
      let data: any[] = [];

      if (file.type === 'application/json') {
        const jsonData = JSON.parse(text);
        data = jsonData.ecosystems || jsonData.species || [];
      } else if (file.name.endsWith('.csv')) {
        // Simple CSV parsing (replace with proper CSV library)
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        data = lines.slice(1).map(line => {
          const values = line.split(',');
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim();
          });
          return obj;
        });
      }

      // Convert to UploadedData format
      const processedData: UploadedData[] = data.map((item, index) => ({
        id: `upload_${Date.now()}_${index}`,
        ecosystemType: item.ecosystemType || 'Unknown',
        location: {
          latitude: parseFloat(item.latitude || item.location?.latitude || '0'),
          longitude: parseFloat(item.longitude || item.location?.longitude || '0'),
          area: parseFloat(item.area || item.location?.area || '0'),
          state: item.state || item.administrativeBoundary?.state || 'Unknown',
          district: item.district || item.administrativeBoundary?.district || 'Unknown',
        },
        carbonPools: {
          aboveGroundBiomass: parseFloat(item.aboveGroundBiomass || item.carbonPools?.aboveGroundBiomass || '0'),
          belowGroundBiomass: parseFloat(item.belowGroundBiomass || item.carbonPools?.belowGroundBiomass || '0'),
          soilOrganicCarbon: parseFloat(item.soilOrganicCarbon || item.carbonPools?.soilOrganicCarbon || '0'),
        },
        species: item.species || item.scientificName || 'Unknown',
        validationStatus: 'pending',
        timestamp: new Date().toISOString(),
      }));

      setUploadedData(prev => [...prev, ...processedData]);
      setIsUploading(false);
      
      toast({
        title: 'File Processed Successfully',
        description: `${processedData.length} records loaded`,
        status: 'success',
        duration: 3000,
      });

    } catch (error) {
      setIsUploading(false);
      toast({
        title: 'File Processing Error',
        description: 'Invalid file format or corrupted data',
        status: 'error',
        duration: 5000,
      });
    }
  };

  // Validate uploaded data
  const validateData = async () => {
    const validationPromises = uploadedData.map(async (item) => {
      // Simulate API call to validation endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const errors: string[] = [];
      
      // Basic validation rules
      if (item.location.latitude < -90 || item.location.latitude > 90) {
        errors.push('Invalid latitude');
      }
      if (item.location.longitude < -180 || item.location.longitude > 180) {
        errors.push('Invalid longitude');
      }
      if (item.carbonPools.aboveGroundBiomass < 0) {
        errors.push('Negative above-ground biomass');
      }
      
      return {
        ...item,
        validationStatus: errors.length === 0 ? 'valid' : 'invalid',
        validationErrors: errors,
      };
    });

    const validatedData = await Promise.all(validationPromises);
    setUploadedData(validatedData as UploadedData[]);
    
    const validCount = validatedData.filter(item => item.validationStatus === 'valid').length;
    
    toast({
      title: 'Data Validation Complete',
      description: `${validCount}/${validatedData.length} records are valid`,
      status: validCount === validatedData.length ? 'success' : 'warning',
      duration: 3000,
    });
  };

  // Commit data to storage/backend
  const commitData = async () => {
    const validData = uploadedData.filter(item => item.validationStatus === 'valid');
    
    if (validData.length === 0) {
      toast({
        title: 'No Valid Data',
        description: 'Please validate data before committing',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Simulate API call to commit data
    setIsUploading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store in localStorage for demo (replace with real backend)
    const existingData = JSON.parse(localStorage.getItem('blueCarbonData') || '[]');
    const updatedData = [...existingData, ...validData];
    localStorage.setItem('blueCarbonData', JSON.stringify(updatedData));
    
    setIsUploading(false);
    setUploadedData([]);
    
    toast({
      title: 'Data Committed Successfully',
      description: `${validData.length} records saved to database`,
      status: 'success',
      duration: 3000,
    });
  };

  // View data details
  const viewDataDetails = (data: UploadedData) => {
    setSelectedRow(data);
    onOpen();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'green';
      case 'invalid': return 'red';
      default: return 'yellow';
    }
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Heading size="xl" color="blue.600">
          Blue Carbon Data Upload
        </Heading>
        
        <Text color="gray.600">
          Upload ecosystem data, species information, and monitoring results. 
          Data will be validated against FSI, MoSPI, and NCCR datasets.
        </Text>

        {/* GPS Capture Section */}
        <Card bg={cardBg}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">GPS Location Capture</Heading>
              <HStack spacing={4}>
                <Button
                  leftIcon={<Icon as={FiMapPin} />}
                  onClick={captureGPSLocation}
                  isLoading={isCapturingGPS}
                  loadingText="Capturing GPS..."
                  colorScheme="blue"
                >
                  Capture Current Location
                </Button>
                {gpsLocation && (
                  <Text fontSize="sm" color="green.600">
                    Lat: {gpsLocation.latitude.toFixed(6)}, 
                    Lng: {gpsLocation.longitude.toFixed(6)}
                  </Text>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* File Upload Section */}
        <Card bg={cardBg}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">File Upload</Heading>
              <HStack spacing={4}>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.csv"
                  onChange={handleFileUpload}
                  display="none"
                />
                <Button
                  leftIcon={<Icon as={FiUpload} />}
                  onClick={() => fileInputRef.current?.click()}
                  colorScheme="blue"
                >
                  Select File (JSON/CSV)
                </Button>
                {selectedFile && (
                  <Text fontSize="sm" color="gray.600">
                    Selected: {selectedFile.name}
                  </Text>
                )}
              </HStack>
              
              {isUploading && (
                <Box>
                  <Text fontSize="sm" mb={2}>Processing file...</Text>
                  <Progress value={uploadProgress} colorScheme="blue" />
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Data Preview and Actions */}
        {uploadedData.length > 0 && (
          <Card bg={cardBg}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Heading size="md">Uploaded Data Preview</Heading>
                  <HStack spacing={2}>
                    <Button
                      leftIcon={<Icon as={FiCheck} />}
                      onClick={validateData}
                      colorScheme="green"
                      size="sm"
                    >
                      Validate Data
                    </Button>
                    <Button
                      leftIcon={<Icon as={FiDownload} />}
                      onClick={commitData}
                      isLoading={isUploading}
                      colorScheme="blue"
                      size="sm"
                    >
                      Commit to Database
                    </Button>
                  </HStack>
                </HStack>

                <Box overflowX="auto">
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Ecosystem</Th>
                        <Th>Location</Th>
                        <Th>Area (ha)</Th>
                        <Th>Species</Th>
                        <Th>AGB (t/ha)</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {uploadedData.map((item) => (
                        <Tr key={item.id}>
                          <Td>{item.ecosystemType}</Td>
                          <Td>
                            {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
                            <br />
                            <Text fontSize="xs" color="gray.500">
                              {item.location.state}, {item.location.district}
                            </Text>
                          </Td>
                          <Td>{item.location.area}</Td>
                          <Td>{item.species}</Td>
                          <Td>{item.carbonPools.aboveGroundBiomass}</Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(item.validationStatus)}>
                              {item.validationStatus}
                            </Badge>
                            {item.validationErrors && item.validationErrors.length > 0 && (
                              <Text fontSize="xs" color="red.500" mt={1}>
                                {item.validationErrors.join(', ')}
                              </Text>
                            )}
                          </Td>
                          <Td>
                            <Button
                              size="xs"
                              leftIcon={<Icon as={FiEye} />}
                              onClick={() => viewDataDetails(item)}
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
        )}

        {/* Data Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Data Details</ModalHeader>
            <ModalBody>
              {selectedRow && (
                <VStack spacing={4} align="stretch">
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Ecosystem Type</FormLabel>
                        <Input value={selectedRow.ecosystemType} isReadOnly />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Species</FormLabel>
                        <Input value={selectedRow.species} isReadOnly />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Latitude</FormLabel>
                        <Input value={selectedRow.location.latitude} isReadOnly />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Longitude</FormLabel>
                        <Input value={selectedRow.location.longitude} isReadOnly />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Area (ha)</FormLabel>
                        <Input value={selectedRow.location.area} isReadOnly />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel>State</FormLabel>
                        <Input value={selectedRow.location.state} isReadOnly />
                      </FormControl>
                    </GridItem>
                  </Grid>
                  
                  <Heading size="sm">Carbon Pools (t/ha)</Heading>
                  <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Above Ground Biomass</FormLabel>
                        <Input value={selectedRow.carbonPools.aboveGroundBiomass} isReadOnly />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Below Ground Biomass</FormLabel>
                        <Input value={selectedRow.carbonPools.belowGroundBiomass} isReadOnly />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Soil Organic Carbon</FormLabel>
                        <Input value={selectedRow.carbonPools.soilOrganicCarbon} isReadOnly />
                      </FormControl>
                    </GridItem>
                  </Grid>

                  {selectedRow.validationErrors && selectedRow.validationErrors.length > 0 && (
                    <Alert status="error">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>Validation Errors:</AlertTitle>
                        <AlertDescription>
                          {selectedRow.validationErrors.join(', ')}
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}
