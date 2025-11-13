import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Snackbar,
  SegmentedButtons,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'COMPANY'>('ADMIN');

  const { login } = useAuth();

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    try {
      // Store the selected role
      await AsyncStorage.setItem('selected_role', role);
      
      // Mock OTP sending - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsOtpSent(true);
    } catch (error) {
      setError('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      await login(phone, otp);
      navigation.replace('Home');
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🌊</Text>
          <Title style={styles.title}>Blue Carbon Registry</Title>
          <Paragraph style={styles.subtitle}>
            Field Data Collection for Coastal Restoration
          </Paragraph>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Login</Title>
            
            {/* Role Selection */}
            <View style={styles.roleContainer}>
              <Paragraph style={styles.roleLabel}>Login as:</Paragraph>
              <SegmentedButtons
                value={role}
                onValueChange={(value: 'ADMIN' | 'COMPANY') => setRole(value)}
                buttons={[
                  {
                    value: 'ADMIN',
                    label: 'Admin',
                    icon: 'shield-account',
                  },
                  {
                    value: 'COMPANY',
                    label: 'Company',
                    icon: 'briefcase',
                  },
                ]}
                style={styles.segmentedButtons}
              />
            </View>
            
            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              disabled={isOtpSent}
              placeholder="+91-9876543210"
            />

            {isOtpSent && (
              <TextInput
                label="OTP"
                value={otp}
                onChangeText={setOtp}
                mode="outlined"
                keyboardType="number-pad"
                style={styles.input}
                placeholder="Enter 6-digit OTP"
              />
            )}

            <Button
              mode="contained"
              onPress={isOtpSent ? handleLogin : handleSendOtp}
              style={styles.button}
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : isOtpSent ? (
                'Login'
              ) : (
                'Send OTP'
              )}
            </Button>

            {isOtpSent && (
              <Button
                mode="text"
                onPress={() => {
                  setIsOtpSent(false);
                  setOtp('');
                }}
                style={styles.resendButton}
              >
                Resend OTP
              </Button>
            )}
          </Card.Content>
        </Card>

        <View style={styles.infoContainer}>
          <Paragraph style={styles.infoText}>
            This app helps field collectors submit restoration data for blue carbon projects.
            All data is securely stored on the blockchain for transparency and verification.
          </Paragraph>
        </View>
      </ScrollView>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={4000}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#2E7D32',
  },
  roleContainer: {
    marginBottom: 20,
  },
  roleLabel: {
    marginBottom: 10,
    fontWeight: '500',
    color: '#333',
  },
  segmentedButtons: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  resendButton: {
    marginTop: 8,
  },
  infoContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
  },
  infoText: {
    textAlign: 'center',
    color: '#2E7D32',
    lineHeight: 20,
  },
});
