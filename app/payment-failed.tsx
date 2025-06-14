import { Ionicons } from '@expo/vector-icons';
import { Text } from '@react-navigation/elements';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const PaymentFailed = () => {

  return (
    <View style={styles.container}>
      <Ionicons name="close-circle" size={100} color="red" style={styles.icon} />
      <Text style={styles.title}>Transfer Failed</Text>
    </View>
  );
};

export default PaymentFailed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.l,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  icon: {
    marginBottom: SPACING.l,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
