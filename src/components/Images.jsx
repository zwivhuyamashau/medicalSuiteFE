import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  Button,
  Input,
  Select,
  Image,
  SimpleGrid,
  useToast,
  chakra,
  Card,
  CardBody,
  Icon,
  Flex,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { FiUpload, FiImage, FiArrowLeft, FiLoader, FiDownload } from 'react-icons/fi';
import { APIGATEWAY_BASE } from '../config';
import { useAuth } from '../services/AuthContext';
// Motion Components
const MotionBox = chakra(motion.div);

// Animated Upload Zone Component
const UploadZone = ({ onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const borderColor = useColorModeValue('gray.300', 'whiteAlpha.300');
  const dragBorderColor = useColorModeValue('blue.500', 'blue.400');
  const iconColor = useColorModeValue('gray.400', 'gray.500');
  const dragIconColor = useColorModeValue('blue.500', 'blue.400');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const dragTextColor = useColorModeValue('blue.500', 'blue.400');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <MotionBox
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      initial={false}
      animate={{
        borderColor: isDragging ? dragBorderColor : borderColor,
        scale: isDragging ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
      border="2px dashed"
      borderRadius="xl"
      p={8}
      textAlign="center"
      cursor="pointer"
      position="relative"
      overflow="hidden"
      role="button"
      onClick={() => document.getElementById('file-upload').click()}
      bg={useColorModeValue('white', 'whiteAlpha.50')}
      _hover={{
        borderColor: dragBorderColor,
      }}
    >
      <Input
        type="file"
        id="file-upload"
        accept="image/*"
        onChange={(e) => onFileSelect(e.target.files[0])}
        display="none"
      />
      <VStack spacing={4}>
        <Icon
          as={FiUpload}
          boxSize={12}
          color={isDragging ? dragIconColor : iconColor}
          transition="all 0.2s"
        />
        <Text
          color={isDragging ? dragTextColor : textColor}
          fontSize="lg"
          fontWeight="medium"
        >
          {selectedFile ? selectedFile.name : 'Drag and drop or click to upload'}
        </Text>
      </VStack>
    </MotionBox>
  );
};

// Image Preview Component
const ImagePreview = ({ src, alt, isGenerated = false }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const gradientStart = useColorModeValue('blue.400', 'blue.500');
  const gradientEnd = useColorModeValue('purple.400', 'purple.500');

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        bg={cardBg}
        borderRadius="xl"
        overflow="hidden"
        position="relative"
        borderWidth="1px"
        borderColor={borderColor}
        _before={{
          content: '""',
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          background: `linear-gradient(45deg, ${gradientStart}, ${gradientEnd})`,
          borderRadius: 'xl',
          zIndex: -1,
          opacity: isGenerated ? 1 : 0.3,
        }}
      >
        <CardBody p={4}>
          <Image
            position="relative"
            src={src}
            alt={alt}
            borderRadius="lg"
            objectFit="cover"
            w="full"
            h="300px"
          />
          <IconButton
            position="absolute"
            top="6"
            right="6"
            icon={<FiDownload />}
            onClick={handleDownload}
            colorScheme="blue"
            size="md"
            aria-label="Download image"
            borderRadius="full"
            _hover={{ transform: 'scale(1.1)' }}
            transition="all 0.2s"
          />
        </CardBody>
      </Card>
    </MotionBox>
  );
};

const Images = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [occupation, setOccupation] = useState('Dentist');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast({
        title: 'No image selected',
        description: 'Please select an image to transform',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const base64Image = await convertToBase64(selectedFile);

      // First API call: Get image description
      const describeResponse = await fetch(APIGATEWAY_BASE+`images/describe?email=${encodeURIComponent(user?.email || '')}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(base64Image)
      });
      console.log(JSON.stringify(describeResponse));
      console.log("--------///------------");

      if (!describeResponse.ok) {
        const errorData = await describeResponse.json();
        throw new Error(errorData.message || 'Image description failed');
      }

      const descriptionResult = await describeResponse.json();

      // Add occupation context to the analysis
      const analysisWithContext = {
        ...descriptionResult.analysis,
        occupation: occupation.toLowerCase()
      };

      const PROMPT = ` Create a highly detailed, ultra-realistic, aesthetically stunning, beautiful 3D-rendered image of a modern ${occupation}'s office filled with the common room equipment for a ${occupation}'s office. 
      Follow the exact dimensions and structure for this room in the image below:
      --------details---------
      ${descriptionResult.analysis} 
      -----------------
      Paint the walls nicely to suit the room's design.
      The room must follow the exact room dimensions as stated above.`;

      console.log(PROMPT);
      // Second API call: Generate images
      const createResponse = await fetch(APIGATEWAY_BASE+'images/create', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(PROMPT)
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || 'Image generation failed');
      }

      const result = await createResponse.json();

      if (result.imageUrl) {
        setGeneratedImages(result.imageUrl);
        toast({
          title: 'Success!',
          description: `Generated ${result.imageUrl.length} designs successfully`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error('No images were generated');
      }

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process image. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.900, purple.900)'
  );

  return (
    <Box minH="100vh" bgGradient={bgGradient} py={12}>
      <Container maxW="container.xl">
        <VStack spacing={12}>
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            textAlign="center"
          >
            <Heading
              size="2xl"
              mb={4}
              bgGradient="linear(to-r, brand.500, accent.500)"
              bgClip="text"
            >
              Room Transformation
            </Heading>
            <Text color="text-secondary" fontSize="xl">
              Transform your space with AI-powered professional design
            </Text>
          </MotionBox>

          {/* Main Content */}
          <Card layerStyle="card" w="full">
            <CardBody p={8}>
              <VStack spacing={8}>
                {/* Upload Section */}
                <UploadZone
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                />

                {/* Style Selection */}
                <Box w="full">
                  <Text color="text-primary" mb={2} fontWeight="medium">
                    Select Room Style
                  </Text>
                  <Select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    variant="outline"
                  >
                    <option value="dentist">Dentist Office</option>
                    <option value="anesthesiologist">Anesthesiologist Room</option>
                    <option value="nurse">Nurse Station</option>
                    <option value="pediatrician">Pediatrician Office</option>
                    <option value="physician">Physician Office</option>
                    <option value="pharmacist">Pharmacy</option>
                    <option value="occupational-therapist">Therapy Room</option>
                  </Select>
                </Box>

                {/* Generate Button */}
                <Button
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  loadingText="Generating..."
                  size="lg"
                  w="full"
                  variant="gradient"
                  leftIcon={isLoading ? <FiLoader /> : <FiImage />}
                >
                  Generate Design
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* Results Section */}
          <AnimatePresence>
            {(previewUrl || generatedImages.length > 0) && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                w="full"
              >
                <VStack spacing={8}>
                  {/* Original Image */}
                  {previewUrl && (
                    <Box w="full">
                      <Text
                        color="text-primary"
                        fontSize="xl"
                        fontWeight="bold"
                        mb={4}
                        textAlign="center"
                      >
                        Original Image
                      </Text>
                      <ImagePreview src={previewUrl} alt="Original" />
                    </Box>
                  )}

                  {/* Generated Images */}
                  {generatedImages.length > 0 && (
                    <Box w="full">
                      <Text
                        color="text-primary"
                        fontSize="xl"
                        fontWeight="bold"
                        mb={4}
                        textAlign="center"
                      >
                        Generated Designs
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        {generatedImages.slice(0, 4).map((image, index) => (
                          <ImagePreview
                            key={index}
                            src={image}
                            alt={`Generated ${index + 1}`}
                            isGenerated
                          />
                        ))}
                      </SimpleGrid>
                    </Box>
                  )}
                </VStack>
              </MotionBox>
            )}
          </AnimatePresence>

          {/* Back Button */}
          <Link to="/dashboard">
            <Button
              variant="ghost"
              leftIcon={<FiArrowLeft />}
            >
              Back to Dashboard
            </Button>
          </Link>
        </VStack>
      </Container>
    </Box>
  );
};

export default Images;
