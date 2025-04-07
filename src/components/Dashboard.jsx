import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  useColorModeValue,
  SimpleGrid,
  Icon,
  VStack,
  HStack,
  Spinner,
  Container,
  useColorMode,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlass,
  Brain,
  PaintBrush,
  ChartPie,
  ArrowRight,
} from 'phosphor-react';
import { motion, useAnimation } from 'framer-motion';
import '@n8n/chat/style.css';
import './chatbot.css';
import { createChat } from '@n8n/chat';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Fun animations for icons
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-4px) rotate(2deg); }
  50% { transform: translateY(0px) rotate(0deg); }
  75% { transform: translateY(4px) rotate(-2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const wave = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  75% { transform: rotate(-15deg); }
  100% { transform: rotate(0deg); }
`;

// Animated Icon Component
const AnimatedIcon = ({ icon: IconComponent, color, isHovered, animation }) => {
  const getAnimation = () => {
    switch (animation) {
      case 'search':
        return {
          animation: isHovered ? `${float} 2s ease-in-out infinite` : 'none',
          transform: 'scale(1.2)',
        };
      case 'brain':
        return {
          animation: isHovered ? `${pulse} 1s ease-in-out infinite` : 'none',
          transform: 'scale(1.2)',
        };
      case 'paint':
        return {
          animation: isHovered ? `${wave} 1s ease-in-out infinite` : 'none',
          transform: 'scale(1.2)',
        };
      case 'chart':
        return {
          animation: isHovered ? `${spin} 4s linear infinite` : 'none',
          transform: 'scale(1.2)',
        };
      default:
        return {};
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      w={16}
      h={16}
      borderRadius="xl"
      bg={`${color}15`}
      color={color}
      transition="all 0.3s"
      sx={getAnimation()}
      position="relative"
    >
      <Icon as={IconComponent} weight="duotone" fontSize="32px" />
      {isHovered && (
        <>
          {animation === 'search' && (
            <Box
              position="absolute"
              top="-2px"
              right="-2px"
              width="8px"
              height="8px"
              borderRadius="full"
              bg={color}
              animation={`${pulse} 1s ease-in-out infinite`}
            />
          )}
          {animation === 'brain' && (
            <>
              {[...Array(3)].map((_, i) => (
                <Box
                  key={i}
                  position="absolute"
                  top={`${Math.random() * 100}%`}
                  left={`${Math.random() * 100}%`}
                  width="4px"
                  height="4px"
                  borderRadius="full"
                  bg={color}
                  animation={`${pulse} ${0.8 + i * 0.2}s ease-in-out infinite`}
                />
              ))}
            </>
          )}
          {animation === 'paint' && (
            <>
              {[...Array(4)].map((_, i) => (
                <Box
                  key={i}
                  position="absolute"
                  top={`${20 + i * 20}%`}
                  left={`${20 + i * 20}%`}
                  width="6px"
                  height="6px"
                  borderRadius="full"
                  bg={color}
                  animation={`${float} ${1 + i * 0.2}s ease-in-out infinite`}
                  opacity={0.6}
                />
              ))}
            </>
          )}
          {animation === 'chart' && (
            <>
              {[...Array(4)].map((_, i) => (
                <Box
                  key={i}
                  position="absolute"
                  top="50%"
                  left="50%"
                  width="30px"
                  height="30px"
                  borderRadius="full"
                  border="2px solid"
                  borderColor={color}
                  transform={`translate(-50%, -50%) scale(${1 + i * 0.4})`}
                  opacity={1 - i * 0.2}
                  animation={`${pulse} ${1 + i * 0.2}s ease-in-out infinite`}
                />
              ))}
            </>
          )}
        </>
      )}
    </Flex>
  );
};

// Modern Feature Card Component
const FeatureCard = ({ icon: IconComponent, title, description, color, onClick, animation }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const controls = useAnimation();

  const handleHoverStart = () => {
    setIsHovered(true);
    controls.start({
      y: -8,
      transition: { duration: 0.2 },
    });
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    controls.start({
      y: 0,
      transition: { duration: 0.2 },
    });
  };

  return (
    <MotionBox
      as="button"
      onClick={onClick}
      position="relative"
      width="100%"
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      animate={controls}
      whileTap={{ scale: 0.98 }}
    >
      <Box
        bg={cardBg}
        p={8}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow={isHovered ? 'xl' : 'md'}
        transition="all 0.2s"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient={`linear(to-br, ${color}, ${color})`}
          opacity={isHovered ? 0.05 : 0}
          transition="opacity 0.2s"
        />

        <VStack align="flex-start" spacing={6} position="relative">
          <AnimatedIcon
            icon={IconComponent}
            color={color}
            isHovered={isHovered}
            animation={animation}
          />

          <VStack align="flex-start" spacing={2}>
            <Heading size="md" color={useColorModeValue('gray.900', 'white')}>
              {title}
            </Heading>
            <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="sm">
              {description}
            </Text>
          </VStack>

          <HStack
            color={color}
            spacing={2}
            opacity={isHovered ? 1 : 0.5}
            transition="all 0.2s"
          >
            <Text fontSize="sm" fontWeight="medium">
              Learn more
            </Text>
            <Icon
              as={ArrowRight}
              transform={isHovered ? 'translateX(4px)' : 'translateX(0)'}
              transition="transform 0.2s"
            />
          </HStack>
        </VStack>
      </Box>
    </MotionBox>
  );
};

// Initialize chat only once
let chatInstance = null;

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    const checkAuth = () => {
      try {
        setIsLoading(true);
        setError(null);

        const authToken = localStorage.getItem('medical_auth_token');
        if (!authToken) {
          navigate('/');
          return;
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        setError('Error loading user data');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Initialize chat and handle theme changes
  useEffect(() => {
    // Update the theme attribute on the html element
    document.documentElement.setAttribute('data-theme', colorMode);

    // Initialize chat if not already initialized
    if (!chatInstance) {
      chatInstance = createChat({
        webhookUrl: "XXXXXXXXXXX",
        webhookConfig: {
          method: 'POST',
          headers: {},
        },
        target: '#n8n-chat',
        mode: 'window',
        chatInputKey: 'chatInput',
        chatSessionKey: 'sessionId',
        metadata: {},
        showWelcomeScreen: false,
        defaultLanguage: 'en',
        initialMessages: [
          'Hi there!',
          'My name is Best Medical. How can I assist you today?',
        ],
        i18n: {
          en: {
            title: 'Hi there! ',
            subtitle: '',
            footer: '',
            getStarted: 'New Conversation',
            inputPlaceholder: 'Type your question..',
            closeButtonTooltip: 'Close chat'
          },
        },
      });
    }

    // Force a re-render of the chat window when theme changes
    const chatWindow = document.querySelector('#n8n-chat');
    if (chatWindow) {
      chatWindow.style.display = 'none';
      setTimeout(() => {
        chatWindow.style.display = 'block';
      }, 0);
    }
  }, [colorMode]);

  if (isLoading) {
    return (
      <Flex minH="100vh" bg={bgColor} align="center" justify="center">
        <Spinner
          thickness="3px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex minH="100vh" bg={bgColor} align="center" justify="center">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  const features = [
    {
      icon: MagnifyingGlass,
      title: 'Find Doctors',
      description: 'Search and connect with healthcare professionals in your area',
      color: 'blue.500',
      path: '/doctor-search',
      animation: 'search'
    },
    {
      icon: Brain,
      title: 'AI Marketing',
      description: 'Generate powerful marketing strategies using artificial intelligence',
      color: 'purple.500',
      path: '/marketing-plan',
      animation: 'brain'
    },
    {
      icon: PaintBrush,
      title: 'Room Design',
      description: 'Transform your space with AI-powered interior design visualization',
      color: 'pink.500',
      path: '/images',
      animation: 'paint'
    },
    {
      icon: ChartPie,
      title: 'Get Quote',
      description: 'Receive instant quotes for healthcare services and facilities',
      color: 'green.500',
      path: '/quote-module',
      animation: 'chart'
    }
  ];

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header Section */}
      <Box
        bg={headerBg}
        borderBottom="1px solid"
        borderColor={borderColor}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="7xl" py={6}>
          <VStack align="stretch" spacing={4}>
            <MotionBox
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <VStack align="flex-start" spacing={1}>
                <Heading
                  size="2xl"
                  bgGradient="linear(to-r, blue.500, purple.500)"
                  bgClip="text"
                  letterSpacing="tight"
                >
                  Healthcare Dashboard
                </Heading>
                <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="lg">
                  Access your healthcare management tools
                </Text>
              </VStack>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={12}>
        <VStack spacing={12} align="stretch">
          {/* Features Section */}
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={8}
            as={MotionFlex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <MotionBox
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  color={feature.color}
                  onClick={() => navigate(feature.path)}
                  animation={feature.animation}
                />
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Chat Container */}
      <Box
        position="fixed"
        bottom="4"
        right="4"
        width="350px"
        height="500px"
        id="n8n-chat"
        zIndex="modal"
      />
    </Box>
  );
};

export default Dashboard;
