import {
  Box,
  Heading,
  Text,
  VStack,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  Button,
  HStack,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  Icon,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FiSave, FiUser, FiBell, FiShield, FiGlobe } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { LANGUAGES } from '../i18n'

const MotionBox = motion(Box)

export function Settings() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const cardBg = useColorModeValue('white', 'gray.800')

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language)
  }

  return (
    <Box>
      <VStack align="start" spacing={6} mb={8}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="xl" color="gray.800">
            {t('navigation.settings')}
          </Heading>
          <Text color="gray.600" fontSize="lg" mt={2}>
            Manage your account and application preferences
          </Text>
        </MotionBox>
      </VStack>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card bg={cardBg} borderRadius="2xl" boxShadow="sm">
          <CardBody>
            <Tabs variant="soft-rounded" colorScheme="brand">
              <TabList mb={6}>
                <Tab>
                  <Icon as={FiUser} mr={2} />
                  Profile
                </Tab>
                <Tab>
                  <Icon as={FiBell} mr={2} />
                  Notifications
                </Tab>
                <Tab>
                  <Icon as={FiGlobe} mr={2} />
                  Language
                </Tab>
                <Tab>
                  <Icon as={FiShield} mr={2} />
                  Privacy
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <VStack spacing={6} align="start">
                    <HStack spacing={4}>
                      <Avatar size="lg" name={user?.name} />
                      <VStack align="start" spacing={1}>
                        <Heading size="md">{user?.name}</Heading>
                        <Text color="gray.600">{user?.email}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {user?.organization} • {user?.role}
                        </Text>
                      </VStack>
                    </HStack>

                    <VStack spacing={4} w="full" maxW="md">
                      <FormControl>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                          defaultValue={user?.name}
                          borderRadius="2xl"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          defaultValue={user?.email}
                          borderRadius="2xl"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Phone</FormLabel>
                        <Input
                          type="tel"
                          defaultValue={user?.phone}
                          borderRadius="2xl"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Organization</FormLabel>
                        <Input
                          defaultValue={user?.organization}
                          borderRadius="2xl"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Region</FormLabel>
                        <Select defaultValue={user?.region} borderRadius="2xl">
                          <option value="west-bengal">West Bengal</option>
                          <option value="kerala">Kerala</option>
                          <option value="gujarat">Gujarat</option>
                          <option value="maharashtra">Maharashtra</option>
                          <option value="tamil-nadu">Tamil Nadu</option>
                        </Select>
                      </FormControl>

                      <Button
                        leftIcon={<Icon as={FiSave} />}
                        colorScheme="brand"
                        borderRadius="2xl"
                        alignSelf="start"
                      >
                        Save Changes
                      </Button>
                    </VStack>
                  </VStack>
                </TabPanel>

                <TabPanel p={0}>
                  <VStack spacing={6} align="start" maxW="md">
                    <Text color="gray.600">
                      Configure your notification preferences
                    </Text>

                    <VStack spacing={4} w="full">
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="email-notifications" mb="0" flex={1}>
                          Email Notifications
                          <Text fontSize="sm" color="gray.500">
                            Receive updates via email
                          </Text>
                        </FormLabel>
                        <Switch id="email-notifications" colorScheme="brand" />
                      </FormControl>

                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="push-notifications" mb="0" flex={1}>
                          Push Notifications
                          <Text fontSize="sm" color="gray.500">
                            Receive push notifications on your device
                          </Text>
                        </FormLabel>
                        <Switch id="push-notifications" colorScheme="brand" />
                      </FormControl>

                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="verification-alerts" mb="0" flex={1}>
                          Verification Alerts
                          <Text fontSize="sm" color="gray.500">
                            Get notified when verifications are completed
                          </Text>
                        </FormLabel>
                        <Switch id="verification-alerts" colorScheme="brand" defaultChecked />
                      </FormControl>

                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="project-updates" mb="0" flex={1}>
                          Project Updates
                          <Text fontSize="sm" color="gray.500">
                            Receive updates about your projects
                          </Text>
                        </FormLabel>
                        <Switch id="project-updates" colorScheme="brand" defaultChecked />
                      </FormControl>
                    </VStack>
                  </VStack>
                </TabPanel>

                <TabPanel p={0}>
                  <VStack spacing={6} align="start" maxW="md">
                    <Text color="gray.600">
                      Choose your preferred language for the application
                    </Text>

                    <FormControl>
                      <FormLabel>Application Language</FormLabel>
                      <Select
                        value={i18n.language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        borderRadius="2xl"
                      >
                        {Object.entries(LANGUAGES).map(([code, name]) => (
                          <option key={code} value={code}>
                            {name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <Button
                      leftIcon={<Icon as={FiSave} />}
                      colorScheme="brand"
                      borderRadius="2xl"
                    >
                      Save Language Preference
                    </Button>
                  </VStack>
                </TabPanel>

                <TabPanel p={0}>
                  <VStack spacing={6} align="start" maxW="md">
                    <Text color="gray.600">
                      Manage your privacy and data sharing preferences
                    </Text>

                    <VStack spacing={4} w="full">
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="data-sharing" mb="0" flex={1}>
                          Data Sharing
                          <Text fontSize="sm" color="gray.500">
                            Allow sharing of anonymized data for research
                          </Text>
                        </FormLabel>
                        <Switch id="data-sharing" colorScheme="brand" />
                      </FormControl>

                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="location-tracking" mb="0" flex={1}>
                          Location Tracking
                          <Text fontSize="sm" color="gray.500">
                            Enable location tracking for field data
                          </Text>
                        </FormLabel>
                        <Switch id="location-tracking" colorScheme="brand" defaultChecked />
                      </FormControl>

                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="analytics" mb="0" flex={1}>
                          Analytics
                          <Text fontSize="sm" color="gray.500">
                            Help improve the app by sharing usage data
                          </Text>
                        </FormLabel>
                        <Switch id="analytics" colorScheme="brand" />
                      </FormControl>
                    </VStack>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </MotionBox>
    </Box>
  )
}
