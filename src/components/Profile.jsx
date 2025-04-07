import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Avatar,
  VStack,
  HStack,
  Card,
  CardBody,
  Badge,
  Icon,
  useColorModeValue,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { APIGATEWAY_BASE } from '../config';
import { useNavigate } from 'react-router-dom';
import {
  FiMail,
  FiUser,
  FiGlobe,
  FiCalendar,
  FiCheckCircle,
  FiImage,
} from 'react-icons/fi';

const MotionBox = motion(Box);

const InfoField = ({ label, value, icon }) => {
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const valueColor = useColorModeValue('gray.800', 'white');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'md',
      }}
    >
      <HStack spacing={3}>
        <Icon as={icon} color="brand.500" boxSize={5} />
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color={labelColor}>
            {label}
          </Text>
          <Text color={valueColor} fontWeight="medium">
            {value || 'Not provided'}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

const Profile = ({ userData }) => {
  const [user, setUser] = useState(null);
  const [quotas, setQuotas] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.900, purple.900)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const headingColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');
  const badgeColor = useColorModeValue('blue.500', 'blue.200');

  useEffect(() => {
    const fetchQuotas = async (email) => {
      try {
        const response = await fetch(
          APIGATEWAY_BASE+`userdetails/get-quotas?email=${email}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        setQuotas(data);
      } catch (err) {
        console.error('Error fetching quotas:', err);
        setApiError('Failed to load usage quotas');
      }
    };

    if (user?.email) {
      fetchQuotas(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    const checkAuth = () => {
      try {
        setIsLoading(true);
        setError(null);

        const authToken = localStorage.getItem('medical_auth_token');
        const userData = localStorage.getItem('user_data');

        if (!authToken || !userData) {
          navigate('/');
          return;
        }

        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load profile information');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const QuotaBadge = ({ label, value, icon }) => (
    <Box
      p={3}
      bg={useColorModeValue('blue.50', 'blue.900')}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={useColorModeValue('blue.200', 'blue.700')}
      textAlign="center"
    >
      <HStack spacing={2} justify="center">
        <Icon as={icon} color={badgeColor} boxSize={5} />
        <Text fontSize="lg" fontWeight="bold" color={badgeColor}>
          {value}
        </Text>
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
          {label}
        </Text>
      </HStack>
    </Box>
  );

  const quotaItems = [
    { label: 'Marketing', value: quotas?.marketing, icon: FiGlobe },
    { label: 'Doctor', value: quotas?.doctor, icon: FiUser },
    { label: 'Image', value: quotas?.image, icon: FiImage },
    { label: 'Quote', value: quotas?.quote, icon: FiCheckCircle },
  ];

  if (error) {
    return (
      <Box minH="100vh" bgGradient={bgGradient} p={5}>
        <Container maxW="container.xl">
          <Alert status="error" borderRadius="lg" mb={6}>
            <AlertIcon />
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box minH="100vh" bgGradient={bgGradient} p={5}>
        <Container maxW="container.xl">
          <Alert status="info" borderRadius="lg" mb={6}>
            <AlertIcon />
            Loading profile information...
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bgGradient={bgGradient} p={5}>
      <Container maxW="container.xl">
        <Stack spacing={8}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              bg={cardBg}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              overflow="hidden"
              boxShadow="lg"
            >
              <CardBody>
                <VStack spacing={6} align="center">
                  <Avatar
                    size="2xl"
                    name={user.name}
                    src={user.picture}
                    border="4px solid"
                    borderColor="brand.500"
                  />
                  <VStack spacing={2}>
                    <Heading size="lg" color={headingColor}>
                      {user.name}
                    </Heading>
                    <HStack>
                      <Badge colorScheme="green" fontSize="sm" px={2} py={1}>
                        Verified Account
                      </Badge>
                      {user.email_verified && (
                        <Badge colorScheme="blue" fontSize="sm" px={2} py={1}>
                          Verified Email
                        </Badge>
                      )}
                    </HStack>
                    <Text color={subTextColor} textAlign="center">
                      {user.role || 'User'} at {user.department || 'Medical Department'}
                    </Text>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              bg={cardBg}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              overflow="hidden"
              boxShadow="lg"
            >
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="md" color={headingColor}>
                    Usage Quotas
                  </Heading>
                  {apiError && (
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      {apiError}
                    </Alert>
                  )}
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="100%">
                    {quotaItems.map((item, index) => (
                      <QuotaBadge
                        key={index}
                        label={item.label}
                        value={item.value ?? '0'}
                        icon={item.icon}
                      />
                    ))}
                  </SimpleGrid>
                  <Text fontSize="sm" color={subTextColor} textAlign="center">
                    Current usage limits for your account
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>

          <Card
            bg={cardBg}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            overflow="hidden"
            boxShadow="lg"
          >
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Heading size="md" color={headingColor}>
                  Account Information
                </Heading>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                  <InfoField
                    label="Full Name"
                    value={user.name}
                    icon={FiUser}
                  />
                  <InfoField
                    label="Email"
                    value={user.email}
                    icon={FiMail}
                  />
                  <InfoField
                    label="Locale"
                    value={user.locale}
                    icon={FiGlobe}
                  />
                  <InfoField
                    label="Account Created"
                    value={new Date(parseInt(user.iat * 1000)).toLocaleDateString()}
                    icon={FiCalendar}
                  />
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
};

export default Profile;