import HeaderBackButton from '@/components/HeaderBackButton';
import { COLORS, FONT_SIZE, SPACING } from '@/constants/theme';
import { useGetBankListQuery } from '@/store/api/transferApi';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const getBankStyle = (bank: { style?: any }) => {
  return {
    bg: bank.style?.bg || COLORS.inputBg,
    text: bank.style?.text || COLORS.text,
    border: bank.style?.border,
  };
};

export default function BankSelect() {
  const { data: banks = [] } = useGetBankListQuery();
  const router = useRouter();
  const params = useLocalSearchParams();
  const selected = params.selected as string;

  const handleSelect = (bank: { name: string; code: string }) => {
    router.back();
    setTimeout(() => {
      router.setParams({ selectedBank: JSON.stringify(bank) });
    }, 10);
  };

  const renderItem = ({ item }: { item: { name: string; code: string; style?: any } }) => {
    const { bg, text, border } = getBankStyle(item);
    return (
      <Pressable style={styles.item} onPress={() => handleSelect(item)}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: bg,
              borderColor: border || 'transparent',
              borderWidth: border ? 1 : 0,
            },
          ]}
        >
          <Text style={{ color: text, fontWeight: 'bold' }}>{item.name[0]}</Text>
        </View>
        <Text style={styles.bankText}>{item.name}</Text>
        {item.code === selected && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <HeaderBackButton />
        <Text style={styles.header}>Select a Bank</Text>
        <FlatList
          data={banks}
          keyExtractor={(item) => item.code}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.l
  },
  wrapper: {
    flex: 1,
    paddingVertical: SPACING.l,
    paddingHorizontal: SPACING.l,
  },
  header: {
    fontSize: FONT_SIZE.title,
    fontWeight: 'bold',
    marginTop: SPACING.l,
    marginBottom: SPACING.m,
    color: COLORS.text,
  },
  listContent: {
    paddingBottom: SPACING.l,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  bankText: {
    fontSize: FONT_SIZE.body,
    flex: 1,
    color: COLORS.text,
  },
  checkmark: {
    fontSize: FONT_SIZE.body,
    color: COLORS.primary,
  },
});
