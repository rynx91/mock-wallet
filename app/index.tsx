import { useProcessTransactionMutation } from '@/store/api/transactionApi';
import { setTransferDetails } from '@/store/transferSlice';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

export default function Transfer() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [processTransaction] = useProcessTransactionMutation();
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [balance] = useState(1000);

  const [accountNumberError, setAccountNumberError] = useState('');
  const [amountError, setAmountError] = useState('');

  const [hasTouchedAccountNumber, setHasTouchedAccountNumber] = useState(false);
  const [hasTouchedAmount, setHasTouchedAmount] = useState(false);
  const [rawAmount, setRawAmount] = useState('');

  useEffect(() => {
    const formatted = formatAmount(rawAmount);
    setAmount(formatted);
    setAccountNumberError(validateAccountNumber(accountNumber));
    setAmountError(validateAmount(formatted));
  }, [accountNumber, rawAmount]);

  const validateAccountNumber = (value: string) => {
    if (!value) return 'Account number is required.';
    if (value.length !== 12) return 'Account number must be exactly 12 digits.';
    return '';
  };

  const validateAmount = (value: string) => {
    const number = parseFloat(value);
    if (!value) return 'Amount is required.';
    if (isNaN(number) || number <= 0) return 'Amount must be greater than 0.';
    if (number > balance) return 'Amount exceeds available balance.';
    return '';
  };

  useEffect(() => {
    setAccountNumberError(validateAccountNumber(accountNumber));
    setAmountError(validateAmount(amount));
  }, [accountNumber, amount]);

  const formatAmount = (val: string) => {
    const number = parseInt(val || '0', 10);
    return (number / 100).toFixed(2);
  };

  const handleTransfer = async () => {
    const accError = validateAccountNumber(accountNumber);
    const amtError = validateAmount(amount);
  
    setAccountNumberError(accError);
    setAmountError(amtError);
    setHasTouchedAccountNumber(true);
    setHasTouchedAmount(true);
  
    if (accError || amtError) return;

    try {
      const res = await processTransaction({ amount: parseFloat(amount), accountNumber }).unwrap();
      const generatedRefId = `REF${Date.now()}`;
      dispatch(setTransferDetails({
        referenceId: generatedRefId,
        accountNumber,
        amount,
        note,
        dateTime: new Date().toLocaleString(),
      }));
  
      router.replace('/payment-success');
    } catch (apiError: any) {
      router.replace({ pathname: '/payment-failed', params: { message: apiError?.data?.message || '' } });
    }
  };

  const isFormValid =
    !validateAccountNumber(accountNumber) && !validateAmount(amount);

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
            onFocus={() => setHasTouchedAccountNumber(true)}
            placeholder="Enter account number"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={12}
          />
          {hasTouchedAccountNumber && accountNumberError ? (
            <Text style={styles.error}>{accountNumberError}</Text>
          ) : null}

          {/* Amount */}
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, styles.inputBold]}
            value={amount}
            onChangeText={(text) => {
              if (/^\d*\.?\d{0,2}$/.test(text)) setAmount(text);
            }}
            onFocus={() => setHasTouchedAmount(true)}
            placeholder="0.00"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          <Text style={styles.balance}>Balance: RM {balance.toFixed(2)}</Text>
          {hasTouchedAmount && amountError ? (
            <Text style={styles.error}>{amountError}</Text>
          ) : null}

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
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
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
