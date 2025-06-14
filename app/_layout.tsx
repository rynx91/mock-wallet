import LoadingOverlay from '@/components/LoadingOverlay';
import { LoadingProvider } from '@/contexts/loadingContext';
import { store } from '@/store';
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';

export default function RootLayout() {
  return (
    <Provider store={store}>
        <LoadingProvider>
          <Slot />
          <LoadingOverlay />
        </LoadingProvider>
    </Provider>
  );
}
