import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Box, VStack, Text, Heading, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Changed this line

const Authentication = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Decoded Google User:', decoded);

    // Store user data
    localStorage.setItem('medical_auth_token', credentialResponse.credential);
    localStorage.setItem('user_data', JSON.stringify({
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
      role: 'Physician', // You can customize this based on your needs
      department: 'General' // You can customize this based on your needs
    }));

    // Call the success handler
    onLoginSuccess({
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
      role: 'Physician',
      department: 'General'
    });

    // Navigate to dashboard
    navigate('/dashboard');
  };

  const handleGoogleError = () => {
    console.error('Google Sign In was unsuccessful.');
  };

  return (
    <Box
      minH="100vh"
      bg="brand.background"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="md">
        <VStack spacing={8} align="center">
          <Heading color="white" size="xl" textAlign="center">
            Welcome to Best Medical
          </Heading>
          <Text color="gray.400" textAlign="center">
            Please sign in with your Google account to continue
          </Text>
          <Box p={4}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_black"
              shape="pill"
              size="large"
              text="continue_with"
              context="signin"
            />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Authentication;
