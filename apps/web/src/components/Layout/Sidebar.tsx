import {
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  BoxProps,
  VStack,
  HStack,
  Avatar,
  Divider,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiCheckSquare,
  FiShield,
  FiDatabase,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { useAuth } from '../../hooks/useAuth'

interface LinkItemProps {
  name: string
  icon: IconType
  path: string
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

export function Sidebar({ onClose, ...rest }: SidebarProps) {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  
  const LinkItems: Array<LinkItemProps> = [
    { name: t('navigation.dashboard'), icon: FiHome, path: '/dashboard' },
    { name: 'My Profile', icon: FiStar, path: '/profile' },
    { name: t('navigation.projects'), icon: FiCompass, path: '/projects' },
    { name: t('navigation.verifications'), icon: FiCheckSquare, path: '/verifications' },
    { name: 'Data Management', icon: FiDatabase, path: '/data-management' },
    { name: t('navigation.analytics'), icon: FiTrendingUp, path: '/analytics' },
    { name: t('navigation.settings'), icon: FiSettings, path: '/settings' },
  ]

  // Add admin link for admin users
  const adminLinkItems: Array<LinkItemProps> = [
    { name: 'Admin Profile', icon: FiShield, path: '/admin/profile' },
  ]

  const allLinkItems = user?.role === 'ADMIN' 
    ? [...LinkItems, ...adminLinkItems]
    : LinkItems

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <HStack spacing={3}>
          <Box
            w={8}
            h={8}
            bg="brand.500"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FiStar} color="white" />
          </Box>
          <Text fontSize="xl" fontWeight="bold" color="brand.500">
            BlueCarbon
          </Text>
        </HStack>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      <VStack spacing={1} align="stretch" px={4}>
        {allLinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} path={link.path}>
            {link.name}
          </NavItem>
        ))}
      </VStack>

      <Box position="absolute" bottom={4} left={4} right={4}>
        <Divider mb={4} />
        <HStack spacing={3} mb={3}>
          <Avatar size="sm" name={user?.name} />
          <VStack align="start" spacing={0} flex={1}>
            <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
              {user?.name}
            </Text>
            <Text fontSize="xs" color="gray.500" noOfLines={1}>
              {user?.organization}
            </Text>
          </VStack>
        </HStack>
        <Text
          fontSize="sm"
          color="brand.500"
          cursor="pointer"
          _hover={{ textDecoration: 'underline' }}
          onClick={logout}
        >
          {t('navigation.logout')}
        </Text>
      </Box>
    </Box>
  )
}

interface NavItemProps {
  icon: IconType
  children: string
  path: string
}

function NavItem({ icon, children, path }: NavItemProps) {
  const location = useLocation()
  const isActive = location.pathname === path

  return (
    <Link to={path}>
      <Flex
        align="center"
        p="3"
        mx="2"
        borderRadius="2xl"
        role="group"
        cursor="pointer"
        bg={isActive ? 'brand.50' : 'transparent'}
        color={isActive ? 'brand.600' : 'gray.600'}
        fontWeight={isActive ? 'semibold' : 'medium'}
        _hover={{
          bg: 'brand.50',
          color: 'brand.600',
        }}
        transition="all 0.2s"
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  )
}
