import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

const PaymentFailed = () => {
  const router = useRouter();
  const { message } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Ionicons name="close-circle" size={100} color="red" style={styles.icon} />
      <Text style={styles.title}>Transfer Failed</Text>
      {message ? (
        <Text style={styles.subtitle}>{message}</Text>
      ) : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => router.replace('/')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentFailed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.l,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  icon: {
    marginBottom: SPACING.l,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: SPACING.l,
    width: '100%',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: SPACING.m,
  },
  buttonText: {
    color: '#fff',
    fontSize: FONT_SIZE.body,
    fontWeight: '600',
  },
});
