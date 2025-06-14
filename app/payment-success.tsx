import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

const PaymentSuccess = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={100} color={COLORS.primary} style={styles.icon} />
      <Text style={styles.title}>Transfer Successful</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Reference ID: </Text>
        <Text style={styles.value}>xxxxx</Text>
      </View>

        <View style={styles.infoRow}>
            <Text style={styles.label}>Date & Time: </Text>
            <Text style={styles.value}>xxxxxx</Text>
        </View>

    </View>
  );
};

export default PaymentSuccess;

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
    marginBottom: SPACING.l,
    color: COLORS.text,
  },
  label: {
    fontSize: FONT_SIZE.body,
    color: '#666',
  },
  value: {
    fontSize: FONT_SIZE.body,
    fontWeight: '500',
    color: COLORS.text,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: SPACING.m,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
