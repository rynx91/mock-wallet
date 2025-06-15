import { useLogout } from '@/hooks/useLogout';
import { usePathname } from 'expo-router';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  Keyboard,
  Modal,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

type Props = {
  children: ReactNode;
};

const TIMEOUT_DURATION = 5000;
const MODAL_COUNTDOWN = 5;

export default function InactivityHandler({ children }: Props) {
  const pathname = usePathname();
  const timeoutRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(MODAL_COUNTDOWN);
  const logout = useLogout();

  const shouldSkipTimer =
    pathname === '/' ||
    pathname?.includes('login') ||
    pathname?.includes('onboarding') ||
    pathname?.includes('splash');

  const clearAllTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const resetTimer = () => {
    if (shouldSkipTimer) return;
    clearAllTimers();
    timeoutRef.current = setTimeout(() => {
      setCountdown(MODAL_COUNTDOWN);
      setModalVisible(true);
    }, TIMEOUT_DURATION);
  };

  const handleStayLoggedIn = () => {
    setModalVisible(false);
    setCountdown(MODAL_COUNTDOWN);
    resetTimer();
  };

  const handleLogout = () => {
    clearAllTimers();
    setModalVisible(false);
    logout();
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (shouldSkipTimer) return;
    if (nextAppState === 'active') resetTimer();
    else clearAllTimers();
  };

  useEffect(() => {
    if (shouldSkipTimer) return;

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', resetTimer);
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', resetTimer);

    const resetOnTouch = () => resetTimer();

    if (Platform.OS === 'web') {
      [
        'touchstart',
        'mousedown',
        'keydown',
        'mousemove',
        'scroll',
        'wheel',
        'click',
      ].forEach((event) => document.addEventListener(event, resetOnTouch));
    }

    resetTimer();

    return () => {
      clearAllTimers();
      subscription.remove();
      keyboardShowListener.remove();
      keyboardHideListener.remove();
      if (Platform.OS === 'web') {
        [
          'touchstart',
          'mousedown',
          'keydown',
          'mousemove',
          'scroll',
          'wheel',
          'click',
        ].forEach((event) => document.removeEventListener(event, resetOnTouch));
      }
    };
  }, [pathname, shouldSkipTimer]);

  useEffect(() => {
    if (!modalVisible || shouldSkipTimer) return;

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          countdownRef.current = null;
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [modalVisible, shouldSkipTimer]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => {
      resetTimer();
      return false;
    },
    onMoveShouldSetPanResponder: () => {
      resetTimer();
      return false;
    },
    onPanResponderGrant: resetTimer,
    onPanResponderMove: resetTimer,
    onPanResponderTerminationRequest: () => true,
  });

  return (
    <TouchableWithoutFeedback onPress={resetTimer}>
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        {children}
        {modalVisible && !shouldSkipTimer && (
          <Modal visible={modalVisible} transparent animationType="fade">
            <View style={styles.overlay}>
              <View style={styles.modal}>
                <Text style={styles.title}>Session Timeout</Text>
                <Text style={styles.message}>
                  Do you want to stay logged in? Logging out in {countdown} second
                  {countdown !== 1 ? 's' : ''}.
                </Text>
                <View style={styles.buttons}>
                  <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={handleStayLoggedIn}
                  >
                    <Text style={styles.buttonTextPrimary}>Stay Logged In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
  buttonPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0047AB',
    borderRadius: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: '#fff',
    fontWeight: '600',
  },
});
