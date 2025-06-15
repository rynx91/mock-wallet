import { useLoading } from '@/contexts/loadingContext';
import { useLogout } from '@/hooks/useLogout';
import { useGetAccountInfoQuery } from '@/store/api/accountApi';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { FONT_SIZE, SPACING } from '../constants/theme';

export default function Home() {
  const logout = useLogout();
  const dispatch = useDispatch();
  const [showBalance, setShowBalance] = useState(true);
  const { showLoading, hideLoading } = useLoading();
  const router = useRouter();
  const { data: accountInfo } = useGetAccountInfoQuery();

  const confirmLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) logout();
    } else {
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: logout },
        ]
      );
    }
  };

  const actions = useMemo(() => [
    {
      icon: 'add-circle',
      label: 'Add Money',
      onPress: () =>
        Alert.alert('Feature Not Available', 'This feature is currently not available.'),
    },
    {
      icon: 'qr-code',
      label: 'Scan QR',
      onPress: () =>
        Alert.alert('Feature Not Available', 'This feature is currently not available.'),
    },
    {
      icon: 'send',
      label: 'Send Money',
      onPress: () => router.push('/transfer-entry'),
    },
  ], [router]);
  
  const getFirstOfMonth = () => {
    const now = new Date();
    return `since ${now.toLocaleString('default', {
      month: 'short',
    })} 1`;
  };

  const insights = useMemo(() => [
    {
      icon: 'trending-up',
      label: 'Interest earned',
      value: `RM ${accountInfo?.interestEarned.toFixed(2) ?? '0.00'}`,
    },
    {
      icon: 'download',
      label: 'You received',
      value: `RM ${accountInfo?.received.toFixed(2) ?? '0.00'} ${getFirstOfMonth()}`,
    },
    {
      icon: 'arrow-up',
      label: 'You spent',
      value: `RM ${accountInfo?.spent.toFixed(2) ?? '0.00'} ${getFirstOfMonth()}`,
    },
  ], [accountInfo]);
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <TouchableOpacity onPress={confirmLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>
            RM{' '}
            {showBalance
              ? accountInfo?.balance?.toLocaleString('en-MY', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) ?? '0.00'
              : '******'}
          </Text>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Ionicons
              name={showBalance ? 'eye-off' : 'eye'}
              size={24}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Actions Row */}
      <View style={styles.actionsContainer}>
        {actions.map((item, index) => (
          <View key={index} style={styles.actionItem}>
            <TouchableOpacity
              style={styles.actionIconCircle}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon as any} size={28} color="#0047AB" />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Insights Section */}
      <View style={styles.insightsContainer}>
        {insights.map((item, index) => (
          <View key={index} style={styles.insightItem}>
            <Ionicons
              name={item.icon as any}
              size={20}
              color="#0047AB"
              style={{ marginRight: 10 }}
            />
            <View>
              <Text style={styles.insightLabel}>{item.label}</Text>
              <Text style={styles.insightValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: SPACING.l,
    backgroundColor: '#0047AB',
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  welcomeText: {
    color: '#fff',
    fontSize: FONT_SIZE.body,
    fontWeight: '500',
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: FONT_SIZE.body,
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIconCircle: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 16,
    marginBottom: 6,
  },
  actionLabel: {
    color: '#fff',
    fontSize: FONT_SIZE.body,
  },
  insightsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: SPACING.l,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  insightLabel: {
    color: '#666',
    fontSize: FONT_SIZE.body,
  },
  insightValue: {
    fontWeight: 'bold',
    color: '#000',
  },
});
