import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Stack,
  Flex,
  HStack,
  Text,
  Button,
  Icon,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  NavigationArrow,
  Crosshair,
  House,
} from 'phosphor-react';

const LocationCard = ({ location, onRefresh }) => {
  return (
    <Card
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius="xl"
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
      <CardBody>
        <Stack spacing={4}>
          <Flex justify="space-between" align="center">
            <HStack>
              <Icon as={Crosshair} fontSize="xl" color="#4facfe" />
              <Text fontWeight="bold" bgGradient="linear(to-r, blue.400, purple.500, pink.500)" bgClip="text">
                Your Location
              </Text>
            </HStack>
            <Button
              size="sm"
              leftIcon={<Icon as={NavigationArrow} />}
              onClick={onRefresh}
              bg="linear-gradient(120deg, #00f2fe, #4facfe, #00f2fe)"
              color="white"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
            >
              Refresh
            </Button>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Stat>
              <StatLabel color={useColorModeValue('gray.600', 'gray.400')}>Latitude</StatLabel>
              <StatNumber fontSize="md">{location.lat.toFixed(6)}°</StatNumber>
            </Stat>
            <Stat>
              <StatLabel color={useColorModeValue('gray.600', 'gray.400')}>Longitude</StatLabel>
              <StatNumber fontSize="md">{location.lng.toFixed(6)}°</StatNumber>
            </Stat>
            <Stat>
              <StatLabel color={useColorModeValue('gray.600', 'gray.400')}>Accuracy</StatLabel>
              <StatNumber fontSize="md">±{Math.round(location.accuracy)}m</StatNumber>
            </Stat>
          </SimpleGrid>

          <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.500')}>
            Last updated: {new Date(location.timestamp).toLocaleTimeString()}
          </Text>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default LocationCard;
