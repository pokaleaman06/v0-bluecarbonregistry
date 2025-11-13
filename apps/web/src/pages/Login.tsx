import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  Card,
  CardBody,
  HStack,
  Icon,
  useColorModeValue,
  PinInput,
  PinInputField,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiStar, FiPhone, FiBriefcase, FiShield } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

const MotionBox = motion(Box)

export function Login() {
  const { t } = useTranslation()
  const { login, switchRole } = useAuth()
  const [step, setStep] = useState<'phone' | 'otp' | 'role'>('role')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'COMPANY'>('ADMIN')
  
  const cardBg = useColorModeValue('white', 'gray.800')
  const bgGradient = useColorModeValue(
    'linear(to-br, brand.50, ocean.50)',
    'linear(to-br, gray.900, gray.800)'
  )

  const handleRoleSelect = (role: 'ADMIN' | 'COMPANY') => {
    setSelectedRole(role)
    setStep('phone')
  }

  const handlePhoneSubmit = async () => {
    setIsLoading(true)
    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 1000))
    setStep('otp')
    setIsLoading(false)
  }

  const handleOtpSubmit = async () => {
    setIsLoading(true)
    // Set the role before login
    switchRole(selectedRole)
    await login(phone, otp)
    setIsLoading(false)
  }

  const handleBackToRole = () => {
    setStep('role')
    setPhone('')
    setOtp('')
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient={bgGradient}
      p={4}
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        w="full"
        maxW="md"
      >
        <Card bg={cardBg} borderRadius="3xl" boxShadow="xl" border="1px solid" borderColor="gray.100">
          <CardBody p={8}>
            <VStack spacing={8}>
              {/* Logo and Title */}
              <VStack spacing={4}>
                <HStack spacing={3}>
                  <Box
                    w={12}
                    h={12}
                    bg="brand.500"
                    borderRadius="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    className="pulse-glow"
                  >
                    <Icon as={FiStar} color="white" w={6} h={6} />
                  </Box>
                  <Heading size="lg" color="brand.500">
                    BlueCarbon Registry
                  </Heading>
                </HStack>
                <Text color="gray.600" textAlign="center">
                  {t('auth.welcome')}
                </Text>
              </VStack>

              {/* Role Selection Step */}
              {step === 'role' && (
                <VStack spacing={6} w="full">
                  <VStack spacing={2} w="full">
                    <Text fontSize="lg" fontWeight="medium" color="gray.800">
                      Select Login Type
                    </Text>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Choose your account type to continue
                    </Text>
                  </VStack>

                  <VStack spacing={4} w="full">
                    <Button
                      onClick={() => handleRoleSelect('ADMIN')}
                      colorScheme={selectedRole === 'ADMIN' ? 'brand' : 'gray'}
                      size="lg"
                      w="full"
                      borderRadius="2xl"
                      leftIcon={<FiShield />}
                      variant={selectedRole === 'ADMIN' ? 'solid' : 'outline'}
                    >
                      Admin Login
                    </Button>

                    <Button
                      onClick={() => handleRoleSelect('COMPANY')}
                      colorScheme={selectedRole === 'COMPANY' ? 'brand' : 'gray'}
                      size="lg"
                      w="full"
                      borderRadius="2xl"
                      leftIcon={<FiBriefcase />}
                      variant={selectedRole === 'COMPANY' ? 'solid' : 'outline'}
                    >
                      Company Login
                    </Button>
                  </VStack>
                </VStack>
              )}

              {/* Phone Input Step */}
              {step === 'phone' && (
                <VStack spacing={6} w="full">
                  <VStack spacing={2} w="full">
                    <HStack w="full" justify="space-between">
                      <Text fontSize="lg" fontWeight="medium" color="gray.800">
                        {selectedRole === 'ADMIN' ? 'Admin Login' : 'Company Login'}
                      </Text>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleBackToRole}
                      >
                        Change
                      </Button>
                    </HStack>
                    <Divider />
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      We'll send you a verification code
                    </Text>
                  </VStack>

                  <VStack spacing={4} w="full">
                    <Box position="relative" w="full">
                      <Icon
                        as={FiPhone}
                        position="absolute"
                        left={4}
                        top="50%"
                        transform="translateY(-50%)"
                        color="gray.400"
                        zIndex={2}
                      />
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        pl={12}
                        size="lg"
                        borderRadius="2xl"
                        bg="gray.50"
                        border="2px solid"
                        borderColor="gray.100"
                        _focus={{
                          borderColor: 'brand.500',
                          bg: 'white',
                        }}
                      />
                    </Box>

                    <Button
                      onClick={handlePhoneSubmit}
                      isLoading={isLoading}
                      loadingText="Sending OTP..."
                      colorScheme="brand"
                      size="lg"
                      w="full"
                      borderRadius="2xl"
                      isDisabled={!phone}
                    >
                      Send OTP
                    </Button>
                  </VStack>
                </VStack>
              )}

              {/* OTP Input Step */}
              {step === 'otp' && (
                <VStack spacing={6} w="full">
                  <VStack spacing={2} w="full">
                    <HStack w="full" justify="space-between">
                      <Text fontSize="lg" fontWeight="medium" color="gray.800">
                        {selectedRole === 'ADMIN' ? 'Admin Login' : 'Company Login'}
                      </Text>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleBackToRole}
                      >
                        Change
                      </Button>
                    </HStack>
                    <Divider />
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Enter the 6-digit code sent to {phone}
                    </Text>
                  </VStack>

                  <VStack spacing={4} w="full">
                    <HStack spacing={2} justify="center">
                      <PinInput
                        value={otp}
                        onChange={setOtp}
                        size="lg"
                        placeholder="0"
                      >
                        <PinInputField borderRadius="xl" />
                        <PinInputField borderRadius="xl" />
                        <PinInputField borderRadius="xl" />
                        <PinInputField borderRadius="xl" />
                        <PinInputField borderRadius="xl" />
                        <PinInputField borderRadius="xl" />
                      </PinInput>
                    </HStack>

                    <Button
                      onClick={handleOtpSubmit}
                      isLoading={isLoading}
                      loadingText="Verifying..."
                      colorScheme="brand"
                      size="lg"
                      w="full"
                      borderRadius="2xl"
                      isDisabled={otp.length !== 6}
                    >
                      {t('auth.verifyOTP')}
                    </Button>

                    <HStack spacing={2}>
                      <Text fontSize="sm" color="gray.600">
                        Didn't receive the code?
                      </Text>
                      <Button
                        variant="link"
                        colorScheme="brand"
                        fontSize="sm"
                        onClick={() => setStep('phone')}
                      >
                        {t('auth.resendOTP')}
                      </Button>
                    </HStack>
                  </VStack>
                </VStack>
              )}

              {/* Footer */}
              <Text fontSize="xs" color="gray.500" textAlign="center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </MotionBox>
    </Flex>
  )
}
