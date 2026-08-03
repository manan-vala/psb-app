import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Shadows } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import BobLogo from '../../assets/BOB-Iogo.svg';
import { registerAccount } from '../../services/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (fullName.trim().length < 2) return 'Please enter your full name.';
    if (!/^[6-9]\d{9}$/.test(mobile.trim())) return 'Enter a valid 10-digit mobile number.';
    if (email.trim().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Enter a valid email address.';
    }
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return 'Password must include both letters and numbers.';
    }
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleCreateAccount = () => {
    const error = validate();
    if (error) {
      Alert.alert('Check your details', error);
      return;
    }

    setLoading(true);
    // Simulate account provisioning (this app's backend uses a single mocked
    // demo user — see context/PRD.md — so the account lives on-device).
    setTimeout(async () => {
      try {
        await registerAccount(
          { fullName: fullName.trim(), mobile: mobile.trim(), email: email.trim() || undefined },
          password
        );
        setLoading(false);
        router.replace('/(auth)/set-pin');
      } catch (e) {
        setLoading(false);
        Alert.alert('Something went wrong', 'Could not create your account. Please try again.');
      }
    }, 600);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.topBlob} />

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <BobLogo width={64} height={64} />
            </View>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>Set up secure access to Bob World</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="As per your bank records"
              leadingIcon="person"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
            <Input
              label="Mobile Number"
              placeholder="10-digit mobile number"
              leadingIcon="phone-android"
              value={mobile}
              onChangeText={(t) => setMobile(t.replace(/[^0-9]/g, '').slice(0, 10))}
              keyboardType="number-pad"
              maxLength={10}
            />
            <Input
              label="Email (optional)"
              placeholder="you@example.com"
              leadingIcon="mail-outline"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Password"
              placeholder="At least 8 characters"
              leadingIcon="lock-outline"
              isPassword
              value={password}
              onChangeText={setPassword}
            />
            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              leadingIcon="lock-outline"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <Button label="Create Account" icon="arrow-forward" onPress={handleCreateAccount} loading={loading} />

          <Text style={styles.terms}>
            By continuing, you agree to Bob World's Terms of Service and Privacy Policy.
          </Text>
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
  header: {
    alignItems: 'center',
    marginBottom: Spacing.stackLg,
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
  terms: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: Spacing.stackMd,
    paddingHorizontal: 8,
  },
});
