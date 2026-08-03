import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Shadows } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import BobLogo from '../../assets/BOB-Iogo.svg';
import { getProfile, setSessionActive, verifyPassword } from '../../services/auth';

export default function PasswordLoginScreen() {
  const router = useRouter();
  const { next } = useLocalSearchParams<{ next?: string }>();
  const isPinReset = next === 'set-pin';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleLogin = () => {
    if (!identifier.trim() || !password) {
      Alert.alert('Missing details', 'Please enter your mobile/email and password.');
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      try {
        const profile = await getProfile();
        const identifierMatches =
          !!profile &&
          (profile.mobile === identifier.trim() ||
            (profile.email ?? '').toLowerCase() === identifier.trim().toLowerCase());

        if (!profile || !identifierMatches) {
          setLoading(false);
          Alert.alert('Account not found', 'No account matches that mobile number or email on this device.');
          return;
        }

        const passwordOk = await verifyPassword(password);
        if (!passwordOk) {
          setLoading(false);
          Alert.alert('Incorrect Password', 'The password you entered is incorrect. Please try again.');
          return;
        }

        setLoading(false);

        if (isPinReset) {
          router.replace('/(auth)/set-pin');
        } else {
          await setSessionActive(true);
          router.replace('/(app)/home');
        }
      } catch (e) {
        setLoading(false);
        Alert.alert('Something went wrong', 'Please try again.');
      }
    }, 600);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.topBlob} />

          <TouchableOpacity style={styles.backButton} onPress={handleBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons name="arrow-back" size={26} color={Colors.primary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <BobLogo width={64} height={64} />
            </View>
            <Text style={styles.title}>{isPinReset ? 'Reset your PIN' : 'Login'}</Text>
            <Text style={styles.subtitle}>
              {isPinReset
                ? 'Verify your password to set a new PIN'
                : 'Enter your password to continue'}
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Mobile Number or Email"
              placeholder="Enter mobile number or email"
              leadingIcon="person-outline"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              leadingIcon="lock-outline"
              isPassword
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Button label={isPinReset ? 'Verify & Continue' : 'Login'} icon="login" onPress={handleLogin} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: Spacing.marginMobile,
    paddingTop: 72,
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    padding: 8,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.stackSm,
    ...Shadows.low,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginTop: 6,
    textAlign: 'center',
  },
  form: {
    marginBottom: Spacing.stackMd,
  },
});
