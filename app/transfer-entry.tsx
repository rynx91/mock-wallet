import HeaderBackButton from '@/components/HeaderBackButton';
import { AccountDetails } from '@/model/transfer.type';
import { useGetFavouriteTransfersQuery, useGetRecentTransfersQuery } from '@/store/api/transferApi';
import { clearTransferDetails, setTransferDetails } from '@/store/transferSlice';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

export default function TransferEntry() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: recents = [] } = useGetRecentTransfersQuery();
  const { data: favourites = [] } = useGetFavouriteTransfersQuery();
  const [selectedTab, setSelectedTab] = useState<'favourites' | 'recents'>('favourites');

  useEffect(() => {
    dispatch(clearTransferDetails());
  }, []);

  const handleSelect = (item: AccountDetails) => {
    const selectedBank = {
      code: item.bankCode || '',
      name: item.bankName || '',
      accountLength: 0
    };
    dispatch(
      setTransferDetails({
        referenceId: '',
        accountNumber: item.accountNumber || item.phone || '',
        name: item.name,
        amount: '',
        note: '',
        dateTime: new Date().toISOString(),
        method: item.type,
        bank: selectedBank,
      })
    );
    router.push('/transfer');
  };

  const renderEmptyState = (label: string) => (
    <View style={styles.emptyState}>
      <MaterialIcons name="history" size={48} color={COLORS.border} />
      <Text style={styles.emptyText}>No {label} transfers found.</Text>
    </View>
  );

  const dataToRender = selectedTab === 'favourites' ? favourites : recents;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={styles.container}>
            {/* Back Button */}
            <HeaderBackButton />

            <Text style={styles.title}>Transfer Options</Text>

            {/* Transfer Options */}
            <View style={styles.optionContainer}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push('/transfer')}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name="card-outline" size={24} color="#fff" />
                </View>
                <Text style={styles.optionLabel}>Bank Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push('/transfer')}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name="call-outline" size={24} color="#fff" />
                </View>
                <Text style={styles.optionLabel}>Mobile Number</Text>
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === 'favourites' && styles.activeTab,
                ]}
                onPress={() => setSelectedTab('favourites')}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === 'favourites' && styles.activeTabText,
                  ]}
                >
                  Favourites
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === 'recents' && styles.activeTab,
                ]}
                onPress={() => setSelectedTab('recents')}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === 'recents' && styles.activeTabText,
                  ]}
                >
                  Recent
                </Text>
              </TouchableOpacity>
            </View>

            {/* List or Empty State */}
            {dataToRender.length === 0
              ? renderEmptyState(selectedTab)
              : dataToRender.map((item: AccountDetails, index: number) => (
                  <TouchableOpacity
                    key={`${item.accountNumber || item.phone}-${index}`}
                    onPress={() => handleSelect(item)}
                    style={styles.item}
                  >
                    <Text style={styles.itemText}>{item.name}</Text>
                    {item.type === 'account' ? (
                      <Text style={styles.subText}>
                        {item.bankName} • {item.accountNumber}
                      </Text>
                    ) : (
                      <Text style={styles.subText}>{item.phone}</Text>
                    )}
                  </TouchableOpacity>
                ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.l,
  },
  flex: { flex: 1 },
  container: {
    padding: SPACING.l,
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.l,
  },
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: 'bold',
    marginBottom: SPACING.l,
    color: COLORS.text,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.l,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  optionLabel: {
    fontSize: FONT_SIZE.body,
    color: COLORS.text,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.m,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.s,
  },
  tabText: {
    fontSize: FONT_SIZE.body,
    color: COLORS.text,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: COLORS.primary,
  },
  activeTabText: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  item: {
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  itemText: {
    fontSize: FONT_SIZE.subTitle,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subText: {
    fontSize: FONT_SIZE.body,
    color: COLORS.text,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: SPACING.l,
  },
  emptyText: {
    color: COLORS.text,
    marginTop: 8,
    fontSize: FONT_SIZE.body,
  },
});
