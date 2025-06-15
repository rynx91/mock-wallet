import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type Props = {
  onPress?: () => void;
};

export default function HeaderBackButton({ onPress }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={onPress || router.back}
      style={{ paddingVertical: 8 }}
    >
      <Icon name="chevron-left" size={24} />
    </TouchableOpacity>
  );
}
