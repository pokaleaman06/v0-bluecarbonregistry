import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import { StatusBar } from 'expo-status-bar';

import { theme } from './src/theme';
import { AuthProvider } from './src/contexts/AuthContext';
import { LocationProvider } from './src/contexts/LocationContext';
import { CameraProvider } from './src/contexts/CameraContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProjectListScreen from './src/screens/ProjectListScreen';
import ProjectDetailScreen from './src/screens/ProjectDetailScreen';
import FieldDataEntryScreen from './src/screens/FieldDataEntryScreen';
import CameraScreen from './src/screens/CameraScreen';
import MapScreen from './src/screens/MapScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <LocationProvider>
            <CameraProvider>
              <NavigationContainer>
                <StatusBar style="auto" />
                <Stack.Navigator
                  initialRouteName="Login"
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: theme.colors.primary,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                  }}
                >
                  <Stack.Screen 
                    name="Login" 
                    component={LoginScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen 
                    name="Home" 
                    component={HomeScreen}
                    options={{ title: 'Blue Carbon Registry' }}
                  />
                  <Stack.Screen 
                    name="ProjectList" 
                    component={ProjectListScreen}
                    options={{ title: 'My Projects' }}
                  />
                  <Stack.Screen 
                    name="ProjectDetail" 
                    component={ProjectDetailScreen}
                    options={{ title: 'Project Details' }}
                  />
                  <Stack.Screen 
                    name="FieldDataEntry" 
                    component={FieldDataEntryScreen}
                    options={{ title: 'Field Data Entry' }}
                  />
                  <Stack.Screen 
                    name="Camera" 
                    component={CameraScreen}
                    options={{ title: 'Take Photo' }}
                  />
                  <Stack.Screen 
                    name="Map" 
                    component={MapScreen}
                    options={{ title: 'Select Location' }}
                  />
                  <Stack.Screen 
                    name="Profile" 
                    component={ProfileScreen}
                    options={{ title: 'Profile' }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </CameraProvider>
          </LocationProvider>
        </AuthProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
