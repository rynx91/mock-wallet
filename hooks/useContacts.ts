import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Contacts from 'expo-contacts';
import { useEffect, useState } from 'react';

export type ContactItem = {
  id: string;
  name: string;
  phone: string;
};

export default function useContacts() {
  const [contactList, setContactList] = useState<ContactItem[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadContacts = async () => {
      const stored = await AsyncStorage.getItem('syncedContacts');
      if (stored) {
        const parsed = JSON.parse(stored) as ContactItem[];
        setContactList(parsed);
        setFilteredContacts(parsed);
      }
    };
    loadContacts();
  }, []);

  // Normalize phone to local format (01xxxxxxxxx)
  const normalizePhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('60') && digits.length >= 10) {
      return '0' + digits.slice(2);
    } else if (digits.startsWith('0')) {
      return digits;
    }
    return ''; // ignore invalid
  };

  const syncContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access contacts was denied.');
      return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    const seen = new Set<string>();
    const contacts: ContactItem[] = [];

    data.forEach((contact) => {
      (contact.phoneNumbers || []).forEach((p) => {
        const raw = p.number || '';
        const phone = normalizePhone(raw);

        // Only keep local Malaysian mobile numbers that start with 01
        if (phone && !seen.has(phone) && /^01\d{8,9}$/.test(phone)) {
          seen.add(phone);
          contacts.push({
            id: `${contact.id}-${phone}`,
            name: contact.name || 'Unknown',
            phone,
          });
        }
      });
    });

    setContactList(contacts);
    setFilteredContacts(contacts);
    await AsyncStorage.setItem('syncedContacts', JSON.stringify(contacts));
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    setFilteredContacts(
      contactList.filter((c) =>
        c.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  return {
    contactList,
    filteredContacts,
    search,
    syncContacts,
    handleSearch,
  };
}
