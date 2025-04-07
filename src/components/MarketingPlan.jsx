import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Icon,
  useColorModeValue,
  IconButton,
  HStack,
  Alert,
  AlertIcon,
  Spinner,
  Badge,
  Divider,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from '@chakra-ui/react';
import {
  Download,
  Rocket,
  Target,
  ChartLine,
  Users,
  Money,
  Calendar,
} from 'phosphor-react';
import { APIGATEWAY_BASE } from '../config';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useAuth } from '../services/AuthContext';
import MarketingPlanPDF from './MarketingPlanPDF';

function beautifyMarketingPlan(rawText) {
  return rawText
    .replace(/\\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\n{2,}/g, '\n\n')
    .replace(/---/g, '━━━━━━━━━━━━━━')
    .replace(/### (.*?)\\n/g, '\n🎯 $1\n')
    .replace(/#### (.*?)\\n/g, '\n📌 $1\n')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .trim();
}

const MarketingPlan = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    targetAudience: '',
    objectives: '',
    budget: '',
    timeline: '',
    companyDescription: '',
    uniqueSellingProposition: '',
    competitors: '',
    existingChannels: '',
    productsServices: '',
  });

  const [formProgress, setFormProgress] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const toast = useToast();

  // Calculate form progress whenever form data changes
  useEffect(() => {
    const requiredFields = ['businessName', 'industry', 'targetAudience', 'objectives', 'budget', 'timeline'];
    const filledRequiredFields = requiredFields.filter(field => formData[field]?.trim()).length;
    const progress = (filledRequiredFields / requiredFields.length) * 100;
    setFormProgress(progress);
  }, [formData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const generatePrompt = useCallback((data) => {
    return `Create a detailed marketing plan for the following business:

Business Name: ${data.businessName}
Industry: ${data.industry}
Company Description: ${data.companyDescription}
Products/Services: ${data.productsServices}
Unique Selling Proposition: ${data.uniqueSellingProposition}
Target Audience: ${data.targetAudience}
Main Competitors: ${data.competitors}
Existing Marketing Channels: ${data.existingChannels}
Marketing Objectives: ${data.objectives}
Budget Range: ${data.budget}
Timeline: ${data.timeline}

Please provide a comprehensive marketing plan that includes:
1. Target market analysis and strategy
2. Recommended marketing channels and tactics
3. Budget allocation across different channels
4. Timeline and implementation phases
5. Key performance metrics
6. Specific recommendations and action items

Format the response as a structured marketing plan with clear sections and actionable insights.`;
  }, []);

  const generatePlan = useCallback(async () => {
    if (formProgress < 100) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields marked with * before generating the plan.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestBody = generatePrompt(formData);
      const uploadURL = `${APIGATEWAY_BASE}marketplan/create?email=${encodeURIComponent(user?.email || '')}`;

      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      // Get the response text first
      const responseText = await uploadResponse.text();
      
      console.log('API Response:', {
        status: uploadResponse.status,
        body: responseText
      });

      if (!uploadResponse.ok) {
        let errorMessage;
        try {
          // Try to parse as JSON first
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || JSON.stringify(errorData);
        } catch (e) {
          // If not JSON, use the raw text
          errorMessage = responseText;
          if (!errorMessage) {
            errorMessage = `HTTP ${uploadResponse.status}`;
          }
        }
        throw new Error(errorMessage);
      }

      const cleaned = beautifyMarketingPlan(responseText);
      setGeneratedPlan(cleaned);
      toast({
        title: "Marketing Plan Generated",
        description: "Your marketing plan has been created successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      setError(err.message);
      console.error('Error generating marketing plan:', err);
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, generatePrompt, toast, formProgress, user]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    generatePlan();
  }, [generatePlan]);

  // Color mode values
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.900, purple.900)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const labelColor = useColorModeValue('gray.700', 'gray.300');
  const inputBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const tabBg = useColorModeValue('white', 'gray.800');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.200');

  return (
    <Box minH="100vh" bgGradient={bgGradient} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          <Heading
            size="xl"
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={4}
            bgGradient="linear(to-r, brand.500, accent.500)"
            bgClip="text"
          >
            <Icon as={Rocket} weight="duotone" fontSize="40px" color="brand.500" />
            Marketing Plan Generator
          </Heading>

          {error && (
            <Alert
              status="error"
              variant="left-accent"
              borderRadius="lg"
              alignItems="flex-start"
            >
              <AlertIcon boxSize="20px" mt={1} />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">Error</Text>
                <Text>{error}</Text>
              </VStack>
            </Alert>
          )}

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* Input Form */}
            <Card
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              maxHeight="800px"
              overflowY="auto"
              boxShadow="lg"
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'gray.500',
                  borderRadius: '24px',
                },
              }}
            >
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <Box mb={4}>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color={textColor}>Form Progress</Text>
                      <Text fontSize="sm" color={textColor} fontWeight="medium">
                        {Math.round(formProgress)}%
                      </Text>
                    </HStack>
                    <Progress value={formProgress} size="sm" colorScheme="brand" borderRadius="full" />
                  </Box>

                  <Tabs variant="enclosed" onChange={setActiveTab} colorScheme="brand">
                    <TabList mb="1em">
                      <Tab _selected={{ bg: tabBg, borderBottomColor: tabBg }}>
                        <HStack spacing={2}>
                          <Icon as={Target} weight="duotone" />
                          <Text>Business Info</Text>
                        </HStack>
                      </Tab>
                      <Tab _selected={{ bg: tabBg, borderBottomColor: tabBg }}>
                        <HStack spacing={2}>
                          <Icon as={Users} weight="duotone" />
                          <Text>Target & Competition</Text>
                        </HStack>
                      </Tab>
                      <Tab _selected={{ bg: tabBg, borderBottomColor: tabBg }}>
                        <HStack spacing={2}>
                          <Icon as={ChartLine} weight="duotone" />
                          <Text>Goals & Timeline</Text>
                        </HStack>
                      </Tab>
                    </TabList>

                    <TabPanels>
                      {/* Business Info Panel */}
                      <TabPanel>
                        <Stack spacing={4}>
                          <FormControl isRequired>
                            <FormLabel color={labelColor} fontWeight="medium">
                              Business Name
                            </FormLabel>
                            <Input
                              name="businessName"
                              value={formData.businessName}
                              onChange={handleInputChange}
                              bg={inputBg}
                              borderColor={inputBorder}
                              color={textColor}
                              _hover={{ borderColor: 'brand.500' }}
                              _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                            />
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel color={labelColor} fontWeight="medium">
                              Industry
                            </FormLabel>
                            <Select
                              name="industry"
                              value={formData.industry}
                              onChange={handleInputChange}
                              bg={inputBg}
                              borderColor={inputBorder}
                              color={textColor}
                              _hover={{ borderColor: 'brand.500' }}
                              _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                            >
                              <option value="">Select Industry</option>
                              <option value="technology">Technology</option>
                              <option value="healthcare">Healthcare</option>
                              <option value="retail">Retail</option>
                              <option value="finance">Finance</option>
                              <option value="education">Education</option>
                              <option value="entertainment">Entertainment</option>
                              <option value="other">Other</option>
                            </Select>
                          </FormControl>

                          <FormControl>
                            <FormLabel color={labelColor} fontWeight="medium">
                              Company Description
                            </FormLabel>
                            <Textarea
                              name="companyDescription"
                              value={formData.companyDescription}
                              onChange={handleInputChange}
                              placeholder="Describe your company..."
                              bg={inputBg}
                              borderColor={inputBorder}
                              color={textColor}
                              _hover={{ borderColor: 'brand.500' }}
                              _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                              minH="150px"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel color={labelColor} fontWeight="medium">
                              Products/Services
                            </FormLabel>
                            <Textarea
                              name="productsServices"
                              value={formData.productsServices}
                              onChange={handleInputChange}
                              placeholder="Describe your main products/services..."
                              bg={inputBg}
                              borderColor={inputBorder}
                              color={textColor}
                              _hover={{ borderColor: 'brand.500' }}
                              _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                              minH="150px"
                            />
                          </FormControl>
                        </Stack>

                        <Box mt={4}>
                          <Alert status="info" variant="left-accent" borderRadius="md">
                            <AlertIcon />
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium">Next: Target & Competition</Text>
                              <Text fontSize="sm">Please fill in the required fields (*) and proceed to the next tab.</Text>
                            </VStack>
                          </Alert>
                        </Box>
                      </TabPanel>

                      {/* Target & Competition Panel */}
                      <TabPanel>
                        <Stack spacing={4}>
                          <FormControl>
                            <FormLabel color={labelColor} fontWeight="medium">
                              Unique Selling Proposition
                            </FormLabel>
                            <Textarea
                              name="uniqueSellingProposition"
                              value={formData.uniqueSellingProposition}
                              onChange={handleInputChange}
                              placeholder="What makes your business unique?"
                              bg={inputBg}
                              borderColor={inputBorder}
                              color={textColor}
                              _hover={{ borderColor: 'brand.500' }}
                              _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                              minH="150px"
                            />
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel color={labelColor} fontWeight="medium">
                              Target Audience
                            </FormLabel>
                            <Textarea
                              name="targetAudience"
                              value={formData.targetAudience}
                              onChange={handleInputChange}
                              placeholder="Describe your target audience..."
                              bg={inputBg}
                              borderColor={inputBorder}
                              color={textColor}
                              _hover={{ borderColor: 'brand.500' }}
                              _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                              minH="150px"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel color={labelColor} fontWeight="medium">
                              Main Competitors
                            </FormLabel>
                            <Textarea
                              name="competitors"
                              value={formData.competitors}
                              onChange={handleInputChange}
                              placeholder="List your main competitors..."
                              bg={inputBg}
                              borderColor={inputBorder}
                              color={textColor}
                              _hover={{ borderColor: 'brand.500' }}
                              _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                              minH="150px"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel color={labelColor} fontWeight="medium">
                              Existing Marketing Channels
                            </FormLabel>
                            <Textarea
                              name="existingChannels"
                              value={formData.existingChannels}
                              onChange={handleInputChange}
                              placeholder="Describe your current marketing efforts..."
                              bg={inputBg}
                              borderColor={inputBorder}
                              color={textColor}
                              _hover={{ borderColor: 'brand.500' }}
                              _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                              minH="150px"
                            />
                          </FormControl>
                        </Stack>

                        <Box mt={4}>
                          <Alert status="info" variant="left-accent" borderRadius="md">
                            <AlertIcon />
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium">Next: Goals & Timeline</Text>
                              <Text fontSize="sm">Please fill in the required fields (*) and proceed to the final tab.</Text>
                            </VStack>
                          </Alert>
                        </Box>
                      </TabPanel>

                      {/* Goals & Timeline Panel */}
                      <TabPanel>
                        <Stack spacing={4}>
                          <FormControl isRequired>
                            <FormLabel color={labelColor} fontWeight="medium">
                              Marketing Objectives
                            </FormLabel>
                            <Textarea
                              name="objectives"
                              value={formData.objectives}
                              onChange={handleInputChange}
                              placeholder="What are your marketing goals?"
                              bg={inputBg}
                              borderColor={inputBorder}
                              color={textColor}
                              _hover={{ borderColor: 'brand.500' }}
                              _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                              minH="150px"
                            />
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel color={labelColor} fontWeight="medium">
                              Budget Range
                            </FormLabel>
                            <Select
                              name="budget"
                              value={formData.budget}
                              onChange={handleInputChange}
                              bg={inputBg}
                              borderColor={inputBorder}
                              color={textColor}
                              _hover={{ borderColor: 'brand.500' }}
                              _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                              icon={<Icon as={Money} />}
                            >
                              <option value="">Select Budget Range</option>
                              <option value="0-5000">$0 - $5,000</option>
                              <option value="5000-10000">$5,000 - $10,000</option>
                              <option value="10000-25000">$10,000 - $25,000</option>
                              <option value="25000-50000">$25,000 - $50,000</option>
                              <option value="50000+">$50,000+</option>
                            </Select>
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel color={labelColor} fontWeight="medium">
                              Timeline
                            </FormLabel>
                            <Select
                              name="timeline"
                              value={formData.timeline}
                              onChange={handleInputChange}
                              bg={inputBg}
                              borderColor={inputBorder}
                              color={textColor}
                              _hover={{ borderColor: 'brand.500' }}
                              _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                              icon={<Icon as={Calendar} />}
                            >
                              <option value="">Select Timeline</option>
                              <option value="3-months">3 Months</option>
                              <option value="6-months">6 Months</option>
                              <option value="1-year">1 Year</option>
                              <option value="2-years">2 Years</option>
                            </Select>
                          </FormControl>
                        </Stack>

                        <Box mt={6}>
                          {formProgress < 100 ? (
                            <Alert status="warning" variant="left-accent" borderRadius="md">
                              <AlertIcon boxSize="20px" />
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="medium">Complete Required Fields</Text>
                                <Text fontSize="sm">Please fill in all required fields (*) before generating the plan.</Text>
                                <Text fontSize="sm" fontWeight="medium" color="orange.500">
                                  Progress: {Math.round(formProgress)}%
                                </Text>
                              </VStack>
                            </Alert>
                          ) : (
                            <VStack spacing={4} width="100%">
                              <Alert status="info" variant="left-accent" borderRadius="md">
                                <AlertIcon boxSize="20px" />
                                <VStack align="start" spacing={1}>
                                  <Text fontWeight="medium">Ready to Generate</Text>
                                  <Text fontSize="sm">
                                    This will use 1 marketing credit from your account.
                                    The generated plan will include detailed strategies
                                    based on your inputs.
                                  </Text>
                                </VStack>
                              </Alert>

                              <Button
                                type="submit"
                                variant="gradient"
                                size="lg"
                                w="full"
                                leftIcon={<Icon as={Rocket} weight="duotone" />}
                                isLoading={isLoading}
                                loadingText="Generating Plan..."
                              >
                                Generate Marketing Plan
                              </Button>
                            </VStack>
                          )}
                        </Box>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </form>
              </CardBody>
            </Card>

            {/* Generated Plan Display */}
            {(isLoading || generatedPlan) && (
              <Card
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="xl"
                boxShadow="lg"
                maxH="800px"
                overflowY="auto"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'gray.500',
                    borderRadius: '24px',
                  },
                }}
              >
                <CardBody>
                  {isLoading ? (
                    <VStack spacing={4} align="center" py={8}>
                      <Spinner size="xl" color="brand.500" thickness="4px" speed="0.65s" />
                      <Text color={textColor} fontSize="lg">
                        Crafting your marketing plan...
                      </Text>
                    </VStack>
                  ) : (
                    <>
                      <Box
                        whiteSpace="pre-wrap"
                        color={textColor}
                        p={6}
                        fontSize="md"
                        lineHeight="tall"
                        css={{
                          '& h1, & h2, & h3': {
                            fontWeight: 'bold',
                            marginTop: '1.5em',
                            marginBottom: '0.5em',
                          },
                        }}
                      >
                        {generatedPlan}
                      </Box>
                      {generatedPlan && (
                        <Box mt={6} display="flex" justifyContent="center">
                          <PDFDownloadLink
                            document={
                              <MarketingPlanPDF
                                plan={generatedPlan}
                                businessInfo={formData}
                              />
                            }
                            fileName={`${formData.businessName.replace(/\s+/g, '_')}_Marketing_Plan.pdf`}
                          >
                            {({ loading }) => (
                              <Button
                                leftIcon={<Icon as={Download} weight="duotone" />}
                                isLoading={loading}
                                variant="gradient"
                                size="lg"
                              >
                                Download PDF
                              </Button>
                            )}
                          </PDFDownloadLink>
                        </Box>
                      )}
                    </>
                  )}
                </CardBody>
              </Card>
            )}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default MarketingPlan;
