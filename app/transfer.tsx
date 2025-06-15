import HeaderBackButton from '@/components/HeaderBackButton';
import { useLoading } from '@/contexts/loadingContext';
import { RootState } from '@/store';
import { deductBalance } from '@/store/accountSlice';
import { useProcessTransactionMutation } from '@/store/api/transferApi';
import { addRecentTransfer } from '@/store/recentTransferSlice';
import { setTransferDetails } from '@/store/transferSlice';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

export default function Transfer() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { method, bank, name, accountNumber } = useSelector(
    (state: RootState) => state.transfer
  );
  const { showLoading, hideLoading } = useLoading();
  const [processTransaction] = useProcessTransactionMutation();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [amountError, setAmountError] = useState('');
  const [hasTouchedAmount, setHasTouchedAmount] = useState(false);
  const [rawAmount, setRawAmount] = useState('');
  const accountInfo = useSelector((state: RootState) => state.account);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (accountInfo?.balance != null) {
      setBalance(accountInfo.balance);
    }
  }, [accountInfo]);

  useEffect(() => {
    const formatted = formatAmount(rawAmount);
    setAmount(formatted);
    setAmountError(validateAmount(formatted));
  }, [rawAmount]);

  useEffect(() => {
    setAmountError(validateAmount(amount));
  }, [amount]);

  const validateAmount = (value: string) => {
    const number = parseFloat(value);
    if (!value) return 'Amount is required.';
    if (isNaN(number) || number <= 0) return 'Amount must be greater than 0.';
    if (number > balance) return 'Amount exceeds available balance.';
    return '';
  };

  const formatAmount = (val: string) => {
    const number = parseInt(val || '0', 10);
    return (number / 100).toFixed(2);
  };

  const handleTransfer = async () => {
    const amtError = validateAmount(amount);
    setAmountError(amtError);
    setHasTouchedAmount(true);
    if (amtError) return;

    showLoading();

    try {
      const isAvailable = await LocalAuthentication.hasHardwareAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (!isAvailable || supportedTypes.length === 0) {
        Alert.alert('Biometric not available', 'This device does not support Face ID or fingerprint.');
        hideLoading();
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to complete transfer',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (!result.success) {
        router.replace({ pathname: '/payment-failed', params: { message: 'Authentication failed' } });
        return;
      }

      const generatedRefId = `REF${Date.now()}`;
      const res = await processTransaction({
        amount: parseFloat(amount),
        accountNumber,
      }).unwrap();

      dispatch(
        setTransferDetails({
          referenceId: generatedRefId,
          accountNumber,
          name,
          amount,
          note,
          dateTime: new Date().toLocaleString(),
          method: method,
          bank: bank,
        })
      );
      dispatch(deductBalance(parseFloat(amount)));
      dispatch(
        addRecentTransfer({
          name,
          type: method === 'mobile' ? 'mobile' : 'account',
          phone: method === 'mobile' ? accountNumber : undefined,
          accountNumber: method === 'account' ? accountNumber : undefined,
          bankCode: bank?.code,
          bankName: bank?.name,
        })
      );

      router.replace('/payment-success');
    } catch (apiError: any) {
      router.replace({
        pathname: '/payment-failed',
        params: { message: apiError?.data?.message || 'Transaction failed' },
      });
    } finally {
      hideLoading();
    }
  };

  const isFormValid = !validateAmount(amount);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <HeaderBackButton />
          <Text style={styles.screenTitle}>Payment Transfer</Text>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: FONT_SIZE.body, color: COLORS.text }}>Recipient</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.text }}>{name}</Text>
            {method === 'account' ? (
              <Text style={{ fontSize: 18, color: COLORS.text }}>
                {bank?.name} • {accountNumber}
              </Text>
            ) : (
              <Text style={{ fontSize: 18, color: COLORS.text }}>{accountNumber}</Text>
            )}
          </View>

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, styles.inputBold]}
            value={formatAmount(rawAmount)}
            onChangeText={(text) => {
              const digits = text.replace(/\D/g, '');
              if (digits.length <= 9) setRawAmount(digits);
            }}
            onFocus={() => setHasTouchedAmount(true)}
            placeholder="0.00"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          <Text style={styles.balance}>
            Balance: RM{' '}
            {balance?.toLocaleString('en-MY', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) ?? '0.00'}
          </Text>
          {hasTouchedAmount && amountError ? (
            <Text style={styles.error}>{amountError}</Text>
          ) : null}

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
