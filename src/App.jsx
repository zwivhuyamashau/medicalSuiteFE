import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  useToast,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import theme from './theme';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import QuoteModule from './components/QuoteModule';
import Profile from './components/Profile';
import MarketingPlan from './components/MarketingPlan';
import Images from './components/Images';
import DoctorSearch from './components/DoctorSearch';
import { AuthProvider } from './services/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('medical_auth_token');
      const storedUserData = localStorage.getItem('user_data');

      if (token && storedUserData) {
        setIsAuthenticated(true);
        setUserData(JSON.parse(storedUserData));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (userData && !isLoading) {
      toast({
        title: `Welcome back, ${userData.name}`,
        description: `Logged in as ${userData.role} in ${userData.department}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
        variant: 'solid',
      });
    }
  }, [userData, isLoading, toast]);

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setUserData(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('medical_auth_token');
    localStorage.removeItem('user_data');
    setIsAuthenticated(false);
    setUserData(null);
  };

  if (isLoading) {
    return (
      <ChakraProvider theme={theme}>
        <Box
          minH="100vh"
          bg="page-bg"
          display="flex"
          alignItems="center"
          justifyContent="center"
          transition="all 0.2s"
        >
          <VStack spacing={4}>
            <Heading textStyle="gradient">Loading Best Medical...</Heading>
          </VStack>
        </Box>
      </ChakraProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId="XXXX-clientID">
      <ChakraProvider theme={theme}>
        <Router>
          <AuthProvider>
            <Box
              minH="100vh"
              bg="page-bg"
              color="text-primary"
              transition="all 0.2s"
            >
              {isAuthenticated && (
                <Navigation
                  isAuthenticated={isAuthenticated}
                  onLogout={handleLogout}
                  userData={userData}
                />
              )}

              <Routes>
                <Route
                  path="/"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <LandingPage onLoginSuccess={handleLoginSuccess} />
                    )
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Dashboard userData={userData} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor-search"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <DoctorSearch />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quote-module"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <QuoteModule />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Profile userData={userData} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/marketing-plan"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <MarketingPlan />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/images"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Images />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Box>
          </AuthProvider>
        </Router>
      </ChakraProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
