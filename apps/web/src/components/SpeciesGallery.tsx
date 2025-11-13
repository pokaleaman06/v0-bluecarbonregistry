/**
 * SpeciesGallery Component for Blue Carbon MRV
 * 
 * INSTRUCTIONS FOR DEVELOPER:
 * 
 * IMAGE PLACEHOLDERS - READY TO REPLACE:
 * The following 6 species now have placeholder images that can be easily replaced:
 * 1. Red Mangrove (Rhizophora mucronata) - Blue placeholder
 * 2. Grey Mangrove (Avicennia marina) - Green placeholder  
 * 3. Paddle Grass (Halophila ovalis) - Teal placeholder
 * 4. Glasswort (Salicornia brachiata) - Light green placeholder
 * 5. Large-leafed Orange Mangrove (Bruguiera gymnorrhiza) - Orange placeholder
 * 6. Serrated Ribbon Grass (Cymodocea serrulata) - Blue placeholder
 * 
 * TO REPLACE WITH REAL IMAGES:
 * 1. Find high-quality images from GBIF (https://www.gbif.org/) or iNaturalist (https://www.inaturalist.org/)
 * 2. Update the imageUrl field in apps/web/src/data/blueCarbonData.json
 * 3. Ensure images are optimized (400x300px recommended)
 * 4. Use HTTPS URLs for better security
 * 
 * ADDITIONAL IMPROVEMENTS NEEDED:
 * - Integrate with actual species databases for real-time data
 * - Add image optimization and lazy loading for better performance
 * - Implement advanced filtering (by carbon potential, conservation status, etc.)
 * - Add species detail modal with comprehensive information
 * - Connect to real biodiversity databases for distribution data
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Image,
  Badge,
  VStack,
  HStack,
  Input,
  Select,
  Button,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tag,
  TagLabel,
  TagCloseButton,
  Icon,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';

interface Species {
  id: string;
  scientificName: string;
  commonName: string;
  identifyingCharacteristics: string[];
  storedCarbonPercentage: number;
  geographicalDistribution: string[];
  ecosystemType: string;
  imageUrl: string;
  dataSource: string;
  carbonPotential: 'Low' | 'Medium' | 'High' | 'Very High';
  conservationStatus: string;
}

interface FilterState {
  searchTerm: string;
  ecosystemType: string;
  carbonPotential: string;
  conservationStatus: string;
  state: string;
}

export function SpeciesGallery() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [filteredSpecies, setFilteredSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    ecosystemType: '',
    carbonPotential: '',
    conservationStatus: '',
    state: '',
  });

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Load species data
  useEffect(() => {
    const loadSpeciesData = async () => {
      try {
        // Load from local data file (replace with API call)
        const response = await fetch('/src/data/blueCarbonData.json');
        const data = await response.json();
        setSpecies(data.species || []);
        setFilteredSpecies(data.species || []);
      } catch (error) {
        console.error('Error loading species data:', error);
        // Fallback to empty array
        setSpecies([]);
        setFilteredSpecies([]);
      } finally {
        setLoading(false);
      }
    };

    loadSpeciesData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = species;

    if (filters.searchTerm) {
      filtered = filtered.filter(species =>
        species.scientificName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        species.commonName.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.ecosystemType) {
      filtered = filtered.filter(species => species.ecosystemType === filters.ecosystemType);
    }

    if (filters.carbonPotential) {
      filtered = filtered.filter(species => species.carbonPotential === filters.carbonPotential);
    }

    if (filters.conservationStatus) {
      filtered = filtered.filter(species => species.conservationStatus === filters.conservationStatus);
    }

    if (filters.state) {
      filtered = filtered.filter(species => 
        species.geographicalDistribution.includes(filters.state)
      );
    }

    setFilteredSpecies(filtered);
  }, [species, filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      ecosystemType: '',
      carbonPotential: '',
      conservationStatus: '',
      state: '',
    });
  };

  const viewSpeciesDetails = (species: Species) => {
    setSelectedSpecies(species);
    onOpen();
  };

  const getCarbonPotentialColor = (potential: string) => {
    switch (potential) {
      case 'Very High': return 'red';
      case 'High': return 'orange';
      case 'Medium': return 'yellow';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const getConservationStatusColor = (status: string) => {
    switch (status) {
      case 'Critically Endangered': return 'red';
      case 'Endangered': return 'orange';
      case 'Vulnerable': return 'yellow';
      case 'Near Threatened': return 'blue';
      case 'Least Concern': return 'green';
      default: return 'gray';
    }
  };

  const getEcosystemTypeColor = (type: string) => {
    switch (type) {
      case 'Mangrove': return 'green';
      case 'Seagrass': return 'blue';
      case 'Salt Marsh': return 'purple';
      default: return 'gray';
    }
  };

  // Get unique values for filter options
  const ecosystemTypes = [...new Set(species.map(s => s.ecosystemType))];
  const carbonPotentials = [...new Set(species.map(s => s.carbonPotential))];
  const conservationStatuses = [...new Set(species.map(s => s.conservationStatus))];
  const states = [...new Set(species.flatMap(s => s.geographicalDistribution))];

  if (loading) {
    return (
      <Box p={6}>
        <VStack spacing={4}>
          <Progress size="lg" isIndeterminate colorScheme="blue" w="full" />
          <Text>Loading species data...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Heading size="xl" color="blue.600">
          Blue Carbon Species Gallery
        </Heading>
        
        <Text color="gray.600">
          Explore species data with carbon sequestration potential. 
          Filter by ecosystem type, carbon potential, and geographical distribution.
        </Text>

        {/* Filters Section */}
        <Card bg={cardBg}>
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md">Filters</Heading>
              <Button size="sm" onClick={clearFilters} variant="outline">
                Clear All
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
              <GridItem>
                <VStack align="stretch" spacing={2}>
                  <Text fontSize="sm" fontWeight="medium">Search</Text>
                  <Input
                    placeholder="Search species..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  />
                </VStack>
              </GridItem>
              
              <GridItem>
                <VStack align="stretch" spacing={2}>
                  <Text fontSize="sm" fontWeight="medium">Ecosystem Type</Text>
                  <Select
                    placeholder="All ecosystems"
                    value={filters.ecosystemType}
                    onChange={(e) => handleFilterChange('ecosystemType', e.target.value)}
                  >
                    {ecosystemTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                </VStack>
              </GridItem>
              
              <GridItem>
                <VStack align="stretch" spacing={2}>
                  <Text fontSize="sm" fontWeight="medium">Carbon Potential</Text>
                  <Select
                    placeholder="All potentials"
                    value={filters.carbonPotential}
                    onChange={(e) => handleFilterChange('carbonPotential', e.target.value)}
                  >
                    {carbonPotentials.map(potential => (
                      <option key={potential} value={potential}>{potential}</option>
                    ))}
                  </Select>
                </VStack>
              </GridItem>
              
              <GridItem>
                <VStack align="stretch" spacing={2}>
                  <Text fontSize="sm" fontWeight="medium">Conservation Status</Text>
                  <Select
                    placeholder="All statuses"
                    value={filters.conservationStatus}
                    onChange={(e) => handleFilterChange('conservationStatus', e.target.value)}
                  >
                    {conservationStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </Select>
                </VStack>
              </GridItem>
              
              <GridItem>
                <VStack align="stretch" spacing={2}>
                  <Text fontSize="sm" fontWeight="medium">State</Text>
                  <Select
                    placeholder="All states"
                    value={filters.state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                  >
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </Select>
                </VStack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* Results Summary */}
        <HStack justify="space-between">
          <Text color="gray.600">
            Showing {filteredSpecies.length} of {species.length} species
          </Text>
          <HStack spacing={2}>
            {filters.searchTerm && (
              <Tag size="sm" colorScheme="blue">
                <TagLabel>Search: {filters.searchTerm}</TagLabel>
                <TagCloseButton onClick={() => handleFilterChange('searchTerm', '')} />
              </Tag>
            )}
            {filters.ecosystemType && (
              <Tag size="sm" colorScheme="green">
                <TagLabel>Ecosystem: {filters.ecosystemType}</TagLabel>
                <TagCloseButton onClick={() => handleFilterChange('ecosystemType', '')} />
              </Tag>
            )}
            {filters.carbonPotential && (
              <Tag size="sm" colorScheme="orange">
                <TagLabel>Carbon: {filters.carbonPotential}</TagLabel>
                <TagCloseButton onClick={() => handleFilterChange('carbonPotential', '')} />
              </Tag>
            )}
          </HStack>
        </HStack>

        {/* Species Grid */}
        {filteredSpecies.length === 0 ? (
          <Alert status="info">
            <AlertIcon />
            <AlertTitle>No species found!</AlertTitle>
            <AlertDescription>
              Try adjusting your filters or search terms.
            </AlertDescription>
          </Alert>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
            {filteredSpecies.map((species) => (
              <GridItem key={species.id}>
                <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" h="full">
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {/* Species Image */}
                      <Box position="relative" h="200px" borderRadius="md" overflow="hidden">
                        <Image
                          src={species.imageUrl}
                          alt={species.commonName}
                          objectFit="cover"
                          w="full"
                          h="full"
                          fallback={
                            <Box
                              bg="gray.100"
                              w="full"
                              h="full"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              border="2px dashed"
                              borderColor="gray.300"
                            >
                              <VStack spacing={2}>
                                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                  {species.commonName}
                                </Text>
                                <Text fontSize="xs" color="gray.500" fontStyle="italic">
                                  {species.scientificName}
                                </Text>
                                <Text fontSize="xs" color="gray.400" textAlign="center" maxW="200px">
                                  Replace with real images from GBIF/iNaturalist
                                </Text>
                              </VStack>
                            </Box>
                          }
                        />
                        <Badge
                          position="absolute"
                          top={2}
                          right={2}
                          colorScheme={getCarbonPotentialColor(species.carbonPotential)}
                        >
                          {species.carbonPotential}
                        </Badge>
                      </Box>

                      {/* Species Info */}
                      <VStack spacing={2} align="stretch">
                        <Heading size="sm" noOfLines={2}>
                          {species.commonName}
                        </Heading>
                        <Text fontSize="sm" color="gray.600" fontStyle="italic">
                          {species.scientificName}
                        </Text>
                        
                        <HStack spacing={2} wrap="wrap">
                          <Badge colorScheme={getEcosystemTypeColor(species.ecosystemType)}>
                            {species.ecosystemType}
                          </Badge>
                          <Badge colorScheme={getConservationStatusColor(species.conservationStatus)}>
                            {species.conservationStatus}
                          </Badge>
                        </HStack>

                        <Stat size="sm">
                          <StatLabel>Carbon Storage</StatLabel>
                          <StatNumber>{species.storedCarbonPercentage}%</StatNumber>
                          <StatHelpText>of total carbon pool</StatHelpText>
                        </Stat>

                        <HStack spacing={1} wrap="wrap">
                          <Text fontSize="xs" color="gray.500">
                            {species.geographicalDistribution.slice(0, 2).join(', ')}
                            {species.geographicalDistribution.length > 2 && '...'}
                          </Text>
                        </HStack>
                      </VStack>

                      {/* Actions */}
                      <Button
                        size="sm"
                        leftIcon={<Icon as={FiEye} />}
                        onClick={() => viewSpeciesDetails(species)}
                        colorScheme="blue"
                        variant="outline"
                      >
                        View Details
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>
        )}

        {/* Species Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedSpecies?.commonName} ({selectedSpecies?.scientificName})
            </ModalHeader>
            <ModalBody>
              {selectedSpecies && (
                <VStack spacing={6} align="stretch">
                  {/* Image and Basic Info */}
                  <Grid templateColumns="1fr 2fr" gap={6}>
                    <GridItem>
                      <Box h="300px" borderRadius="md" overflow="hidden">
                        <Image
                          src={selectedSpecies.imageUrl}
                          alt={selectedSpecies.commonName}
                          objectFit="cover"
                          w="full"
                          h="full"
                          fallback={
                            <Box
                              bg="gray.100"
                              w="full"
                              h="full"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              border="2px dashed"
                              borderColor="gray.300"
                            >
                              <VStack spacing={2}>
                                <Text fontSize="lg" color="gray.600" fontWeight="medium">
                                  {selectedSpecies.commonName}
                                </Text>
                                <Text fontSize="sm" color="gray.500" fontStyle="italic">
                                  {selectedSpecies.scientificName}
                                </Text>
                                <Text fontSize="xs" color="gray.400" textAlign="center">
                                  Replace with real images from GBIF/iNaturalist
                                </Text>
                              </VStack>
                            </Box>
                          }
                        />
                      </Box>
                    </GridItem>
                    <GridItem>
                      <VStack spacing={4} align="stretch">
                        <HStack spacing={2} wrap="wrap">
                          <Badge colorScheme={getEcosystemTypeColor(selectedSpecies.ecosystemType)}>
                            {selectedSpecies.ecosystemType}
                          </Badge>
                          <Badge colorScheme={getCarbonPotentialColor(selectedSpecies.carbonPotential)}>
                            {selectedSpecies.carbonPotential} Carbon Potential
                          </Badge>
                          <Badge colorScheme={getConservationStatusColor(selectedSpecies.conservationStatus)}>
                            {selectedSpecies.conservationStatus}
                          </Badge>
                        </HStack>

                        <Stat>
                          <StatLabel>Carbon Storage Percentage</StatLabel>
                          <StatNumber>{selectedSpecies.storedCarbonPercentage}%</StatNumber>
                          <StatHelpText>of total ecosystem carbon pool</StatHelpText>
                        </Stat>

                        <Box>
                          <Text fontWeight="medium" mb={2}>Geographical Distribution:</Text>
                          <HStack spacing={2} wrap="wrap">
                            {selectedSpecies.geographicalDistribution.map((state) => (
                              <Tag key={state} size="sm" colorScheme="blue">
                                <TagLabel>{state}</TagLabel>
                              </Tag>
                            ))}
                          </HStack>
                        </Box>
                      </VStack>
                    </GridItem>
                  </Grid>

                  <Divider />

                  {/* Identifying Characteristics */}
                  <Box>
                    <Heading size="md" mb={3}>Identifying Characteristics</Heading>
                    <VStack spacing={2} align="stretch">
                      {selectedSpecies.identifyingCharacteristics.map((characteristic, index) => (
                        <HStack key={index} align="start">
                          <Text>{characteristic}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Data Source Info */}
                  <Alert status="info">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Data Source</AlertTitle>
                      <AlertDescription>
                        {selectedSpecies.dataSource}
                      </AlertDescription>
                    </Box>
                  </Alert>
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
