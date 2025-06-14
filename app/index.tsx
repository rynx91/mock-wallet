import { COLORS, FONT_SIZE, SPACING } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Transfer() {
  const router = useRouter();
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [balance] = useState(1000);

  const validateForm = (accountNumber: string, amount: string) => {
    if(!accountNumber || !amount) {
        return false;
    }
    else return true;
  }

  const handleTransfer = async () => {
    if(Number(amount) >= 999) {
        router.replace('/payment-failed');
    }
    router.replace('/payment-success');
  };

  const isFormValid = validateForm(accountNumber, amount);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Title Header */}
          <Text style={styles.screenTitle}>Payment Transfer</Text>

          {/* Account Number */}
          <Text style={styles.label}>Account Number</Text>
          <TextInput
            style={[styles.input, styles.inputBold]}
            value={accountNumber}
            onChangeText={(text) => {
              if (/^\d*$/.test(text)) setAccountNumber(text);
            }}
            placeholder="Enter account number"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={12}
          />

          {/* Amount */}
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, styles.inputBold]}
            value={amount}
            onChangeText={(text) => {
              if (/^\d*\.?\d{0,2}$/.test(text)) setAmount(text);
            }}
            placeholder="0.00"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          <Text style={styles.balance}>Balance: RM {balance.toFixed(2)}</Text>

          {/* Note */}
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="e.g. Rent payment"
            placeholderTextColor="#999"
            maxLength={50}
          />
        </View>

        {/* Continue Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleTransfer}
            disabled={!isFormValid}
            style={[
              styles.button,
              { backgroundColor: isFormValid ? COLORS.primary : '#ccc' },
            ]}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: { flex: 1 },
  container: {
    flex: 1,
    padding: SPACING.l,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: SPACING.l,
    color: COLORS.text,
  },
  label: {
    marginTop: SPACING.l,
    marginBottom: SPACING.s,
    fontSize: FONT_SIZE.body,
    color: '#666',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    fontSize: FONT_SIZE.body,
    color: COLORS.text,
  },
  inputBold: {
    fontSize: 20,
    fontWeight: '600',
  },
  balance: {
    marginTop: SPACING.s,
    fontSize: FONT_SIZE.body,
    fontWeight: '500',
    color: COLORS.success,
  },
  footer: {
    padding: SPACING.l,
    backgroundColor: COLORS.background,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: FONT_SIZE.body,
    fontWeight: '600',
  },
});
