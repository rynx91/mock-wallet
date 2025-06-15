import LoadingOverlay from '@/components/LoadingOverlay';
import InactivityHandler from '@/contexts/inactivityHandler';
import { LoadingProvider } from '@/contexts/loadingContext';
import { store } from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');

      // Redirect to login if no token and not already on login page
      if (!token && pathname !== '/') {
        router.replace('/');
      }

      // Redirect to home if already logged in and still on login page
      if (token && pathname === '/') {
        router.replace('/home');
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [pathname]);

  if (isCheckingAuth) return null;

  return (
    <Provider store={store}>
      <InactivityHandler>
        <LoadingProvider>
          <Slot />
          <LoadingOverlay />
        </LoadingProvider>
      </InactivityHandler>
    </Provider>
  );
}
