import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Flex,
  Image,
  useColorModeValue,
  useColorMode,
  IconButton,
  Grid,
  Icon,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Badge,
  HStack,
  Divider,
  List,
  ListItem,
  ListIcon,
  Tooltip,
  chakra
} from '@chakra-ui/react';
import {
  SunIcon,
  MoonIcon,
  CheckCircleIcon,
} from '@chakra-ui/icons';
import {
  Rocket,
  MagnifyingGlass,
  Brain,
  PaintBrush,
  ChartPie,
  Users,
  Target,
  Lightning,
  Star,
  ArrowRight,
  Globe,
  ShieldCheck,
  Sparkle,
  Clock,
} from 'phosphor-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionGrid = motion(Grid);
const MotionText = motion(Text);

// Animated gradient background
const AnimatedBackground = chakra(motion.div, {
  shouldWrapChildren: true,
  baseStyle: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
});

const Feature = ({ icon, title, description }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-8px)',
        boxShadow: 'xl',
        borderColor: 'brand.500',
      }}
    >
      <CardBody>
        <VStack align="start" spacing={4}>
          <Box
            p={3}
            borderRadius="lg"
            bg={useColorModeValue('brand.50', 'brand.900')}
            color="brand.500"
          >
            <Icon as={icon} fontSize="2xl" />
          </Box>
          <Heading size="md" fontWeight="bold">
            {title}
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            {description}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

const LandingPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const { colorMode, toggleColorMode } = useColorMode();
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, gray.900, purple.900, blue.900)'
  );

  const handleMouseMove = (e) => {
    setCursorPos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  };

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const handleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log(decoded);

      // Store auth token and user data
      localStorage.setItem('medical_auth_token', credentialResponse.credential);
      localStorage.setItem('user_data', JSON.stringify({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      }));

      // Notify parent component
      if (onLoginSuccess) {
        onLoginSuccess(decoded);
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const features = [
    {
      icon: MagnifyingGlass,
      title: 'Doctor Search',
      description: 'Find the perfect healthcare provider near you with our advanced search system. Filter by specialty, location, and ratings.',
    },
    {
      icon: Brain,
      title: 'AI-Powered Marketing',
      description: 'Generate comprehensive marketing plans tailored to your business needs using advanced AI technology.',
    },
    {
      icon: PaintBrush,
      title: 'Room Transformation',
      description: "Visualize your space's potential with our AI room transformation tool. Turn your ideas into realistic previews.",
    },
    {
      icon: ChartPie,
      title: 'Quote Generation',
      description: 'Get instant, accurate quotes for your healthcare services with our automated quote module.',
    },
  ];

  const benefits = [
    'Real-time doctor availability',
    'Personalized marketing strategies',
    'AI-powered room visualization',
    'Instant quote generation',
    'Secure data handling',
    'User-friendly interface',
  ];

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      position="relative"
      overflow="hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Dark Mode Toggle */}
      <Box position="fixed" top={4} right={4} zIndex={2}>
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <IconButton
            aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            size="lg"
            variant="ghost"
            _hover={{ bg: useColorModeValue('gray.200', 'whiteAlpha.200') }}
          />
        </MotionBox>
      </Box>

      {/* Animated Background */}
      <AnimatedBackground
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(100, 100, 255, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(255, 100, 255, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          transform: `translate(${cursorPos.x * 20}px, ${cursorPos.y * 20}px)`,
        }}
      />

      {/* Hero Section */}
      <Container maxW="container.xl" pt={{ base: 20, md: 32 }} pb={20} position="relative">
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={20} alignItems="center">
          <MotionBox
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <VStack align="flex-start" spacing={6}>
              <Badge
                colorScheme="brand"
                px={3}
                py={1}
                borderRadius="full"
                textTransform="uppercase"
                letterSpacing="wider"
                fontSize="sm"
              >
                Welcome to the Future of Healthcare
              </Badge>
              <Heading
                size="2xl"
                lineHeight="shorter"
                bgGradient="linear(to-r, brand.500, accent.500)"
                bgClip="text"
              >
                Transform Your Healthcare Experience with AI
              </Heading>
              <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.400')}>
                Discover a seamless blend of healthcare solutions and artificial intelligence.
                From finding the right doctor to transforming your space, we've got you covered.
              </Text>
              <HStack spacing={4}>
                <GoogleLogin
                  onSuccess={handleLogin}
                  onError={() => console.log('Login Failed')}
                />
                <Button
                  rightIcon={<Icon as={ArrowRight} />}
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate('/features')}
                >
                  Explore Features
                </Button>
              </HStack>
              <HStack spacing={8} pt={4}>
                <VStack align="flex-start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                    1M+
                  </Text>
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>
                    Active Users
                  </Text>
                </VStack>
                <VStack align="flex-start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                    50k+
                  </Text>
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>
                    Healthcare Providers
                  </Text>
                </VStack>
                <VStack align="flex-start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                    98%
                  </Text>
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>
                    Satisfaction Rate
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </MotionBox>

          {/* Hero Image/Animation */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            display={{ base: "none", lg: "block" }}
          >
            <Box
              position="relative"
              height="500px"
              width="100%"
            >
              <Image
                src="../../hero.gif"
                alt="AI Healthcare Animation"
                objectFit="contain"
                width="100%"
                height="100%"
                borderRadius="2xl"
                boxShadow="2xl"
              />
            </Box>
          </MotionBox>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box py={20} bg={useColorModeValue('white', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading
                size="xl"
                bgGradient="linear(to-r, brand.500, accent.500)"
                bgClip="text"
              >
                Powerful Features
              </Heading>
              <Text
                fontSize="lg"
                color={useColorModeValue('gray.600', 'gray.400')}
                maxW="2xl"
              >
                Experience the perfect blend of healthcare and technology with our comprehensive suite of features
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {features.map((feature, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Feature {...feature} />
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={12} alignItems="center">
            <VStack align="flex-start" spacing={8}>
              <Badge
                colorScheme="brand"
                px={3}
                py={1}
                borderRadius="full"
                textTransform="uppercase"
                letterSpacing="wider"
                fontSize="sm"
              >
                Why Choose Us
              </Badge>
              <Heading
                size="xl"
                bgGradient="linear(to-r, brand.500, accent.500)"
                bgClip="text"
              >
                Benefits That Set Us Apart
              </Heading>
              <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
                Experience a new standard in healthcare technology with our comprehensive platform
              </Text>
              <List spacing={4}>
                {benefits.map((benefit, index) => (
                  <ListItem
                    key={index}
                    display="flex"
                    alignItems="center"
                  >
                    <ListIcon as={CheckCircleIcon} color="brand.500" />
                    <Text>{benefit}</Text>
                  </ListItem>
                ))}
              </List>
              <Button
                rightIcon={<Icon as={ArrowRight} />}
                colorScheme="brand"
                size="lg"
                onClick={() => navigate('/register')}
              >
                Get Started Now
              </Button>
            </VStack>

            <SimpleGrid columns={2} spacing={8}>
              {[
                { icon: Globe, label: 'Global Coverage' },
                { icon: ShieldCheck, label: 'Secure Platform' },
                { icon: Lightning, label: 'Fast Results' },
                { icon: Sparkle, label: 'AI-Powered' },
                { icon: Users, label: 'User-Friendly' },
                { icon: Clock, label: '24/7 Access' },
                { icon: Target, label: 'Precision' },
                { icon: Star, label: 'Top Rated' },
              ].map((item, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <VStack
                    p={6}
                    bg={useColorModeValue('white', 'gray.800')}
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    transition="all 0.3s"
                    _hover={{
                      transform: 'translateY(-4px)',
                      shadow: 'lg',
                      borderColor: 'brand.500',
                    }}
                  >
                    <Icon as={item.icon} fontSize="3xl" color="brand.500" />
                    <Text fontWeight="medium">{item.label}</Text>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.800')}>
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading
              size="2xl"
              bgGradient="linear(to-r, brand.500, accent.500)"
              bgClip="text"
            >
              Ready to Transform Your Healthcare Experience?
            </Heading>
            <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.400')} maxW="2xl">
              Join thousands of satisfied users who have already discovered the future of healthcare technology
            </Text>
            <HStack spacing={4}>
              <GoogleLogin
                onSuccess={handleLogin}
                onError={() => console.log('Login Failed')}
              />
              <Button
                rightIcon={<Icon as={ArrowRight} />}
                variant="outline"
                colorScheme="brand"
                size="lg"
                onClick={() => navigate('/contact')}
              >
                Contact Sales
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
