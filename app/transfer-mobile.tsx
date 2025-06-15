import HeaderBackButton from '@/components/HeaderBackButton';
import { COLORS, FONT_SIZE, SPACING } from '@/constants/theme';
import useContacts from '@/hooks/useContacts';
import { RootState } from '@/store';
import { useGetFavouriteTransfersQuery } from '@/store/api/transferApi';
import { setTransferDetails } from '@/store/transferSlice';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

type ContactItem = {
  id: string;
  name: string;
  phone: string;
};

export default function TransferMobile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: favourites = [] } = useGetFavouriteTransfersQuery();
  const saved = useSelector((state: RootState) => state.transfer);

  const [phone, setPhone] = useState(saved?.accountNumber || '');
  const [name, setName] = useState(saved?.name || '');
  const [isFavourite, setIsFavourite] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const {
    contactList,
    filteredContacts,
    search,
    syncContacts,
    handleSearch
  } = useContacts();

  const phoneError =
    !phoneTouched || phone.length === 0
      ? ''
      : !/^01\d{8,9}$/.test(phone)
      ? 'Invalid mobile number format.'
      : '';

  useEffect(() => {
    if (phone && /^01\d{8,9}$/.test(phone)) {
      const fav = favourites.find((fav: { phone: string }) => fav.phone === phone);
      setIsFavourite(!!fav);
      if (fav) setName(fav.name);
    } else {
      setIsFavourite(false);
      setName('');
    }
  }, [phone, favourites]);

  const handleSelectContact = (contact: ContactItem) => {
    setPhone(contact.phone);
    setName(contact.name);
  };

  const isValid = phoneError === '' && phone.length > 0;

  const handleNext = () => {
    dispatch(
      setTransferDetails({
        referenceId: '',
        accountNumber: phone,
        amount: '',
        note: '',
        dateTime: new Date().toISOString(),
        method: 'mobile',
        name,
      })
    );
    router.push('/transfer');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <HeaderBackButton />
          <Text style={styles.title}>Transfer via Mobile</Text>

          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.phoneContainer}>
            <TextInput
              style={styles.phoneInput}
              keyboardType="numeric"
              value={phone}
              placeholder="Enter mobile number"
              maxLength={11}
              onChangeText={(text) => {
                setPhoneTouched(true);
                setPhone(text.replace(/\D/g, ''));
                setName('John Doe')
              }}
            />
            {isValid && (
              <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)}>
                <Text style={[styles.favIcon, { color: isFavourite ? COLORS.primary : '#ccc' }]}>
                  {isFavourite ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {!!phoneError && <Text style={styles.error}>{phoneError}</Text>}

          {contactList.length === 0 && (
            <TouchableOpacity style={styles.syncButton} onPress={syncContacts}>
              <Text style={styles.syncText}>Sync Contacts</Text>
            </TouchableOpacity>
          )}

          {contactList.length > 0 && (
            <>
              <TextInput
                style={styles.searchInput}
                placeholder="Search contacts"
                value={search}
                onChangeText={handleSearch}
              />
              <FlatList
                data={filteredContacts}
                keyExtractor={(item, index) => item.id+'_'+index}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectContact(item)}
                    style={styles.contactItem}
                  >
                    <Text style={styles.contactName}>{item.name}</Text>
                    <Text style={styles.contactPhone}>{item.phone}</Text>
                  </TouchableOpacity>
                )}
              />
            </>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, !isValid && { backgroundColor: '#ccc' }]}
            onPress={handleNext}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Next</Text>
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
    paddingVertical: SPACING.l
  },
  flex: { flex: 1 },
  container: {
    padding: SPACING.l,
    paddingBottom: 0,
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: 'bold',
    marginBottom: SPACING.l,
  },
  label: {
    fontSize: FONT_SIZE.body,
    marginBottom: SPACING.s,
    color: COLORS.text,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: FONT_SIZE.body,
    color: COLORS.text,
    backgroundColor: '#fff',
  },
  favIcon: {
    fontSize: 24,
    paddingLeft: 12,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
  syncButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  syncText: {
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: FONT_SIZE.body,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: SPACING.s,
    fontSize: FONT_SIZE.body,
  },
  contactItem: {
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  contactName: {
    fontSize: FONT_SIZE.body,
    fontWeight: '500',
  },
  contactPhone: {
    fontSize: FONT_SIZE.body,
    color: '#666',
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
    marginBottom: SPACING.s,
  },
  buttonText: {
    color: '#fff',
    fontSize: FONT_SIZE.body,
    fontWeight: '600',
  },
});
