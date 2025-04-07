import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Spinner,
  Button,
  Icon,
  SimpleGrid,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import {
  FirstAidKit,
  NavigationArrow,
  Star,
  SortAscending,
} from 'phosphor-react';
import useGoogleMapsApi from '../hooks/useGoogleMapsApi';
import doctorService from '../services/doctorService';
import LocationCard from './LocationCard';
import SearchControls from './SearchControls';
import DoctorCard from './DoctorCard';
import { useAuth } from '../services/AuthContext';
const sortOptions = [
  { value: 'distance', label: 'Distance (Nearest)' },
  { value: 'rating', label: 'Rating (Highest)' },
  { value: 'reviews', label: 'Most Reviewed' },
];

const DoctorSearch = () => {
  const [location, setLocation] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchType, setSearchType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { isLoaded, loadError } = useGoogleMapsApi();
  const { user } = useAuth();

  const getUserLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          lat: latitude,
          lng: longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Please allow location access to find doctors near you');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('An unknown error occurred while getting location');
            break;
        }
      },
      options
    );
  }, []);

  const searchDoctors = useCallback(async () => {
    if (!location || !searchType) {
      setError('Please select a doctor type and ensure location is available');
      return;
    }

    setIsSearching(true);
    setError(null);
    

    try {
      const response = await doctorService.searchNearbyDoctors(location, searchType, searchRadius, user);
      console.log('Search results:', JSON.stringify(response));
      
      const processedDoctors = response.results.map(place => {
        // Calculate distance first to ensure it's a number
        const distance = place?.location?.latitude && place?.location?.longitude
          ? doctorService.calculateDistance(
              location?.lat ?? 0,
              location?.lng ?? 0,
              place?.location?.latitude,
              place?.location?.longitude
            )
          : Number.MAX_VALUE; // Use MAX_VALUE for sorting when distance is unavailable

        return {
          id: place.id,
          name: place.displayName?.text || place.name,
          address: place.shortFormattedAddress || place.formattedAddress,
          location: {
            lat: place?.location?.latitude ?? null,
            lng: place?.location?.longitude ?? null
          },
          rating: place.rating || 0,
          reviews: place.reviews || [],
          reviewCount: place.reviews?.length || 0,
          photo: place.photos?.[0]?.googleMapsUri,
          openNow: place.currentOpeningHours?.openNow || place.regularOpeningHours?.openNow,
          types: place.types,
          businessStatus: place.businessStatus,
          primaryType: place.primaryTypeDisplayName?.text || place.primaryType,
          phone: place.nationalPhoneNumber,
          website: place.websiteUri,
          googleMapsUri: place.googleMapsUri,
          openingHours: place.currentOpeningHours || place.regularOpeningHours,
          distance: distance
        };
      });

      console.log('Processed doctors:', JSON.stringify(processedDoctors));

      setDoctors(processedDoctors);
      setFilteredDoctors(processedDoctors);
    } catch (error) {
      console.error('Error searching doctors:', error);
      setError(error.message || 'Failed to search for doctors. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [location, searchType, searchRadius,user]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // Updated sorting and filtering logic
  useEffect(() => {
    let results = [...doctors];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(doctor =>
        (doctor.name?.toLowerCase() || '').includes(query) ||
        (doctor.address?.toLowerCase() || '').includes(query) ||
        (doctor.primaryType?.toLowerCase() || '').includes(query)
      );
    }

    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          // Handle cases where distance might be "Distance unavailable"
          const distA = typeof a.distance === 'number' ? a.distance : Number.MAX_VALUE;
          const distB = typeof b.distance === 'number' ? b.distance : Number.MAX_VALUE;
          return distA - distB;

        case 'rating':
          // Sort by rating (highest first), then by number of reviews as secondary criteria
          const ratingDiff = (b.rating || 0) - (a.rating || 0);
          if (ratingDiff === 0) {
            return (b.reviewCount || 0) - (a.reviewCount || 0);
          }
          return ratingDiff;

        case 'reviews':
          // Sort by number of reviews (highest first), then by rating as secondary criteria
          const reviewsDiff = (b.reviewCount || 0) - (a.reviewCount || 0);
          if (reviewsDiff === 0) {
            return (b.rating || 0) - (a.rating || 0);
          }
          return reviewsDiff;

        default:
          return 0;
      }
    });

    setFilteredDoctors(results);
  }, [doctors, searchQuery, sortBy]);

  if (loadError) {
    return (
      <Box minH="100vh" bgGradient="linear(to-br, gray.900, purple.900, blue.900)" py={8}>
        <Container maxW="container.xl">
          <Alert status="error" bg="red.900" color="white" borderRadius="lg">
            <AlertIcon color="white" />
            Failed to load: {loadError.message}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bgGradient={useColorModeValue('linear(to-br, blue.50, purple.50, pink.50)', 'linear(to-br, gray.900, purple.900, blue.900)')} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          <Heading
            size="xl"
            display="flex"
            alignItems="center"
            gap={4}
            bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
            bgClip="text"
          >
            <Icon as={FirstAidKit} weight="duotone" color="#4facfe" />
            Find Doctors Near You
          </Heading>

          {error && (
            <Alert status="error" bg={useColorModeValue('red.100', 'red.900')} color={useColorModeValue('red.800', 'white')} borderRadius="lg">
              <AlertIcon color={useColorModeValue('red.500', 'white')} />
              <VStack align="start" spacing={2}>
                <Text>{error}</Text>
                {error.includes('location') && (
                  <Button
                    size="sm"
                    leftIcon={<Icon as={NavigationArrow} />}
                    onClick={getUserLocation}
                    bg="linear-gradient(120deg, #00f2fe, #4facfe, #00f2fe)"
                    color="white"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                  >
                    Try Again
                  </Button>
                )}
              </VStack>
            </Alert>
          )}

          {isLoading ? (
            <Alert status="info" bg={useColorModeValue('blue.100', 'blue.900')} color={useColorModeValue('blue.800', 'white')} borderRadius="lg">
              <AlertIcon color={useColorModeValue('blue.500', 'white')} />
              <VStack align="start" spacing={2}>
                <Text>Getting your location...</Text>
                <Spinner size="sm" color="#4facfe" />
              </VStack>
            </Alert>
          ) : location && (
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <LocationCard
                  location={location}
                  onRefresh={getUserLocation}
                />

                <SearchControls
                  searchType={searchType}
                  onSearchTypeChange={(e) => setSearchType(e.target.value)}
                  searchRadius={searchRadius}
                  onSearchRadiusChange={setSearchRadius}
                  searchQuery={searchQuery}
                  onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
                  onSearch={searchDoctors}
                  isSearching={isSearching}
                />
              </SimpleGrid>

              {isSearching ? (
                <Flex justify="center" py={8}>
                  <VStack spacing={4}>
                    <Spinner size="xl" color="#4facfe" />
                    <Text color={useColorModeValue('gray.800', 'white')}>Searching for doctors...</Text>
                  </VStack>
                </Flex>
              ) : filteredDoctors.length > 0 ? (
                <>
                  <HStack justify="space-between">
                    <HStack spacing={4}>
                      <Text color={useColorModeValue('gray.800', 'white')}>
                        Found {filteredDoctors.length} doctors within {searchRadius / 1000} km
                      </Text>
                    </HStack>
                    <Menu>
                      <MenuButton
                        as={Button}
                        leftIcon={<Icon as={SortAscending} />}
                        bg="linear-gradient(120deg, #00f2fe, #4facfe, #00f2fe)"
                        minW="150px"
                        color="white"
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: 'lg',
                        }}
                      >
                        Sort By: {sortOptions.find(opt => opt.value === sortBy)?.label}
                      </MenuButton>
                      <MenuList
                        bg={useColorModeValue('white', 'gray.800')}
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        minW="200px"
                        p={2}
                      >
                        {sortOptions.map((option) => (
                          <MenuItem
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            icon={<Icon as={option.value === sortBy ? Star : undefined} color={option.value === sortBy ? '#4facfe' : undefined} />}
                            p={3}
                            borderRadius="md"
                            _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </HStack>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {filteredDoctors.map((doctor) => (
                      <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                  </SimpleGrid>
                </>
              ) : searchType ? (
                <Alert status="info" bg={useColorModeValue('blue.100', 'blue.900')} color={useColorModeValue('blue.800', 'white')} borderRadius="lg">
                  <AlertIcon color={useColorModeValue('blue.500', 'white')} />
                  Click the search button to find doctors near you
                </Alert>
              ) : (
                <Alert status="info" bg={useColorModeValue('blue.100', 'blue.900')} color={useColorModeValue('blue.800', 'white')} borderRadius="lg">
                  <AlertIcon color={useColorModeValue('blue.500', 'white')} />
                  Select a doctor type and click search to start searching
                </Alert>
              )}
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default DoctorSearch;
