import React from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  HStack,
  Icon,
  useColorModeValue,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Box,
} from '@chakra-ui/react';
import { MagnifyingGlass } from 'phosphor-react';

const doctorTypes = [
  { value: 'doctor', label: 'General Doctor' },
  { value: 'dentist', label: 'Dentist' },
  { value: 'physiotherapist', label: 'Physiotherapist' },
  { value: 'chiropractor', label: 'Chiropractor' },
  { value: 'optometrist', label: 'Optometrist' },
];

const SearchControls = ({
  searchType,
  onSearchTypeChange,
  searchRadius,
  onSearchRadiusChange,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  isSearching,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      p={6}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: '-2px',
        left: '-2px',
        right: '-2px',
        bottom: '-2px',
        background: 'linear-gradient(45deg, #00f2fe, #4facfe, #00f2fe)',
        borderRadius: 'xl',
        zIndex: -1,
      }}
    >
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel
            bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
            bgClip="text"
            fontWeight="bold"
          >
            Doctor Type
          </FormLabel>
          <Select
            value={searchType}
            onChange={onSearchTypeChange}
            placeholder="Select type of doctor"
            bg={bgColor}
            borderColor={borderColor}
            _hover={{ borderColor: '#4facfe' }}
            _focus={{ borderColor: '#4facfe', boxShadow: '0 0 0 1px #4facfe' }}
          >
            {doctorTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel
            bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
            bgClip="text"
            fontWeight="bold"
          >
            Search Radius: {searchRadius / 1000} km
          </FormLabel>
          <Slider
            value={searchRadius}
            onChange={onSearchRadiusChange}
            min={1000}
            max={50000}
            step={1000}
            focusThumbOnChange={false}
          >
            <SliderTrack bg={useColorModeValue('gray.200', 'gray.600')}>
              <SliderFilledTrack bg="linear-gradient(120deg, #00f2fe, #4facfe)" />
            </SliderTrack>
            <SliderThumb boxSize={6} bg="#4facfe" />
          </Slider>
        </FormControl>

        <FormControl>
          <FormLabel
            bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
            bgClip="text"
            fontWeight="bold"
          >
            Search by Name or Address
          </FormLabel>
          <Input
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Enter name or address..."
            bg={bgColor}
            borderColor={borderColor}
            _hover={{ borderColor: '#4facfe' }}
            _focus={{ borderColor: '#4facfe', boxShadow: '0 0 0 1px #4facfe' }}
          />
        </FormControl>

        <Button
          onClick={onSearch}
          isLoading={isSearching}
          loadingText="Searching..."
          leftIcon={<Icon as={MagnifyingGlass} />}
          bg="linear-gradient(120deg, #00f2fe, #4facfe, #00f2fe)"
          color="white"
          size="lg"
          w="100%"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}
          _active={{
            transform: 'translateY(0)',
          }}
        >
          Search Doctors
        </Button>
      </VStack>
    </Box>
  );
};

export default SearchControls;
