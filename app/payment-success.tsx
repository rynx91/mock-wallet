import { RootState } from '@/store';
import { sharePDF } from '@/utils/pdfGenerator';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

const PaymentSuccess = () => {
  const router = useRouter();
  const { referenceId, accountNumber, amount, note, dateTime } = useSelector(
    (state: RootState) => state.transfer
  );

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={100} color={COLORS.primary} style={styles.icon} />
      <Text style={styles.title}>Transfer Successful</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Reference ID: </Text>
        <Text style={styles.value}>{referenceId}</Text>
        </View>

    <View style={styles.infoRow}>
        <Text style={styles.label}>Date & Time: </Text>
        <Text style={styles.value}>{dateTime}</Text>
    </View>


      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() =>
            sharePDF({ referenceId, accountNumber, amount, note, dateTime })
          }
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryText}>Share Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/')}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryText}>Done</Text>
        </TouchableOpacity>
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
  buttons: {
    marginTop: SPACING.l,
    width: '100%',
    gap: SPACING.m,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontSize: FONT_SIZE.body,
    fontWeight: '600',
  },
  secondaryButton: {
    marginTop: SPACING.m,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
  },
  secondaryText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.body,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: SPACING.m,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
