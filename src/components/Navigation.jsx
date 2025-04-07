import React from 'react';
import {
  Box,
  Flex,
  Button,
  HStack,
  useColorModeValue,
  useColorMode,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiSearch,
  FiUser,
  FiSettings,
  FiImage,
  FiLogOut,
  FiSun,
  FiMoon,
} from 'react-icons/fi';

const Navigation = ({ isAuthenticated, onLogout, userData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/doctor-search', label: 'Find Doctors', icon: FiSearch },
    { path: '/profile', label: 'Profile', icon: FiUser },
    { path: '/marketing-plan', label: 'Marketing Plans', icon: FiSettings },
    { path: '/images', label: 'Room Transform', icon: FiImage },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <Box
      as="nav"
      bg="card-bg"
      py={4}
      px={8}
      borderBottom="1px solid"
      borderColor="border-color"
      position="sticky"
      top={0}
      zIndex={1000}
      backdropFilter="blur(10px)"
      transition="all 0.2s"
    >
      <Flex justify="space-between" align="center">
        <HStack spacing={4}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              as={RouterLink}
              to={item.path}
              variant={isActive(item.path) ? 'solid' : 'ghost'}
              leftIcon={<item.icon />}
              size="sm"
            >
              {item.label}
            </Button>
          ))}
        </HStack>

        <HStack spacing={4}>
          <Tooltip
            label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
            placement="bottom"
          >
            <IconButton
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label={`Toggle ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
              size="sm"
            />
          </Tooltip>

          {isAuthenticated && (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                display="flex"
                alignItems="center"
              >
                <HStack spacing={3}>
                  <Avatar
                    size="sm"
                    name={userData?.name}
                    src={userData?.picture}
                  />
                  <Text color="text-primary">{userData?.name}</Text>
                </HStack>
              </MenuButton>
              <MenuList
                bg="card-bg"
                borderColor="border-color"
                boxShadow="lg"
              >
                <MenuItem
                  icon={<FiUser />}
                  onClick={() => navigate('/profile')}
                  color="text-primary"
                >
                  Profile
                </MenuItem>
                <MenuItem
                  icon={<FiSettings />}
                  onClick={() => navigate('/marketing-plan')}
                  color="text-primary"
                >
                  Marketing Plans
                </MenuItem>
                <MenuItem
                  icon={<FiLogOut />}
                  onClick={handleLogout}
                  color="red.500"
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navigation;
