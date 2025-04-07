import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  VStack,
  Text,
  Flex,
  useColorModeValue,
  Grid,
  SimpleGrid,
  Input,
  Button,
  chakra,
  Heading,
  Badge,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Icon
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import {
  FiPackage,
  FiArrowLeft,
  FiDownload,
  FiDollarSign,
  FiCheckCircle,
  FiLoader,
  FiGrid,
  FiList
} from 'react-icons/fi';
import { useQuoteData, transformApiResponse, validateQuoteData, formatCurrency } from './quoteHelpers';
import { QuotePDF } from './generatePDF';
import { APIGATEWAY_BASE } from '../config';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useAuth } from '../services/AuthContext';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);
const MotionBadge = motion(Badge);

// Custom animations
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0); }
  25% { transform: translateY(-10px) rotate(3deg); }
  75% { transform: translateY(10px) rotate(-3deg); }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 15px rgba(66, 153, 225, 0.6),
                0 0 30px rgba(66, 153, 225, 0.4),
                0 0 45px rgba(66, 153, 225, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(66, 153, 225, 0.8),
                0 0 60px rgba(66, 153, 225, 0.6),
                0 0 90px rgba(66, 153, 225, 0.4);
  }
`;

const shine = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const GlowingBox = chakra(motion.div, {
  baseStyle: {
    position: 'relative',
    borderRadius: '20px',
    padding: '2px',
    _before: {
      content: '""',
      position: 'absolute',
      top: '-2px',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      background: 'linear-gradient(45deg, #00f2fe, #4facfe, #00f2fe)',
      borderRadius: '22px',
      zIndex: -1,
      animation: `${glow} 3s ease-in-out infinite`,
    },
  },
});

const AnimatedButton = chakra(motion.button, {
  baseStyle: {
    position: 'relative',
    padding: '12px 24px',
    fontSize: '1.1rem',
    fontWeight: '600',
    borderRadius: '12px',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    _before: {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(120deg, #00f2fe, #4facfe, #00f2fe)',
      backgroundSize: '200% auto',
      zIndex: '-1',
      transition: 'opacity 0.3s ease',
    },
    _hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 7px 14px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
    },
    _active: {
      transform: 'translateY(1px)',
    },
  },
});

const QuoteModule = () => {
  const [selectedOffering, setSelectedOffering] = useState(null);
  const [quoteData, setQuoteData] = useState({
    // Add new fields with default empty values
    name: '',
    surname: '',
    companyName: '',
    province: '',
    mpNumber: '',
    prNumber: '',
    // Other quote data will be added here
  });

  const [quoteResult, setQuoteResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const { user } = useAuth();
  
  const { data: companies, loading: isLoading, error } = useQuoteData();

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, gray.900, purple.900, blue.900)'
  );

  const handleGetQuote = async () => {
    // Validate form data
    const errors = validateQuoteData(quoteData, selectedOffering.fields);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      
      
      const URL = APIGATEWAY_BASE + `quoteModule/getItem?email=${encodeURIComponent(user?.email || '')}&compNameOfferering=`+selectedOffering.key;

      const response = await fetch(URL)

      /*
      const response = await fetch(URL,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(quoteData)
      });
      */

      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }

      const responseClean = await response.json();
      console.log(responseClean);
      console.log("---------------");


      //-----------------

      const transformed = transformApiResponse(responseClean);
      setQuoteResult(transformed);
      setFormErrors({});
    } catch (err) {
      console.error('Quote calculation error:', err);
    }
    setLoading(false);
  };

  const LoadingOverlay = ({ message }) => (
    <MotionFlex
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      position="fixed"
      inset="0"
      bg="rgba(0, 0, 0, 0.7)"
      backdropFilter="blur(5px)"
      alignItems="center"
      justifyContent="center"
      zIndex="50"
    >
      <GlowingBox p={8} bg={useColorModeValue('white', 'gray.800')} borderRadius="xl">
        <VStack spacing={4}>
          <Icon
            as={FiLoader}
            w={8}
            h={8}
            color="blue.400"
            sx={{ animation: `${float} 1s ease-in-out infinite` }}
          />
          <Text fontSize="lg" fontWeight="medium">{message}</Text>
        </VStack>
      </GlowingBox>
    </MotionFlex>
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (error) {
    return (
      <Box minH="100vh" bgGradient={bgGradient} py={20}>
        <Container>
          <GlowingBox>
            <Box p={8} bg={useColorModeValue('white', 'gray.800')} borderRadius="18px">
              <Heading
                color="red.500"
                mb={4}
                size="lg"
              >
                Error Loading Quote Data
              </Heading>
              <Text mb={6}>{error}</Text>
              <Link to="/dashboard">
                <AnimatedButton color="white">
                  <Icon as={FiArrowLeft} mr={2} />
                  Return to Dashboard
                </AnimatedButton>
              </Link>
            </Box>
          </GlowingBox>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bgGradient={bgGradient} overflow="hidden">
      {isLoading && <LoadingOverlay message="Loading services..." />}
      {loading && <LoadingOverlay message="Calculating your quote..." />}

      <Container maxW="container.xl" py={8}>
        <MotionFlex
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          direction="column"
          spacing={8}
        >
          <Flex justify="space-between" align="center" mb={8}>
            <Heading
              fontSize={{ base: "2xl", md: "4xl" }}
              bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
              bgClip="text"
              fontWeight="bold"
              sx={{ animation: `${shine} 3s linear infinite` }}
            >
              Get a Quote
            </Heading>
            <Link to="/dashboard">
              <AnimatedButton
                display="flex"
                alignItems="center"
                color="white"
                px={4}
                py={2}
              >
                <Icon as={FiArrowLeft} mr={2} />
                Dashboard
              </AnimatedButton>
            </Link>
          </Flex>

          {!selectedOffering ? (
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
              gap={6}
            >
              {companies?.map(company => (
                <MotionBox
                  key={company.id}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlowingBox>
                    <Box
                      p={6}
                      bg={useColorModeValue('white', 'gray.800')}
                      borderRadius="18px"
                      onClick={() => setSelectedCompanyId(
                        prev => prev === company.id ? null : company.id
                      )}
                      cursor="pointer"
                    >
                      <Heading
                        size="md"
                        mb={4}
                        bgGradient="linear(to-r, blue.400, purple.500)"
                        bgClip="text"
                      >
                        {company.name}
                      </Heading>

                      {selectedCompanyId === company.id && (
                        <VStack spacing={4} align="stretch">
                          <Divider />
                          {company.offerings.map(offering => (
                            <MotionBox
                              key={offering.id}
                              p={4}
                              bg={useColorModeValue('gray.50', 'gray.700')}
                              borderRadius="lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOffering(offering);
                                setQuoteData({ name: '', surname: '', companyName: '', province: '', mpNumber: '', prNumber: '' });
                                setFormErrors({});
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Text fontWeight="bold" mb={2}>{offering.name}</Text>
                              <MotionBadge
                                colorScheme="blue"
                                variant="subtle"
                                whileHover={{ scale: 1.1 }}
                              >
                                Get Quote
                              </MotionBadge>
                            </MotionBox>
                          ))}
                        </VStack>
                      )}
                    </Box>
                  </GlowingBox>
                </MotionBox>
              ))}
            </Grid>
          ) : (
            <GlowingBox>
              <Box
                p={8}
                bg={useColorModeValue('white', 'gray.800')}
                borderRadius="18px"
                maxW="3xl"
                mx="auto"
              >
                <Flex justify="space-between" align="center" mb={6}>
                  <Heading
                    size="lg"
                    bgGradient="linear(to-r, blue.400, purple.500)"
                    bgClip="text"
                  >
                    {selectedOffering.name}
                  </Heading>
                  <AnimatedButton
                    onClick={() => {
                      setSelectedOffering(null);
                      setQuoteResult(null);
                      setQuoteData({ name: '', surname: '', companyName: '', province: '', mpNumber: '', prNumber: '' });
                      setFormErrors({});
                    }}
                    color="white"
                  >
                    <Icon as={FiArrowLeft} mr={2} />
                    Back
                  </AnimatedButton>
                </Flex>

                {!quoteResult ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleGetQuote();
                  }}>
                    <VStack spacing={6}>
                      {/* Personal Information Section */}
                      <Box w="100%">
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          mb={4}
                          bgGradient="linear(to-r, blue.400, purple.500)"
                          bgClip="text"
                        >
                          Personal Information
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <FormControl isRequired>
                            <FormLabel
                              fontWeight="medium"
                              bgGradient="linear(to-r, blue.400, purple.500)"
                              bgClip="text"
                            >
                              Name
                            </FormLabel>
                            <Input
                              variant="filled"
                              value={quoteData.name}
                              onChange={(e) => setQuoteData({
                                ...quoteData,
                                name: e.target.value
                              })}
                            />
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel
                              fontWeight="medium"
                              bgGradient="linear(to-r, blue.400, purple.500)"
                              bgClip="text"
                            >
                              Surname
                            </FormLabel>
                            <Input
                              variant="filled"
                              value={quoteData.surname}
                              onChange={(e) => setQuoteData({
                                ...quoteData,
                                surname: e.target.value
                              })}
                            />
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel
                              fontWeight="medium"
                              bgGradient="linear(to-r, blue.400, purple.500)"
                              bgClip="text"
                            >
                              Company Name
                            </FormLabel>
                            <Input
                              variant="filled"
                              value={quoteData.companyName}
                              onChange={(e) => setQuoteData({
                                ...quoteData,
                                companyName: e.target.value
                              })}
                            />
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel
                              fontWeight="medium"
                              bgGradient="linear(to-r, blue.400, purple.500)"
                              bgClip="text"
                            >
                              Province
                            </FormLabel>
                            <Input
                              variant="filled"
                              value={quoteData.province}
                              onChange={(e) => setQuoteData({
                                ...quoteData,
                                province: e.target.value
                              })}
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel
                              fontWeight="medium"
                              bgGradient="linear(to-r, blue.400, purple.500)"
                              bgClip="text"
                            >
                              MP Number
                            </FormLabel>
                            <Input
                              variant="filled"
                              value={quoteData.mpNumber}
                              onChange={(e) => setQuoteData({
                                ...quoteData,
                                mpNumber: e.target.value
                              })}
                              placeholder="Optional"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel
                              fontWeight="medium"
                              bgGradient="linear(to-r, blue.400, purple.500)"
                              bgClip="text"
                            >
                              PR Number
                            </FormLabel>
                            <Input
                              variant="filled"
                              value={quoteData.prNumber}
                              onChange={(e) => setQuoteData({
                                ...quoteData,
                                prNumber: e.target.value
                              })}
                              placeholder="Optional"
                            />
                          </FormControl>
                        </SimpleGrid>
                      </Box>

                      {selectedOffering.fields.map((field) => (
                        <FormControl
                          key={field}
                          isInvalid={formErrors[field]}
                        >
                          <FormLabel
                            fontWeight="medium"
                            bgGradient="linear(to-r, blue.400, purple.500)"
                            bgClip="text"
                          >
                            {field}
                          </FormLabel>
                          <Input
                            variant="filled"
                            bg={useColorModeValue('gray.100', 'gray.700')}
                            borderWidth={2}
                            borderColor="transparent"
                            _hover={{
                              borderColor: 'blue.400',
                              bg: useColorModeValue('gray.200', 'gray.600')
                            }}
                            _focus={{
                              borderColor: 'blue.500',
                              boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)'
                            }}
                            required={!field.toLowerCase().includes('optional')}
                            onChange={(e) => setQuoteData({
                              ...quoteData,
                              [field]: e.target.value
                            })}
                          />
                          <FormErrorMessage>
                            {formErrors[field]}
                          </FormErrorMessage>
                        </FormControl>
                      ))}

                      <AnimatedButton
                        type="submit"
                        w="100%"
                        color="white"
                        disabled={loading}
                      >
                        {loading ? (
                          <Flex align="center" justify="center">
                            <Icon
                              as={FiLoader}
                              mr={2}
                              sx={{ animation: `${float} 1s linear infinite` }}
                            />
                            Calculating...
                          </Flex>
                        ) : (
                          <Flex align="center" justify="center">
                            <Icon as={FiDollarSign} mr={2} />
                            Get Quote
                          </Flex>
                        )}
                      </AnimatedButton>
                    </VStack>
                  </form>
                ) : (
                  <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <VStack spacing={8} align="stretch">
                      {quoteResult.items.map((item, index) => (
                        <Box key={index}>
                          <Heading
                            size="md"
                            mb={4}
                            bgGradient="linear(to-r, blue.400, purple.500)"
                            bgClip="text"
                          >
                            {item.category}
                          </Heading>
                          <VStack spacing={4} align="stretch" pl={4}>
                            {item.details.map((detail, dIndex) => (
                              <Box
                                key={dIndex}
                                p={4}
                                bg={useColorModeValue('gray.50', 'gray.700')}
                                borderRadius="lg"
                              >
                                <Flex justify="space-between" align="center">
                                  <Text fontWeight="medium">{detail.name}</Text>
                                  {detail.cost && (
                                    <Badge
                                      colorScheme="green"
                                      fontSize="md"
                                      px={3}
                                      py={1}
                                      borderRadius="full"
                                    >
                                      {formatCurrency(detail.cost)}
                                    </Badge>
                                  )}
                                </Flex>
                                {detail.subItems && (
                                  <VStack align="stretch" mt={2} pl={4}>
                                    {detail.subItems.map((subItem, sIndex) => (
                                      <Text
                                        key={sIndex}
                                        color={useColorModeValue('gray.600', 'gray.400')}
                                      >
                                        • {subItem}
                                      </Text>
                                    ))}
                                  </VStack>
                                )}
                              </Box>
                            ))}
                          </VStack>
                        </Box>
                      ))}

                      <Box
                        p={6}
                        bg={useColorModeValue('blue.50', 'blue.900')}
                        borderRadius="xl"
                        textAlign="center"
                      >
                        <Text
                          fontSize="2xl"
                          fontWeight="bold"
                          bgGradient="linear(to-r, green.400, teal.400)"
                          bgClip="text"
                          mb={6}
                        >
                          Total Estimated Cost: {formatCurrency(quoteResult.total)}
                        </Text>

                        <PDFDownloadLink
                          document={<QuotePDF quoteResult={quoteResult} quoteData={quoteData} />}
                          fileName="quote.pdf"
                        >
                          {({ loading }) => (
                            <AnimatedButton
                              color="white"
                              disabled={loading}
                            >
                              <Flex align="center">
                                {loading ? (
                                  <>
                                    <Icon
                                      as={FiLoader}
                                      mr={2}
                                      sx={{ animation: `${float} 1s linear infinite` }}
                                    />
                                    Generating PDF...
                                  </>
                                ) : (
                                  <>
                                    <Icon as={FiDownload} mr={2} />
                                    Download Quote PDF
                                  </>
                                )}
                              </Flex>
                            </AnimatedButton>
                          )}
                        </PDFDownloadLink>
                      </Box>
                    </VStack>
                  </MotionBox>
                )}
              </Box>
            </GlowingBox>
          )}
        </MotionFlex>
      </Container>
    </Box>
  );
};

export default QuoteModule;
