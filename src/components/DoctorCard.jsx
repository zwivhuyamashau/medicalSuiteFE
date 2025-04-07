import React, { useState } from 'react';
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Stack,
  Box,
  Heading,
  Text,
  Badge,
  Button,
  Icon,
  Avatar,
  Flex,
  Divider,
  Link,
  Tooltip,
  useColorModeValue,
  Collapse,
  IconButton,
} from '@chakra-ui/react';
import {
  MapPin,
  NavigationArrow,
  Star,
  Phone,
  Clock,
  FirstAidKit,
  Globe,
  Calendar,
  Info,
  CaretDown,
  CaretUp,
} from 'phosphor-react';

const ReviewCard = ({ review, textColor, subTextColor }) => (
  <Box p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
    <HStack spacing={2} mb={1}>
      <Avatar
        size="xs"
        name={review.authorAttribution?.displayName}
        src={review.authorAttribution?.photoUri}
      />
      <Text fontSize="sm" fontWeight="medium" color={textColor}>
        {review.authorAttribution?.displayName || 'Anonymous'}
      </Text>
      <Badge
        colorScheme={review.rating >= 4 ? 'green' : review.rating >= 3 ? 'yellow' : 'red'}
        display="flex"
        alignItems="center"
        gap={1}
      >
        <Icon as={Star} />
        {review.rating}
      </Badge>
    </HStack>
    <Text fontSize="sm" color={textColor}>
      {review.text?.text || 'No comment provided'}
    </Text>
    <Text fontSize="xs" color={subTextColor} mt={1}>
      {review.relativePublishTimeDescription}
    </Text>
  </Box>
);

const DoctorCard = ({ doctor }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  // Format opening hours if available
  const formatOpeningHours = (hours) => {
    if (!hours?.weekdayDescriptions?.length) return null;
    return hours.weekdayDescriptions.map((day, index) => (
      <Text key={index} fontSize="sm" color={subTextColor}>
        {day}
      </Text>
    ));
  };

  // Get average rating color
  const getRatingColor = (rating) => {
    if (!rating) return 'gray';
    if (rating >= 4) return 'green';
    if (rating >= 3) return 'yellow';
    return 'red';
  };

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
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
        opacity: 0,
        transition: '0.3s',
      }}
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl',
        _before: {
          opacity: 1,
        },
      }}
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          {/* Header Section */}
          <Flex gap={4}>
            <Avatar
              size="lg"
              name={doctor.name}
              src={doctor.photo}
              bg="linear-gradient(120deg, #00f2fe, #4facfe)"
              icon={<Icon as={FirstAidKit} fontSize="1.5rem" color="white" />}
            />
            <Box flex="1">
              <Heading size="md" mb={2} color={textColor}>
                {doctor.name}
              </Heading>
              <HStack spacing={2} wrap="wrap">
                {doctor.rating !== undefined && (
                  <Badge
                    colorScheme={getRatingColor(doctor.rating)}
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon as={Star} />
                    {doctor.rating.toFixed(1)} ({doctor.reviews?.length || 0})
                  </Badge>
                )}
                {doctor.businessStatus && (
                  <Badge colorScheme={doctor.businessStatus === 'OPERATIONAL' ? 'green' : 'red'}>
                    {doctor.businessStatus.toLowerCase()}
                  </Badge>
                )}
              </HStack>
            </Box>
          </Flex>

          {/* Primary Info Section */}
          <Stack spacing={2}>
            {doctor.primaryType && (
              <Flex align="center" gap={2}>
                <Icon as={FirstAidKit} color={subTextColor} />
                <Text fontSize="sm" color={textColor}>{doctor.primaryType}</Text>
              </Flex>
            )}

            <Flex align="center" gap={2}>
              <Icon as={MapPin} color={subTextColor} />
              <Text fontSize="sm" color={textColor}>{doctor.address}</Text>
            </Flex>

            <Flex align="center" gap={2}>
              <Icon as={NavigationArrow} color={subTextColor} />
              <Badge
                bgGradient={
                  parseFloat(doctor.distance) <= 2 ? "linear(to-r, green.400, teal.400)" :
                  parseFloat(doctor.distance) <= 5 ? "linear(to-r, blue.400, cyan.400)" :
                  "linear(to-r, yellow.400, orange.400)"
                }
                color="white"
              >
                {typeof doctor.distance === 'number' ? `${doctor.distance.toFixed(1)} km away` : doctor.distance}
              </Badge>
            </Flex>

            {doctor.phone && (
              <Flex align="center" gap={2}>
                <Icon as={Phone} color={subTextColor} />
                <Link href={`tel:${doctor.phone}`} color={textColor} fontSize="sm">
                  {doctor.phone}
                </Link>
              </Flex>
            )}

            {doctor.website && (
              <Flex align="center" gap={2}>
                <Icon as={Globe} color={subTextColor} />
                <Link href={doctor.website} isExternal color={textColor} fontSize="sm" noOfLines={1}>
                  {new URL(doctor.website).hostname}
                </Link>
              </Flex>
            )}

            <Flex align="center" gap={2}>
              <Icon as={Clock} color={doctor.openNow ? "green.400" : "red.400"} />
              <Badge
                bgGradient={doctor.openNow ? "linear(to-r, green.400, teal.400)" : "linear(to-r, red.400, pink.400)"}
                color="white"
              >
                {doctor.openNow ? "Open Now" : "Closed"}
              </Badge>
              {doctor.openingHours?.nextOpenTime && !doctor.openNow && (
                <Text fontSize="sm" color={subTextColor}>
                  Opens {doctor.openingHours.nextOpenTime}
                </Text>
              )}
            </Flex>
          </Stack>

          {/* Opening Hours Section */}
          {doctor.openingHours?.weekdayDescriptions?.length > 0 && (
            <Box>
              <Divider my={2} />
              <VStack align="stretch" spacing={1}>
                <Text fontSize="sm" fontWeight="medium" color={textColor} mb={1}>
                  <Icon as={Calendar} display="inline-block" mr={2} />
                  Opening Hours
                </Text>
                {formatOpeningHours(doctor.openingHours)}
              </VStack>
            </Box>
          )}

          {/* Reviews Section */}
          {doctor.reviews?.length > 0 && (
            <Box>
              <Divider my={2} />
              <VStack align="stretch" spacing={2}>
                <Flex align="center" justify="space-between">
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    Reviews ({doctor.reviews.length})
                  </Text>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    icon={<Icon as={showAllReviews ? CaretUp : CaretDown} />}
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    aria-label={showAllReviews ? "Show less reviews" : "Show all reviews"}
                  />
                </Flex>

                {/* Preview Reviews (always visible) */}
                {doctor.reviews.slice(0, 2).map((review, index) => (
                  <ReviewCard
                    key={`preview-${index}`}
                    review={review}
                    textColor={textColor}
                    subTextColor={subTextColor}
                  />
                ))}

                {/* Expandable Reviews */}
                <Collapse in={showAllReviews}>
                  <VStack align="stretch" spacing={2} mt={2}>
                    {doctor.reviews.slice(2).map((review, index) => (
                      <ReviewCard
                        key={`expanded-${index}`}
                        review={review}
                        textColor={textColor}
                        subTextColor={subTextColor}
                      />
                    ))}
                  </VStack>
                </Collapse>

                {doctor.reviews.length > 2 && !showAllReviews && (
                  <Button
                    size="sm"
                    variant="ghost"
                    rightIcon={<Icon as={CaretDown} />}
                    onClick={() => setShowAllReviews(true)}
                    color={useColorModeValue('blue.500', 'blue.300')}
                    _hover={{
                      bg: useColorModeValue('blue.50', 'blue.900'),
                    }}
                  >
                    Show {doctor.reviews.length - 2} more reviews
                  </Button>
                )}
              </VStack>
            </Box>
          )}

          {/* Action Buttons */}
          <HStack spacing={2} mt={2}>
            <Button
              as="a"
              href={doctor.googleMapsUri || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(doctor.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              leftIcon={<Icon as={NavigationArrow} />}
              size="sm"
              bg="linear-gradient(120deg, #00f2fe, #4facfe, #00f2fe)"
              color="white"
              flex={1}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
            >
              Get Directions
            </Button>

            {doctor.googleMapsUri && (
              <Tooltip label="View on Google Maps">
                <Button
                  as="a"
                  href={doctor.googleMapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={<Icon as={Info} />}
                  size="sm"
                  variant="outline"
                  borderColor="#4facfe"
                  color="#4facfe"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                    bg: 'transparent',
                  }}
                >
                  More Info
                </Button>
              </Tooltip>
            )}
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default DoctorCard;
