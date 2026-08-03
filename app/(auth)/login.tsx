import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { Colors, Typography, Spacing, Shadows } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { PinKeypad, PinDots } from '../../components/ui/PinKeypad';
import BobLogo from '../../assets/BOB-Iogo.svg';
import {
  getBiometricPreference,
  getProfile,
  setSessionActive,
  verifyPin,
} from '../../services/auth';

const PIN_LENGTH = 4;

type BiometricState = 'checking' | 'unavailable' | 'not-enrolled' | 'disabled-by-user' | 'available';

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [biometricState, setBiometricState] = useState<BiometricState>('checking');
  const [biometricLabel, setBiometricLabel] = useState('Login with Biometrics');

  const refreshBiometricAvailability = useCallback(async () => {
    try {
      const prefEnabled = await getBiometricPreference();
      const hasHardware = await LocalAuthentication.hasHardwareAsync();

      if (!hasHardware) {
        setBiometricState('unavailable');
        return;
      }

      if (!prefEnabled) {
        setBiometricState('disabled-by-user');
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        setBiometricState('not-enrolled');
        return;
      }

      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const isFingerprint = types.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      );
      setBiometricLabel(isFingerprint ? 'Login with Fingerprint' : 'Login with Biometrics');
      setBiometricState('available');
    } catch (e) {
      setBiometricState('unavailable');
    }
  }, []);

  useEffect(() => {
    getProfile().then((profile) => {
      if (profile?.fullName) {
        setFirstName(profile.fullName.trim().split(' ')[0]);
      }
    });
  }, []);

  // Re-check biometric availability every time this screen gains focus, in
  // case the user just enrolled a fingerprint or toggled the preference.
  useFocusEffect(
    useCallback(() => {
      refreshBiometricAvailability();
    }, [refreshBiometricAvailability])
  );

  const handleKeyPress = (newPin: string) => {
    setError(false);
    setPin(newPin);
  };

  const handleLogin = async (currentPin: string) => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const isValid = await verifyPin(currentPin);
        if (!isValid) {
          setLoading(false);
          setError(true);
          setPin('');
          Alert.alert('Incorrect PIN', 'The PIN you entered is incorrect. Please try again.');
          return;
        }
        await setSessionActive(true);
        setLoading(false);
        router.replace('/(app)/home');
      } catch (e) {
        setLoading(false);
        Alert.alert('Something went wrong', 'Please try again.');
        setPin('');
      }
    }, 500);
  };

  const handleBiometricPress = async () => {
    if (biometricState === 'unavailable' || biometricState === 'disabled-by-user') return;

    if (biometricState === 'not-enrolled') {
      Alert.alert(
        'No Fingerprint Found',
        'Please set up a fingerprint or biometric ID in your device settings first, then come back and try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirm your identity to access Bob World',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        await setSessionActive(true);
        router.replace('/(app)/home');
      } else if (result.error && result.error !== 'user_cancel' && result.error !== 'app_cancel') {
        Alert.alert('Authentication Failed', 'We could not verify your biometrics. Please try again or use your PIN.');
      }
    } catch (e) {
      Alert.alert('Authentication Failed', 'We could not verify your biometrics. Please try again or use your PIN.');
    }
  };

  const handleForgotPin = () => {
    setPin('');
    router.push({ pathname: '/(auth)/password-login', params: { next: 'set-pin' } });
  };

  const showBiometricBlock = biometricState !== 'disabled-by-user';
  const isBiometricDimmed = biometricState === 'unavailable' || biometricState === 'checking';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.topBlob} />

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: 'transparent', shadowOpacity: 0, elevation: 0 }]}>
              <BobLogo width={80} height={80} />
            </View>
            <Text style={styles.title}>Bob World</Text>
            <Text style={styles.subtitle}>
              {firstName ? `Welcome back, ${firstName}` : 'Enter 4-digit PIN'}
            </Text>
          </View>

          <View style={styles.form}>
            <PinDots length={PIN_LENGTH} filled={pin.length} error={error} />
            <PinKeypad
              pin={pin}
              maxLength={PIN_LENGTH}
              onChangePin={handleKeyPress}
              onComplete={handleLogin}
              disabled={loading}
            />
            <TouchableOpacity onPress={handleForgotPin}>
              <Text style={styles.forgotPassword}>Forgot PIN?</Text>
            </TouchableOpacity>
          </View>

          {showBiometricBlock && (
            <View style={styles.actions}>
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={isBiometricDimmed ? styles.dimmedWrapper : undefined}>
                <Button
                  label={biometricState === 'not-enrolled' ? 'Set Up Biometrics to Continue' : biometricLabel}
                  variant="secondary"
                  icon="fingerprint"
                  onPress={handleBiometricPress}
                  disabled={loading || biometricState === 'unavailable' || biometricState === 'checking'}
                />
              </View>
              {biometricState === 'unavailable' && (
                <Text style={styles.biometricHint}>Biometric login isn't available on this device.</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLink}>Need Help?</Text>
          <Text style={styles.footerDot}>•</Text>
          <Text style={styles.footerLink}>Security Tips</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.stackLg,
  },
  topBlob: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.primaryFixed + '4D',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.marginMobile,
    marginTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.stackSm,
    ...Shadows.low,
  },
  title: {
    ...Typography.displayLg,
    color: Colors.primary,
  },
  subtitle: {
    ...Typography.bodyLg,
    color: Colors.onSurfaceVariant,
    marginTop: 8,
  },
  form: {
    marginBottom: Spacing.stackLg,
    alignItems: 'center',
  },
  forgotPassword: {
    ...Typography.labelMd,
    color: Colors.primary,
    marginTop: 16,
  },
  actions: {
    gap: Spacing.stackMd,
    marginBottom: Spacing.stackLg,
  },
  dimmedWrapper: {
    opacity: 0.4,
  },
  biometricHint: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: -8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariant + '40',
  },
  dividerText: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    paddingHorizontal: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.stackMd,
  },
  footerLink: {
    ...Typography.bodySm,
    color: Colors.secondary,
    fontFamily: 'WorkSans-Medium',
  },
  footerDot: {
    ...Typography.bodySm,
    color: Colors.secondary,
    marginHorizontal: 8,
  },
});
