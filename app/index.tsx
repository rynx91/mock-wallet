import { useLoading } from '@/contexts/loadingContext';

import { useLoginMutation } from '@/store/api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

export default function Login() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [login, { isLoading }] = useLoginMutation();

  const validatePhone = (value: string) => {
    if (!value) return 'Phone number is required.';
    if (!/^\d{9,10}$/.test(value)) return 'Invalid Malaysian phone number.';
    return '';
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleLogin = async () => {
    const error = validatePhone(phone);
    setPhoneError(error);
    if (error) return;

    try {
      showLoading();
      await sleep(1000);
      const response = await login({ phone, pin }).unwrap();
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('userPhone', phone);
      router.replace('/transfer');
    } catch (e: any) {
      Alert.alert('Login Failed', e?.data?.message || 'Invalid login.');
    } finally {
      hideLoading();
    }
  };

  const isFormValid = validatePhone(phone) === '' && pin.length === 6;

  return (
    <View style={styles.container}>
      {/* Brand Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>R</Text>
        </View>
        <Text style={styles.logoLabel}>-bank</Text>
      </View>

      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.phoneContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.countryCodeText}>+60</Text>
        </View>
        <TextInput
          style={styles.phoneInput}
          keyboardType="numeric"
          placeholder="Enter phone number"
          value={phone}
          onChangeText={(text) => {
            setPhone(text.replace(/\D/g, ''));
            setPhoneError('');
          }}
          maxLength={10}
        />
      </View>
      {phoneError ? <Text style={styles.error}>{phoneError}</Text> : null}

      <Text style={styles.label}>PIN</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter 6-digit PIN"
        value={pin}
        onChangeText={setPin}
        maxLength={6}
        secureTextEntry
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={!isFormValid || isLoading}
        style={[
          styles.buttonSecondary,
          { opacity: !isFormValid || isLoading ? 0.6 : 1 },
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color="#0047AB" />
        ) : (
          <Text style={styles.secondaryButtonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0047AB',
    padding: SPACING.l,
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.l,
  },
  logoCircle: {
    backgroundColor: '#fff',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0047AB',
  },
  logoLabel: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: SPACING.l,
    textAlign: 'center',
    color: '#fff',
  },
  label: {
    fontSize: FONT_SIZE.body,
    marginBottom: 4,
    color: '#eee',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  countryCode: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  countryCodeText: {
    fontSize: FONT_SIZE.body,
    color: COLORS.text,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: FONT_SIZE.body,
    color: COLORS.text,
    backgroundColor: '#fff',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.l,
    paddingVertical: 12,
    fontSize: FONT_SIZE.body,
    color: '#fff',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: SPACING.m,
  },
  buttonSecondary: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    color: '#0047AB',
    fontSize: FONT_SIZE.body,
    fontWeight: '600',
  },
});
