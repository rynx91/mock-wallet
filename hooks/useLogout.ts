import { useLoading } from '@/contexts/loadingContext';
import { resetAccount } from '@/store/accountSlice';
import { accountApi } from '@/store/api/accountApi';
import { authApi } from '@/store/api/authApi';
import { transferApi } from '@/store/api/transferApi';
import { resetFavourite } from '@/store/favouriteSlice';
import { resetRecentTransfers } from '@/store/recentTransferSlice';
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

      // clear storage
      await AsyncStorage.multiRemove(['authToken', 'syncedContacts', 'biometricChecked']);

      // reset RTK Query cache
      dispatch(authApi.util.resetApiState());
      dispatch(transferApi.util.resetApiState());
      dispatch(accountApi.util.resetApiState());

      // reset manual slices
      dispatch(resetAccount());
      dispatch(resetFavourite());
      dispatch(resetRecentTransfers());

      // navigate
      router.replace('/');
    } finally {
      hideLoading();
    }
  };

  return logout;
};
