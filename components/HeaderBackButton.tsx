import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

export default function HeaderBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't render on login page
  if (pathname === '/login') return null;

  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
      <Ionicons name="chevron-back" size={24} color={COLORS.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    paddingVertical: SPACING.l,
  },
});
