import HeaderBackButton from '@/components/HeaderBackButton';
import { COLORS, FONT_SIZE, SPACING } from '@/constants/theme';
import { RootState } from '@/store';
import { useGetBankListQuery, useGetFavouriteTransfersQuery } from '@/store/api/transferApi';
import { setTransferDetails } from '@/store/transferSlice';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const getBankStyle = (name: string) => {
  if (name.toLowerCase().includes('maybank')) return { backgroundColor: '#FFD700', color: '#000' };
  if (name.toLowerCase().includes('cimb')) return { backgroundColor: '#D32F2F', color: '#fff' };
  if (name.toLowerCase().includes('public')) return { backgroundColor: '#fff', color: '#D32F2F' };
  return { backgroundColor: '#ccc', color: '#000' };
};

export default function TransferAccount() {
  const dispatch = useDispatch();
  const { data: banks = [] } = useGetBankListQuery();
  const { data: favourites = [] } = useGetFavouriteTransfersQuery();
  const router = useRouter();

  const saved = useSelector((state: RootState) => state.transfer);

  const [accountNumber, setAccountNumber] = useState(saved.accountNumber || '');
  const [selectedBank, setSelectedBank] = useState(saved.bank || null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (selectedBank && accountNumber.length === selectedBank.accountLength) {
      const fav = favourites.find(
        (fav: { accountNumber: string; bank: string; }) => fav.accountNumber === accountNumber && fav.bank === selectedBank.name
      );
      setIsFavourite(!!fav);
    } else {
      setIsFavourite(false);
    }
  }, [accountNumber, selectedBank, favourites]);

  const accountValid = selectedBank
    ? accountNumber.length === selectedBank.accountLength
    : false;
  const isFormValid = selectedBank && accountValid;

  const handleNext = () => {
    if(selectedBank && isFormValid) {
      const fav = favourites.find((f: { accountNumber: string; bank: string; }) =>
        f.accountNumber === accountNumber && f.bank === selectedBank.name
      );
      const recipientName = fav?.name || 'John Doe';
      dispatch(
        setTransferDetails({
          referenceId: '',
          accountNumber,
          name: recipientName,
          amount: '',
          note: '',
          dateTime: new Date().toISOString(),
          method: 'account',
          bank: selectedBank,
        })
      );
      router.push('/transfer');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
         <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={styles.container}>
            <HeaderBackButton />
            <Text style={styles.title}>Transfer via Account</Text>

            <Text style={styles.label}>Select Bank</Text>
            <TouchableOpacity style={styles.dropdownBox} onPress={() => setModalVisible(true)}>
              <Text style={styles.dropdownText}>{selectedBank?.name || '-- Select Bank --'}</Text>
              <Text style={styles.dropdownChevron}>▼</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Account Number</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                keyboardType="numeric"
                value={accountNumber}
                onChangeText={(text) => setAccountNumber(text.replace(/\D/g, ''))}
                placeholder="Enter account number"
                placeholderTextColor="#999"
                maxLength={selectedBank?.accountLength || 12}
              />
              {selectedBank && accountValid && (
                <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)}>
                  <Text style={{ fontSize: 20, marginLeft: 12, color: isFavourite ? COLORS.primary : '#ccc'}}>
                    {isFavourite ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {selectedBank && !accountValid && accountNumber.length > 0 && (
              <Text style={{ color: 'red', marginTop: 8 }}>
                Account number must be {selectedBank.accountLength} digits
              </Text>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, !isFormValid && { backgroundColor: '#ccc' }]}
              onPress={handleNext}
              disabled={!isFormValid}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
         </View>
      </KeyboardAvoidingView>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalWrapper}>
          <SafeAreaView style={styles.modalSafe}>
            <HeaderBackButton onPress={() => setModalVisible(false)} />
            <Text style={styles.modalTitle}>Select Bank</Text>
            <FlatList
              data={banks}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const bankStyle = getBankStyle(item.name);
                return (
                  <TouchableOpacity
                    style={styles.bankItem}
                    onPress={() => {
                      setSelectedBank(item);
                      setModalVisible(false);
                    }}
                  >
                    <View
                      style={[styles.bankIcon, { backgroundColor: bankStyle.backgroundColor }]}
                    >
                      <Text style={{ color: bankStyle.color, fontWeight: 'bold' }}>
                        {item.name[0].toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.bankName}>{item.name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    padding: SPACING.l,
    backgroundColor: COLORS.background,
  },
  modalSafe: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.l
  },
  flex: { flex: 1 },
  container: {
    flex: 1,
    padding: SPACING.l,
  },
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: 'bold',
    marginBottom: SPACING.l,
    color: COLORS.text,
  },
  label: {
    fontSize: FONT_SIZE.body,
    marginBottom: SPACING.s,
    color: COLORS.text,
  },
  dropdownBox: {
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
  },
  dropdownText: {
    fontSize: FONT_SIZE.body,
    color: COLORS.text,
  },
  dropdownChevron: {
    fontSize: 16,
    color: '#999',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    fontSize: FONT_SIZE.body,
    color: COLORS.text,
  },
  footer: {
    padding: SPACING.l,
    backgroundColor: COLORS.background,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: FONT_SIZE.body,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: 'bold',
    marginBottom: SPACING.l,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  bankIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  bankName: {
    fontSize: FONT_SIZE.body,
    color: COLORS.text,
  },
});
