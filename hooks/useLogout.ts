// hooks/useLogout.ts
import { useLoading } from '@/contexts/loadingContext';
import { accountApi } from '@/store/api/accountApi';
import { authApi } from '@/store/api/authApi';
import { transferApi } from '@/store/api/transferApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showLoading, hideLoading } = useLoading();

  const logout = async () => {
    try {
      showLoading();
      await AsyncStorage.multiRemove(['authToken', 'syncedContacts', 'biometricChecked']);
      dispatch(authApi.util.resetApiState());
      dispatch(transferApi.util.resetApiState());
      dispatch(accountApi.util.resetApiState());
      router.replace('/');
    } finally {
      hideLoading();
    }
  };

  return logout;
};
